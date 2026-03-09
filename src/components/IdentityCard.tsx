import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, ShieldAlert, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const IdentityCard = ({ onUpload }: { onUpload: () => void }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

  if (!user.idUploaded) {
    return (
      <motion.div className="glass-card glow-border p-6 text-center space-y-4" whileHover={{ scale: 1.01 }}>
        <ShieldAlert className="mx-auto text-guard-green" size={40} />
        <p className="text-sm text-muted-foreground">{t('verify_identity')}</p>
        <button onClick={onUpload} className="bg-primary text-primary-foreground rounded-lg px-6 py-3 font-semibold flex items-center gap-2 mx-auto hover:opacity-90 transition-opacity">
          <Upload size={18} /> {t('upload_gov_id')}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div className="glass-card glow-border p-6 space-y-4" whileHover={{ scale: 1.01 }}>
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-primary" size={28} />
        <div>
          <h3 className="font-bold text-lg">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{t('blockchain_id')}: {user.blockchainId}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <QRCodeSVG value={`navguard://verify/${user.blockchainId}`} size={80} bgColor="transparent" fgColor="currentColor" className="text-foreground" />
        <div className="space-y-1 text-sm">
          <p><span className="text-muted-foreground">{t('name')}:</span> {user.name}</p>
          <p><span className="text-muted-foreground">{t('phone')}:</span> {user.phone || '—'}</p>
          <p className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            {t('verified')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default IdentityCard;
