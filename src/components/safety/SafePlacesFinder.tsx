import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Building2, Hotel, Landmark, MapPin, ChevronRight, Phone } from 'lucide-react';

interface SafePlace {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'hotel' | 'embassy';
  distance: string;
  address: string;
  phone: string;
}

const MOCK_PLACES: SafePlace[] = [
  { id: '1', name: 'Central Police Station', type: 'police', distance: '0.8 km', address: '123 Main Road', phone: '100' },
  { id: '2', name: 'Tourist Police Helpdesk', type: 'police', distance: '1.2 km', address: '45 Station Road', phone: '1363' },
  { id: '3', name: 'City General Hospital', type: 'hospital', distance: '1.5 km', address: '78 Health Avenue', phone: '108' },
  { id: '4', name: 'Apollo Emergency Care', type: 'hospital', distance: '2.1 km', address: '90 Medical Lane', phone: '1066' },
  { id: '5', name: 'Taj Verified Hotel', type: 'hotel', distance: '0.5 km', address: '12 Heritage Street', phone: '+91-80-12345678' },
  { id: '6', name: 'ITC Grand', type: 'hotel', distance: '1.8 km', address: '56 Royal Road', phone: '+91-80-87654321' },
  { id: '7', name: 'US Embassy', type: 'embassy', distance: '3.2 km', address: '24 Shantipath', phone: '+91-11-24198000' },
  { id: '8', name: 'UK High Commission', type: 'embassy', distance: '3.8 km', address: '50 Diplomatic Enclave', phone: '+91-11-26872161' },
];

const typeConfig = {
  police: { icon: Shield, label: 'police_stations', color: 'text-destructive' },
  hospital: { icon: Building2, label: 'hospitals', color: 'text-primary' },
  hotel: { icon: Hotel, label: 'verified_hotels', color: 'text-accent' },
  embassy: { icon: Landmark, label: 'embassies', color: 'text-guard-green' },
};

const SafePlacesFinder = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'police' | 'hospital' | 'hotel' | 'embassy'>('police');

  const filtered = MOCK_PLACES.filter(p => p.type === activeTab);
  const config = typeConfig[activeTab];

  return (
    <motion.div className="glass-card glow-border p-5 space-y-4" whileHover={{ scale: 1.005 }}>
      <div className="flex items-center gap-2">
        <MapPin className="text-primary" size={22} />
        <h3 className="font-bold text-base">{t('safe_places')}</h3>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map(type => {
          const cfg = typeConfig[type];
          const Icon = cfg.icon;
          return (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              <Icon size={14} />
              {t(cfg.label)}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          {filtered.map(place => (
            <div key={place.id} className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{place.name}</p>
                <p className="text-xs text-muted-foreground">{place.address}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{place.distance} away</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <a href={`tel:${place.phone}`} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Phone size={14} />
                </a>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SafePlacesFinder;
