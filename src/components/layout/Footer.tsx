import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import logoDark from '@/assets/logos/navguard-compact-dark.svg';
import logoLight from '@/assets/logos/navguard-compact-light.svg';

const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left space-y-2">
            <img src={theme === 'dark' ? logoDark : logoLight} alt="NavGuard" className="h-8 mx-auto md:mx-0" />
            <p className="text-xs text-muted-foreground">{t('footer_tagline')}</p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer_contact')}</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer_privacy')}</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('footer_terms')}</a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">{t('footer_kscest')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
