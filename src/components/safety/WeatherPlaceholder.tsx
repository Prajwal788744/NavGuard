import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherPlaceholder = () => {
  const { t } = useTranslation();
  return (
    <motion.div className="glass-card glow-border p-6 space-y-3" whileHover={{ scale: 1.01 }}>
      <div className="flex items-center gap-2">
        <Cloud className="text-cyber-teal" size={24} />
        <h3 className="font-bold">{t('weather_title')}</h3>
      </div>
      <div className="h-24 rounded-lg bg-secondary/50 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">{t('weather_placeholder')}</p>
      </div>
    </motion.div>
  );
};

export default WeatherPlaceholder;
