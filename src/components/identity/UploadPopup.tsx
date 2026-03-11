import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Camera } from 'lucide-react';

interface Props {
  open: boolean;
  onAgree: () => void;
  onLater: () => void;
}

const UploadPopup = ({ open, onAgree, onLater }: Props) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card glow-border p-6 max-w-sm w-full text-center space-y-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="text-primary" size={32} />
            </div>
            <h2 className="text-xl font-bold">{t('upload_id_title')}</h2>
            <p className="text-muted-foreground text-sm">{t('upload_id_text')}</p>
            <div className="flex gap-3">
              <button onClick={onAgree} className="flex-1 bg-primary text-primary-foreground rounded-lg py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <Camera size={18} /> {t('agree')}
              </button>
              <button onClick={onLater} className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition-opacity">
                {t('do_it_later')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadPopup;
