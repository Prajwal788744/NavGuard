import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', nationality: '', emergencyContact: '', bloodGroup: '' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setForm({ name: user.name || '', phone: user.phone || '', nationality: user.nationality || '', emergencyContact: user.emergencyContact || '', bloodGroup: user.bloodGroup || '' });
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    toast.success('Profile saved!');
  };

  const fields = [
    { key: 'name', label: t('name') },
    { key: 'phone', label: t('phone') },
    { key: 'nationality', label: t('nationality') },
    { key: 'emergencyContact', label: t('emergency_contact') },
    { key: 'bloodGroup', label: t('blood_group') },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar showBack />
      <main className="container max-w-lg mx-auto px-4 py-6">
        <motion.div className="glass-card glow-border p-6 space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold">{t('profile')}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground font-medium mb-1 block">{f.label}</label>
                <input
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
                />
              </div>
            ))}
            <button type="submit" className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-bold hover:opacity-90 transition-opacity">{t('save')}</button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
