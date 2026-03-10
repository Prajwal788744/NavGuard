import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
  phone?: string;
  nationality?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  idUploaded?: boolean;
  blockchainId?: string;
}

export interface SOSAlert {
  id: string;
  user_id: string;
  latitude?: number;
  longitude?: number;
  location_enabled: boolean;
  video_permission: boolean;
  audio_permission: boolean;
  video_url?: string;
  audio_url?: string;
  resolved: boolean;
  created_at: string;
  users?: {
    name: string;
    email: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean | 'verify-email'>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  uploadId: () => void;
  triggerSOS: (
    lat?: number,
    lng?: number,
    videoBlob?: Blob | null,
    audioBlob?: Blob | null,
    locationEnabled?: boolean,
    videoPermission?: boolean,
    audioPermission?: boolean
  ) => Promise<void>;
  getSOSAlerts: () => Promise<SOSAlert[]>;
  resolveSOSAlert: (alertId: string) => Promise<void>;
  getAllUsers: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) {
      setUser({
        ...data,
        isAdmin: data.role === 'authority'
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean | 'verify-email'> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      console.error(error);
      return false;
    }
    // If email confirmation is required, session will be null
    if (data.user && !data.session) {
      return 'verify-email';
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const { error } = await supabase.from('users').update(data).eq('id', user.id);
    if (!error) {
      setUser({ ...user, ...data });
    }
  };

  const uploadId = () => {
    if (!user) return;
    const bid = `NG-0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
    updateProfile({ idUploaded: true, blockchainId: bid });
  };

  const triggerSOS = async (
    lat?: number,
    lng?: number,
    videoBlob?: Blob | null,
    audioBlob?: Blob | null,
    locationEnabled = false,
    videoPermission = false,
    audioPermission = false
  ) => {
    if (!user) return;

    let videoUrl = '';
    let audioUrl = '';

    // Upload media files to storage bucket
    if (videoBlob) {
      const videoPath = `${user.id}/${Date.now()}_video.webm`;
      const { data, error } = await supabase.storage.from('sos_media').upload(videoPath, videoBlob);
      if (!error && data) {
        videoUrl = supabase.storage.from('sos_media').getPublicUrl(videoPath).data.publicUrl;
      }
    }

    if (audioBlob) {
      const audioPath = `${user.id}/${Date.now()}_audio.webm`;
      const { data, error } = await supabase.storage.from('sos_media').upload(audioPath, audioBlob);
      if (!error && data) {
        audioUrl = supabase.storage.from('sos_media').getPublicUrl(audioPath).data.publicUrl;
      }
    }

    const { error } = await supabase.from('sos_alerts').insert({
      user_id: user.id,
      location_enabled: locationEnabled,
      video_permission: videoPermission,
      audio_permission: audioPermission,
      video_url: videoUrl,
      audio_url: audioUrl,
      latitude: lat,
      longitude: lng,
    });

    if (error) {
      console.error('Error triggering SOS:', error);
    }
  };

  const getSOSAlerts = async (): Promise<SOSAlert[]> => {
    const { data, error } = await supabase
      .from('sos_alerts')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching SOS alerts:', error);
      return [];
    }
    return data as SOSAlert[];
  };

  const resolveSOSAlert = async (alertId: string) => {
    const { error } = await supabase.from('sos_alerts').update({ resolved: true }).eq('id', alertId);
    if (error) console.error('Error resolving SOS', error);
  };

  const getAllUsers = async () => {
    const { data } = await supabase.from('users').select('*');
    return data || [];
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, updateProfile, uploadId, triggerSOS, getSOSAlerts, resolveSOSAlert, getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
