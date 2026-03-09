import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import logoDark from '@/assets/navguard-compact-dark.svg';
import logoLight from '@/assets/navguard-compact-light.svg';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { theme } = useTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      const ok = await register(email, password, name);
      if (ok) { toast.success('Account created!'); navigate('/dashboard'); }
      else toast.error('Email already exists');
    } else {
      const ok = await login(email, password);
      if (ok) {
        const u = JSON.parse(localStorage.getItem('navguard_user') || '{}');
        navigate(u.isAdmin ? '/authority' : '/dashboard');
      }
      else toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div className="glass-card glow-border p-8 w-full max-w-sm space-y-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <img src={theme === 'dark' ? logoDark : logoLight} alt="NavGuard" className="h-12" />
          <div className="w-9" /> {/* spacer */}
        </div>
        <h2 className="text-xl font-bold text-center">{isRegister ? t('sign_up') : t('sign_in')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t('name')} required className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('email')} required className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('password')} required className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
          <button type="submit" className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-bold hover:opacity-90 transition-opacity">
            {isRegister ? t('register') : t('login')}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {isRegister ? t('have_account') : t('no_account')}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="text-primary font-semibold">{isRegister ? t('sign_in') : t('sign_up')}</button>
        </p>
        <p className="text-center text-xs text-muted-foreground">{t('admin_login')}</p>
      </motion.div>
    </div>
  );
};

export default Login;
