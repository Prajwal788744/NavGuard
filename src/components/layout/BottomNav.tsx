import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, MapPin, Clock, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  active: string;
  onChange: (tab: string) => void;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
}

const tabs = [
  { id: 'home', icon: Home, labelKey: 'tab_home' },
  { id: 'safety', icon: MapPin, labelKey: 'tab_safe_places' },
  { id: 'tracking', icon: Clock, labelKey: 'tab_tracking' },
  { id: 'geofence', icon: Cloud, labelKey: 'tab_geofence' },
];

const BottomNav = ({ active, onChange, desktopOnly, mobileOnly }: BottomNavProps) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Desktop: top horizontal tabs */}
      {!mobileOnly && (
      <nav className="hidden md:block sticky top-[52px] z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2 max-w-3xl lg:max-w-5xl mx-auto px-6 h-14">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon size={18} />
                {t(tab.labelKey)}
                {isActive && (
                  <motion.div
                    layoutId="topnav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
      )}

      {/* Mobile: bottom nav */}
      {!desktopOnly && (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-indicator"
                    className="absolute -top-px left-3 right-3 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  className={isActive ? 'text-primary' : 'text-muted-foreground'}
                />
                <span
                  className={`text-[10px] font-medium leading-tight ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {t(tab.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
      )}
    </>

  );
};

export default BottomNav;
