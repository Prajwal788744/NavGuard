import React, { useState, useEffect } from 'react';
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
  const { user, loading, login, register, resetPassword } = useAuth();
  const { theme } = useTheme();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Once user profile loads, redirect to correct dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate(user.isAdmin ? '/authority' : '/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      const result = await register(email, password, name);
      if (result === 'verify-email') {
        toast.success('A verification link has been sent to your email. Please check your inbox and verify your account before signing in.');
        setMode('login');
      } else if (result === true) {
        toast.success('Account created!');
      } else {
        toast.error('Registration failed. Email may already exist.');
      }
    } else if (mode === 'forgot') {
      if (!email) {
        toast.error('Please enter your email address.');
        return;
      }
      const ok = await resetPassword(email);
      if (ok) {
        toast.success('Password reset link sent! Check your email inbox.');
        setMode('login');
      } else {
        toast.error('Failed to send reset link. Please check the email address.');
      }
    } else {
      const ok = await login(email, password);
      if (ok) {
        toast.success('Signed in successfully!');
      } else {
        toast.error('Invalid credentials');
      }
    }
  };

  const getTitle = () => {
    if (mode === 'register') return t('sign_up');
    if (mode === 'forgot') return t('forgot_password') || 'Forgot Password';
    return t('sign_in');
  };

  const getButtonText = () => {
    if (mode === 'register') return t('register');
    if (mode === 'forgot') return t('send_reset_link') || 'Send Reset Link';
    return t('login');
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
        <h2 className="text-xl font-bold text-center">{getTitle()}</h2>
        {mode === 'forgot' && (
          <p className="text-center text-sm text-muted-foreground">
            Enter your email and we'll send you a link to reset your password.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t('name')} required className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('email')} required className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
          {mode !== 'forgot' && (
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('password')} required className="w-full bg-secondary rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 ring-primary" />
          )}
          <button type="submit" className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-bold hover:opacity-90 transition-opacity">
            {getButtonText()}
          </button>
        </form>
        {mode === 'login' && (
          <button onClick={() => setMode('forgot')} className="w-full text-center text-sm text-primary font-medium hover:underline">
            {t('forgot_password') || 'Forgot Password?'}
          </button>
        )}
        <p className="text-center text-sm text-muted-foreground">
          {mode === 'register' ? t('have_account') : mode === 'login' ? t('no_account') : ''}{' '}
          {mode === 'forgot' ? (
            <button onClick={() => setMode('login')} className="text-primary font-semibold">Back to Sign In</button>
          ) : (
            <button onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="text-primary font-semibold">
              {mode === 'register' ? t('sign_in') : t('sign_up')}
            </button>
          )}
        </p>
        <p className="text-center text-xs text-muted-foreground">{t('admin_login')}</p>
      </motion.div>
    </div>
  );
};

export default Login;
