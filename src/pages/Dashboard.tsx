import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinOff, MapPin, Shield, Clock, Video, Mic } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import SOSButton from '@/components/sos/SOSButton';
import IdentityCard from '@/components/identity/IdentityCard';
import WeatherPlaceholder from '@/components/safety/WeatherPlaceholder';
import GeofencePlaceholder from '@/components/safety/GeofencePlaceholder';
import SafePlacesFinder from '@/components/safety/SafePlacesFinder';
import TravelTimeline from '@/components/timeline/TravelTimeline';
import EmergencyContacts from '@/components/profile/EmergencyContacts';
import UploadPopup from '@/components/identity/UploadPopup';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';

import { toast } from 'sonner';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, loading, uploadId } = useAuth();
  const navigate = useNavigate();
  const [locationOn, setLocationOn] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showFirstUpload, setShowFirstUpload] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return; // Wait for auth to finish loading
    if (!user) { navigate('/login'); return; }
    if (user.isAdmin) { navigate('/authority'); return; }
    if (!user.idUploaded) setShowFirstUpload(true);
    checkLocation();
    checkDevices();
  }, [user, loading]);

  const checkLocation = () => {
    navigator.geolocation?.getCurrentPosition(() => setLocationOn(true), () => setLocationOn(false));
  };

  const checkDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission(true);
      setMicPermission(true);
    } catch {
      // Check individual permissions
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
        camStream.getTracks().forEach(track => track.stop());
        setCameraPermission(true);
      } catch { setCameraPermission(false); }
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStream.getTracks().forEach(track => track.stop());
        setMicPermission(true);
      } catch { setMicPermission(false); }
    }
  };

  const handleRequestLocation = () => {
    // Show loading spinner while auth is initializing
    checkLocation();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  const handleRequestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission(true);
    } catch { toast.error(t('pls_allow_settings') || 'Please allow camera in site settings'); }
  };
  const handleRequestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission(true);
    } catch { toast.error(t('pls_allow_settings') || 'Please allow mic in site settings'); }
  };

  const handleAgree = () => {
    setShowFirstUpload(false);
    setShowUpload(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = () => {
    uploadId();
    toast.success('ID uploaded & Blockchain ID generated!');
  };

  const card = (i: number, children: React.ReactNode) => (
    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
      {children}
    </motion.div>
  );

  const tabContent: Record<string, React.ReactNode> = {
    home: (
      <div className="space-y-4 md:space-y-6">
        {card(0, <IdentityCard onUpload={() => setShowUpload(true)} />)}
        {card(1,
          <div className="flex items-center justify-center py-6">
            <SOSButton />
          </div>
        )}
        {card(2, <EmergencyContacts />)}
      </div>
    ),
    safety: (
      <div className="space-y-4 md:space-y-6">
        {card(0, <SafePlacesFinder />)}
      </div>
    ),
    tracking: (
      <div className="space-y-4 md:space-y-6">
        {card(0, <TravelTimeline />)}
      </div>
    ),
    geofence: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {card(0, <GeofencePlaceholder />)}
        {card(1, <WeatherPlaceholder />)}
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Desktop tabs now in Navbar — only mobile BottomNav below */}
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
      <UploadPopup open={showFirstUpload || showUpload} onAgree={handleAgree} onLater={() => { setShowFirstUpload(false); setShowUpload(false); }} />

      <main className="container max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-6 pb-24 flex-1">
        {/* Permission Status Banners */}
        <div className="space-y-2">
          {card(0,
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${locationOn ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              <MapPin size={18} />
              {locationOn ? t('location_on') : t('location_off')}
              {!locationOn && <button onClick={handleRequestLocation} className="ml-auto px-3 py-1 bg-background text-foreground rounded text-xs font-bold shadow-sm">Enable</button>}
            </div>
          )}
          {cameraPermission !== null && card(1,
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${cameraPermission ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              <Video size={18} />
              {cameraPermission ? (t('camera_permission_granted') || 'Camera permission granted') : (t('camera_permission_denied') || 'Camera permission not granted')}
              {!cameraPermission && <button onClick={handleRequestCamera} className="ml-auto px-3 py-1 bg-background text-foreground rounded text-xs font-bold shadow-sm">Enable</button>}
            </div>
          )}
          {micPermission !== null && card(2,
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${micPermission ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
              <Mic size={18} />
              {micPermission ? (t('mic_permission_granted') || 'Microphone permission granted') : (t('mic_permission_denied') || 'Microphone permission not granted')}
              {!micPermission && <button onClick={handleRequestMic} className="ml-auto px-3 py-1 bg-background text-foreground rounded text-xs font-bold shadow-sm">Enable</button>}
            </div>
          )}
        </div>

        {/* Tab Content — driven by bottom nav */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <BottomNav active={activeTab} onChange={setActiveTab} mobileOnly />
    </div>
  );
};

export default Dashboard;
