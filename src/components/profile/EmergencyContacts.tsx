import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Phone, Users, Shield, Landmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Contact {
  id: string;
  name: string;
  number: string;
  type: 'family' | 'police' | 'embassy';
  icon: React.ElementType;
}

const EmergencyContacts = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const contacts: Contact[] = [
    {
      id: '1',
      name: user?.emergencyContact ? t('family_contact') : t('add_family_contact'),
      number: user?.emergencyContact || '—',
      type: 'family',
      icon: Users,
    },
    {
      id: '2',
      name: t('police_emergency'),
      number: '100',
      type: 'police',
      icon: Shield,
    },
    {
      id: '3',
      name: t('tourist_helpline'),
      number: '1363',
      type: 'police',
      icon: Shield,
    },
    {
      id: '4',
      name: t('embassy_helpline'),
      number: '+91-11-24198000',
      type: 'embassy',
      icon: Landmark,
    },
  ];

  const colorMap = {
    family: 'bg-primary/10 text-primary',
    police: 'bg-destructive/10 text-destructive',
    embassy: 'bg-accent/10 text-accent',
  };

  return (
    <motion.div className="glass-card glow-border p-5 space-y-4" whileHover={{ scale: 1.005 }}>
      <div className="flex items-center gap-2">
        <Phone className="text-destructive" size={22} />
        <h3 className="font-bold text-base">{t('emergency_contacts')}</h3>
      </div>

      <div className="space-y-2">
        {contacts.map((contact, i) => {
          const Icon = contact.icon;
          return (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colorMap[contact.type]}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.number}</p>
                </div>
              </div>
              {contact.number !== '—' && (
                <a
                  href={`tel:${contact.number}`}
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Phone size={14} />
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EmergencyContacts;
