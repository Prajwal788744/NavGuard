import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, User, LogOut, Menu, X, Globe, ChevronDown, ArrowLeft, MoreVertical, Home, MapPin, Clock, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoDark from '@/assets/logos/navguard-compact-dark.svg';
import logoLight from '@/assets/logos/navguard-compact-light.svg';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' },
];

const navTabs = [
  { id: 'home', icon: Home, labelKey: 'tab_home' },
  { id: 'safety', icon: MapPin, labelKey: 'tab_safe_places' },
  { id: 'tracking', icon: Clock, labelKey: 'tab_tracking' },
  { id: 'geofence', icon: Cloud, labelKey: 'tab_geofence' },
];

interface NavbarProps {
  showBack?: boolean;
  showNavLinks?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Navbar = ({ showBack = false, showNavLinks = false, activeTab, onTabChange }: NavbarProps) => {
  const dashboardTabs = onTabChange ? navTabs : null;
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);

  const navLinks = showNavLinks
    ? [
      { label: t('nav_features'), href: '#features' },
      { label: t('nav_how_it_works'), href: '#how-it-works' },
      { label: t('nav_authorities'), href: '#authorities' },
    ]
    : [];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left — logo */}
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <Link to={user ? (user.isAdmin ? '/authority' : '/dashboard') : '/'}>
            <img src={theme === 'dark' ? logoDark : logoLight} alt="NavGuard" className="h-10" />
          </Link>
        </div>

        {/* Center - desktop nav links (landing) */}
        {navLinks.length > 0 && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}

        {/* Center - dashboard tabs (desktop only, when user is logged in and not on landing) */}
        {user && !showNavLinks && dashboardTabs && (
          <div className="hidden md:flex items-center gap-1">
            {dashboardTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                >
                  <Icon size={16} />
                  {t(tab.labelKey)}
                </button>
              );
            })}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* 3-dot menu — only when logged in */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Menu"
              >
                <MoreVertical size={20} />
              </button>
              <AnimatePresence>
                {mobileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => { setMobileMenuOpen(false); setMobileLangOpen(false); }} />
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 z-50 glass-card glow-border p-1.5 w-52"
                    >
                      <button
                        onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors"
                      >
                        <User size={18} />
                        {t('profile') || 'Profile'}
                      </button>

                      <button
                        onClick={() => { toggle(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors"
                      >
                        {theme === 'dark' ? <Sun size={18} className="text-guard-green" /> : <Moon size={18} className="text-ocean" />}
                        {theme === 'dark' ? (t('light_mode') || 'Light Mode') : (t('dark_mode') || 'Dark Mode')}
                      </button>

                      <button
                        onClick={() => setMobileLangOpen(!mobileLangOpen)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors"
                      >
                        <Globe size={18} />
                        <span className="flex-1 text-left">{t('language') || 'Language'}</span>
                        <ChevronDown size={14} className={`transition-transform ${mobileLangOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {mobileLangOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 py-1 max-h-48 overflow-y-auto">
                              {languages.map((l) => (
                                <button
                                  key={l.code}
                                  onClick={() => { i18n.changeLanguage(l.code); setMobileLangOpen(false); setMobileMenuOpen(false); }}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${i18n.resolvedLanguage === l.code ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                                    }`}
                                >
                                  {l.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="h-px bg-border my-1" />
                      <button
                        onClick={() => { setMobileMenuOpen(false); logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut size={18} />
                        {t('logout') || 'Logout'}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Hamburger for landing page — includes nav links + theme + language */}
          {showNavLinks && (
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Landing hamburger menu — nav links + theme + language */}
      <AnimatePresence>
        {mobileOpen && showNavLinks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="py-3 space-y-1 border-t border-border mt-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                >
                  {link.label}
                </button>
              ))}

              <div className="h-px bg-border my-1" />

              {/* Theme toggle */}
              <button
                onClick={() => { toggle(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} className="text-guard-green" /> : <Moon size={18} className="text-ocean" />}
                {theme === 'dark' ? (t('light_mode') || 'Light Mode') : (t('dark_mode') || 'Dark Mode')}
              </button>

              {/* Language */}
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
              >
                <Globe size={18} />
                <span className="flex-1 text-left">{t('language') || 'Language'}</span>
                <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 py-1 max-h-48 overflow-y-auto">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); setMobileOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${i18n.resolvedLanguage === l.code ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                            }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
