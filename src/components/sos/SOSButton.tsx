import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const SOSButton = () => {
  const { t } = useTranslation();
  const { triggerSOS } = useAuth();
  const [activated, setActivated] = useState(false);

  const handleSOS = async () => {
    if (activated) return;
    setActivated(true);
    toast.error(t('sos_activated'));

    let lat: number | undefined;
    let lng: number | undefined;
    let locationEnabled = false;

    // Always try to get location first — this is the priority
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      locationEnabled = true;
    } catch {
      console.log('Location unavailable - sending SOS without GPS');
    }

    let videoBlob: Blob | null = null;
    let audioBlob: Blob | null = null;
    let videoPermission = false;
    let audioPermission = false;

    // Try camera/audio recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoPermission = true;
      audioPermission = true;

      const options = MediaRecorder.isTypeSupported('video/webm') ? { mimeType: 'video/webm' } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

      const recordingPromise = new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: options?.mimeType || 'video/mp4' });
          resolve(blob);
          stream.getTracks().forEach(t => t.stop());
        };
      });

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 5000);

      videoBlob = await recordingPromise;

    } catch {
      console.log('Camera/audio access denied or not fully available - trying audio only');
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioPermission = true;

        const options = MediaRecorder.isTypeSupported('audio/webm') ? { mimeType: 'audio/webm' } : undefined;
        const mediaRecorder = new MediaRecorder(audioStream, options);
        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

        const recordingPromise = new Promise<Blob>((resolve) => {
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: options?.mimeType || 'audio/mp4' });
            resolve(blob);
            audioStream.getTracks().forEach(t => t.stop());
          };
        });

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000);

        audioBlob = await recordingPromise;

      } catch {
        console.log('Audio access denied - SOS still sent with no media');
      }
    }

    // Send SOS alert to authority dashboard via Supabase
    await triggerSOS(lat, lng, videoBlob, audioBlob, locationEnabled, videoPermission, audioPermission);
    toast.success(t('sos_alert_sent'));

    setTimeout(() => setActivated(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={handleSOS}
        className="relative w-28 h-28 rounded-full bg-destructive flex items-center justify-center animate-pulse-sos"
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-destructive-foreground font-black text-2xl tracking-wider">{t('sos')}</span>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-destructive"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-destructive"
          animate={{ scale: [1, 1.7, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.button>
      <AnimatePresence>
        {activated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-destructive text-sm font-medium"
          >
            <AlertTriangle size={16} /> {t('sos_activated')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SOSButton;
