import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, QrCode, MapPin, CheckCircle2 } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: 'checkin' | 'qr_scan' | 'location';
  title: string;
  time: string;
  location?: string;
}

const TravelTimeline = () => {
  const { t } = useTranslation();

  // Load from localStorage
  const events: TimelineEvent[] = JSON.parse(localStorage.getItem('navguard_timeline') || '[]');

  // Add default events if none exist
  const displayEvents = events.length > 0 ? events : [
    { id: '1', type: 'checkin' as const, title: t('last_checkin'), time: new Date().toLocaleString(), location: 'Current Location' },
    { id: '2', type: 'qr_scan' as const, title: t('last_qr_scan'), time: '—', location: 'Not yet scanned' },
    { id: '3', type: 'location' as const, title: t('last_location'), time: new Date().toLocaleString(), location: 'GPS Active' },
  ];

  const iconMap = {
    checkin: CheckCircle2,
    qr_scan: QrCode,
    location: MapPin,
  };

  const colorMap = {
    checkin: 'text-primary',
    qr_scan: 'text-accent',
    location: 'text-guard-green',
  };

  return (
    <motion.div className="glass-card glow-border p-5 space-y-4" whileHover={{ scale: 1.005 }}>
      <div className="flex items-center gap-2">
        <Clock className="text-accent" size={22} />
        <h3 className="font-bold text-base">{t('travel_timeline')}</h3>
      </div>

      <div className="relative space-y-0">
        {displayEvents.map((event, i) => {
          const Icon = iconMap[event.type] || MapPin;
          const color = colorMap[event.type] || 'text-muted-foreground';
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 pb-4 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <div className={`p-1.5 rounded-full bg-secondary ${color}`}>
                  <Icon size={14} />
                </div>
                {i < displayEvents.length - 1 && (
                  <div className="w-px h-full bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.time}</p>
                {event.location && (
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TravelTimeline;
