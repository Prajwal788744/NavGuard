import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const QRVerify = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  // In production, fetch from backend. For demo, show the ID.
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-lg mx-auto px-4 py-8">
        <motion.div className="glass-card glow-border p-8 text-center space-y-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <ShieldCheck className="mx-auto text-primary" size={48} />
          <h1 className="text-2xl font-black text-primary glow-text">{t('navguard_verified')}</h1>
          <QRCodeSVG value={`navguard://verify/${id}`} size={160} bgColor="transparent" fgColor="currentColor" className="mx-auto text-foreground" />
          <div className="space-y-2 text-sm text-left">
            <p><span className="text-muted-foreground">{t('blockchain_id')}:</span> {id}</p>
            <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> {t('verified')}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default QRVerify;
