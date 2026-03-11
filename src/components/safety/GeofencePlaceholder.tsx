import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const GeofencePlaceholder = () => {
  const { t } = useTranslation();
  return (
    <motion.div className="glass-card glow-border p-6 space-y-3" whileHover={{ scale: 1.01 }}>
      <div className="flex items-center gap-2">
        <MapPin className="text-guard-green" size={24} />
        <h3 className="font-bold">{t('geofence_title')}</h3>
      </div>
      <div className="h-24 rounded-lg bg-secondary/50 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">{t('geofence_placeholder')}</p>
      </div>
    </motion.div>
  );
};

export default GeofencePlaceholder;
