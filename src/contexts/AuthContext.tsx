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
  gender?: string;
  dob?: string;
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

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string, name: string) => Promise<AuthResult>;
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
  getAllUsers: () => Promise<User[]>;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, retries = 3): Promise<void> => {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error) {
      console.warn('fetchUserProfile error:', error.message, '| userId:', userId, '| retries left:', retries - 1);
      // Row might not exist yet if the trigger hasn't completed — retry
      if (retries > 1) {
        await new Promise(r => setTimeout(r, 1000));
        return fetchUserProfile(userId, retries - 1);
      }
    }
    if (data) {
      // Map snake_case DB columns to camelCase app fields
      setUser({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        isAdmin: data.role?.trim() === 'authority',
        phone: data.phone,
        nationality: data.nationality,
        emergencyContact: data.emergency_contact,
        bloodGroup: data.blood_group,
        gender: data.gender,
        dob: data.dob,
        idUploaded: !!data.is_verified,
        blockchainId: data.blockchain_id,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(error);
      const code = (error as any).code || (error as any).error_code || '';
      if (code === 'email_not_confirmed') {
        return { success: false, error: 'Please verify your email first. Check your inbox (and spam folder) for the confirmation link.' };
      }
      if (code === 'invalid_credentials') {
        return { success: false, error: 'Invalid email or password.' };
      }
      if (code === 'over_email_send_rate_limit') {
        return { success: false, error: 'Too many attempts. Please wait a moment and try again.' };
      }
      return { success: false, error: error.message || 'Sign in failed. Please try again.' };
    }
    return { success: true };
  };

  const register = async (email: string, password: string, name: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) {
      console.error(error);
      const code = (error as any).code || (error as any).error_code || '';
      if (code === 'over_email_send_rate_limit') {
        return { success: false, error: 'Too many signup attempts. Please wait a few minutes and try again.' };
      }
      if (code === 'user_already_exists') {
        return { success: false, error: 'This email is already registered. Try signing in instead.' };
      }
      if (code === 'email_address_invalid') {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (code === 'weak_password') {
        return { success: false, error: 'Password is too weak. Use at least 6 characters.' };
      }
      return { success: false, error: error.message || 'Registration failed. Please try again.' };
    }
    // Check if this is a fake response (email already exists but Supabase hides it)
    if (data.user?.identities && data.user.identities.length === 0) {
      return { success: false, error: 'This email is already registered. Try signing in instead.' };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Map camelCase app fields to snake_case DB columns
  const toDbFields = (data: Partial<User>): Record<string, unknown> => {
    const map: Record<string, string> = {
      emergencyContact: 'emergency_contact',
      bloodGroup: 'blood_group',
      idUploaded: 'is_verified',
      blockchainId: 'blockchain_id',
    };
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip computed fields that don't exist in DB
      if (key === 'isAdmin') continue;
      result[map[key] || key] = value;
    }
    return result;
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const dbData = toDbFields(data);
    const { error } = await supabase.from('users').update(dbData).eq('id', user.id);
    if (error) {
      console.error('updateProfile error:', error.message, '| data:', dbData);
    } else {
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
    // For authority users, use RPC to bypass RLS
    if (user?.isAdmin) {
      const { data, error } = await supabase.rpc('get_all_alerts_for_admin');
      console.log('getSOSAlerts (admin RPC) result:', { data, error });
      if (error) {
        console.error('Error fetching SOS alerts via RPC:', error);
        return [];
      }
      // Map RPC result to SOSAlert shape
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data || []).map((a: any) => ({
        ...a,
        users: { name: a.user_name, email: a.user_email }
      })) as SOSAlert[];
    }

    // Regular users: normal query (RLS filters to their own)
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
    const { error } = await supabase.rpc('resolve_sos_alert', { alert_id_input: alertId });
    if (error) console.error('Error resolving SOS', error);
  };

  // Map a raw DB user row (snake_case) to camelCase for the frontend
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapDbUser = (row: any) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    phone: row.phone,
    nationality: row.nationality,
    emergencyContact: row.emergency_contact,
    bloodGroup: row.blood_group,
    idUploaded: !!row.is_verified,
    blockchainId: row.blockchain_id,
  });

  const getAllUsers = async () => {
    // For authority users, use RPC to bypass RLS and get all regular users
    if (user?.isAdmin) {
      const { data, error } = await supabase.rpc('get_all_users_for_admin');
      console.log('getAllUsers (admin RPC) result:', { data, error });
      return (data || []).map(mapDbUser);
    }

    // Regular users: normal query
    const { data } = await supabase.from('users').select('*');
    return (data || []).map(mapDbUser);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      console.error('Reset password error:', error);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout, updateProfile, uploadId, triggerSOS, getSOSAlerts, resolveSOSAlert, getAllUsers, resetPassword
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
