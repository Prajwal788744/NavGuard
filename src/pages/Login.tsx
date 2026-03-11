import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock, User, KeyRound } from 'lucide-react';
import logoDark from '@/assets/logos/navguard-compact-dark.svg';
import logoLight from '@/assets/logos/navguard-compact-light.svg';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading, login, register, resetPassword } = useAuth();
  const { theme } = useTheme();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Once user profile loads, redirect to correct dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate(user.isAdmin ? '/authority' : '/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === 'register') {
        const result = await register(email, password, name);
        if (result === 'verify-email') {
          toast.success('A verification link has been sent to your email. Please check your inbox and verify your account before signing in.');
          setMode('login');
          setPassword('');
        } else if (result === true) {
          toast.success('Account created!');
        } else {
          toast.error('Registration failed. This email may already be registered. Try signing in or use Forgot Password.');
        }
      } else if (mode === 'forgot') {
        if (!email) {
          toast.error('Please enter your email address.');
          setSubmitting(false);
          return;
        }
        const ok = await resetPassword(email);
        if (ok) {
          toast.success('Password reset link sent! Please check your email inbox.');
          setMode('login');
        } else {
          toast.error('Could not send reset link. Please check the email and try again.');
        }
      } else {
        const ok = await login(email, password);
        if (ok) {
          toast.success('Signed in successfully!');
        } else {
          toast.error('Invalid email or password.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = () => {
    if (mode === 'register') return t('sign_up');
    if (mode === 'forgot') return 'Forgot Password';
    return t('sign_in');
  };

  const getButtonText = () => {
    if (submitting) {
      if (mode === 'forgot') return 'Sending...';
      if (mode === 'register') return 'Creating Account...';
      return 'Signing In...';
    }
    if (mode === 'register') return t('register');
    if (mode === 'forgot') return 'Send Reset Link';
    return t('login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="glass-card glow-border p-8 w-full max-w-sm space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between">
          <button onClick={() => mode !== 'login' ? setMode('login') : navigate('/')} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft size={20} />
          </button>
          <img src={theme === 'dark' ? logoDark : logoLight} alt="NavGuard" className="h-12" />
          <div className="w-9" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-center">{getTitle()}</h2>

            {mode === 'forgot' && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <KeyRound size={28} className="text-primary" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Enter your registered email address and we'll send you a link to reset your password.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t('name')}
                    required
                    className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
                  />
                </div>
              )}
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('email')}
                  required
                  className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
                />
              </div>
              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={t('password')}
                    required
                    className="w-full bg-secondary rounded-lg pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 ring-primary"
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground rounded-lg py-3 font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {getButtonText()}
              </button>
            </form>

            {mode === 'login' && (
              <button
                onClick={() => setMode('forgot')}
                className="w-full text-center text-sm text-primary font-medium hover:underline transition-all"
              >
                Forgot Password?
              </button>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {mode === 'register' && <>{t('have_account')}{' '}</>}
              {mode === 'login' && <>{t('no_account')}{' '}</>}
              {mode === 'forgot' ? (
                <button onClick={() => setMode('login')} className="text-primary font-semibold hover:underline">
                  Back to Sign In
                </button>
              ) : (
                <button
                  onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                  className="text-primary font-semibold hover:underline"
                >
                  {mode === 'register' ? t('sign_in') : t('sign_up')}
                </button>
              )}
            </p>

            {mode !== 'forgot' && (
              <p className="text-center text-xs text-muted-foreground">{t('admin_login')}</p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
