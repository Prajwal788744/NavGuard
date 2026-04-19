import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, LogIn, ShieldCheck, QrCode, AlertTriangle, MapPin, UserPlus, Upload, Link2, Shield, Monitor, Fingerprint, FileSearch, Activity } from 'lucide-react';
import Shield3D from '@/components/Shield3D';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (user) navigate(user.isAdmin ? '/authority' : '/dashboard');
  }, [user]);

  useEffect(() => {
    const handler = (e: Event) => { (e as BeforeInstallPromptEvent).preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);

    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
    window.addEventListener('appinstalled', () => setIsInstalled(true));

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    }
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, delay },
  });

  const features = [
    { icon: ShieldCheck, title: t('feat_secure_title'), desc: t('feat_secure_desc'), color: 'text-primary' },
    { icon: QrCode, title: t('feat_qr_title'), desc: t('feat_qr_desc'), color: 'text-accent' },
    { icon: AlertTriangle, title: t('feat_sos_title'), desc: t('feat_sos_desc'), color: 'text-destructive' },
    { icon: MapPin, title: t('feat_location_title'), desc: t('feat_location_desc'), color: 'text-cyber-teal' },
  ];

  const steps = [
    { icon: UserPlus, title: t('step1_title'), desc: t('step1_desc'), num: '01' },
    { icon: Upload, title: t('step2_title'), desc: t('step2_desc'), num: '02' },
    { icon: Link2, title: t('step3_title'), desc: t('step3_desc'), num: '03' },
    { icon: Shield, title: t('step4_title'), desc: t('step4_desc'), num: '04' },
  ];

  const authorityCards = [
    { icon: Monitor, title: t('auth_monitor_title'), desc: t('auth_monitor_desc') },
    { icon: Fingerprint, title: t('auth_verify_title'), desc: t('auth_verify_desc') },
    { icon: FileSearch, title: t('auth_evidence_title'), desc: t('auth_evidence_desc') },
    { icon: Activity, title: t('auth_track_title'), desc: t('auth_track_desc') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar showNavLinks />

      {/* Hero */}
      <main className="container max-w-4xl mx-auto px-4 pt-8 pb-12">
        <motion.div {...fadeUp(0)}>
          <Shield3D />
        </motion.div>

        <motion.div className="text-center space-y-4 mt-6" {...fadeUp(0.2)}>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            <span className="text-foreground">{t('hero_safe')}</span>{' '}
            <span className="text-primary glow-text">{t('hero_verified')}</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">{t('hero_sub')}</p>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row gap-3 mt-8 max-w-md mx-auto" {...fadeUp(0.4)}>
          {!isInstalled && (
            <button
              onClick={handleInstall}
              className="w-full bg-primary text-primary-foreground rounded-xl py-4 px-6 font-bold flex items-center justify-center gap-2 glow-green hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <Download size={20} /> {t('install')}
            </button>
          )}
          <button
            onClick={() => navigate('/login')}
            className="w-full glass-card glow-border py-4 px-6 font-bold flex items-center justify-center gap-2 hover:bg-secondary hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <LogIn size={20} /> {t('sign_in')}
          </button>
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div className="text-center mb-12" {...fadeUp(0)}>
            <h2 className="text-2xl md:text-3xl font-black">{t('features_heading')}</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">{t('features_sub')}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="glass-card glow-border p-6 space-y-3 hover:scale-[1.02] transition-transform duration-200 cursor-default"
                {...fadeUp(i * 0.1)}
              >
                <f.icon size={28} className={f.color} />
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div className="text-center mb-12" {...fadeUp(0)}>
            <h2 className="text-2xl md:text-3xl font-black">{t('how_heading')}</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">{t('how_sub')}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                className="glass-card glow-border p-6 text-center space-y-3 hover:scale-[1.02] transition-transform duration-200"
                {...fadeUp(i * 0.1)}
              >
                <span className="text-3xl font-black text-primary/30">{s.num}</span>
                <s.icon size={28} className="mx-auto text-primary" />
                <h3 className="font-bold">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authorities Section */}
      <section id="authorities" className="py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div className="text-center mb-12" {...fadeUp(0)}>
            <h2 className="text-2xl md:text-3xl font-black">{t('auth_heading')}</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto">{t('auth_sub')}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {authorityCards.map((a, i) => (
              <motion.div
                key={i}
                className="glass-card glow-border p-6 space-y-3 hover:scale-[1.02] transition-transform duration-200"
                {...fadeUp(i * 0.1)}
              >
                <a.icon size={28} className="text-accent" />
                <h3 className="font-bold text-lg">{a.title}</h3>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
