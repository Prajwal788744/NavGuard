import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import hi from './hi.json';
import kn from './kn.json';
import ta from './ta.json';
import te from './te.json';
import ml from './ml.json';
import mr from './mr.json';
import bn from './bn.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  ta: { translation: ta },
  te: { translation: te },
  ml: { translation: ml },
  mr: { translation: mr },
  bn: { translation: bn },
  es: {
    translation: {
      hero_safe: "Viaja Seguro.",
      hero_verified: "Mantente Verificado.",
      install: "Instalar NavGuard",
      sign_in: "Iniciar Sesión",
      sign_up: "Registrarse",
      sos: "SOS",
      dashboard: "Panel",
      safe_places: "Lugares Seguros",
      emergency_contacts: "Contactos de Emergencia",
      travel_timeline: "Línea de Tiempo de Viaje",
      weather_title: "Información del Clima",
      geofence_title: "Monitoreo de Zona Segura",
      location_on: "Ubicación Activa",
      location_off: "Ubicación Apagada – Habilítela por seguridad",
      section_safety: "Seguridad y Alertas",
      section_tracking: "Seguimiento e Info",
      tab_home: "Inicio",
      tab_safe_places: "Lugares Seguros",
      tab_tracking: "Cronología",
      tab_weather: "Clima",
      tab_geofence: "Geo Cercado",
      authority_dashboard: "Panel de Autoridades",
      sos_alerts: "Alertas SOS",
      all_users: "Todos los Usuarios",
      nav_features: "Características",
      nav_how_it_works: "Cómo Funciona",
      nav_authorities: "Autoridades",
    }
  },
  fr: {
    translation: {
      hero_safe: "Voyagez en sécurité.",
      hero_verified: "Restez vérifié.",
      install: "Installer NavGuard",
      sign_in: "Se connecter",
      sign_up: "S'inscrire",
      sos: "SOS",
      dashboard: "Tableau de bord",
      safe_places: "Lieux Sûrs",
      emergency_contacts: "Contacts d'Urgence",
      travel_timeline: "Chronologie de Voyage",
      weather_title: "Informations Météo",
      geofence_title: "Surveillance Zone de Sécurité",
      location_on: "Localisation Active",
      location_off: "Localisation Désactivée – Activez pour la sécurité",
      section_safety: "Sécurité & Alertes",
      section_tracking: "Suivi & Info",
      tab_home: "Accueil",
      tab_safe_places: "Lieux Sûrs",
      tab_tracking: "Chronologie",
      tab_weather: "Météo",
      tab_geofence: "Géo Clôture",
      authority_dashboard: "Tableau de bord Autorités",
      sos_alerts: "Alertes SOS",
      all_users: "Tous les Utilisateurs",
      nav_features: "Fonctionnalités",
      nav_how_it_works: "Comment ça marche",
      nav_authorities: "Autorités",
    }
  },
  ja: {
    translation: {
      hero_safe: "安全に旅行。",
      hero_verified: "認証済みを維持。",
      install: "NavGuardをインストール",
      sign_in: "サインイン",
      sign_up: "サインアップ",
      sos: "SOS",
      dashboard: "ダッシュボード",
      safe_places: "安全な場所",
      emergency_contacts: "緊急連絡先",
      travel_timeline: "旅行タイムライン",
      weather_title: "天気情報",
      geofence_title: "安全ゾーン監視",
      location_on: "位置情報アクティブ",
      location_off: "位置情報オフ – 安全のために有効にしてください",
      section_safety: "安全とアラート",
      section_tracking: "追跡と情報",
      tab_home: "ホーム",
      tab_safe_places: "安全な場所",
      tab_tracking: "タイムライン",
      tab_weather: "天気",
      tab_geofence: "ジオフェンシング",
      authority_dashboard: "当局ダッシュボード",
      sos_alerts: "SOSアラート",
      all_users: "全ユーザー",
      nav_features: "機能",
      nav_how_it_works: "使い方",
      nav_authorities: "当局",
    }
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  detection: { order: ['localStorage', 'navigator', 'htmlTag'] },
  load: 'languageOnly',
});

export default i18n;
