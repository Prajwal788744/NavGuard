import { supabase } from '@/lib/supabaseClient';

export async function getUserProfile(userId: string) {
  return supabase.from('users').select('*').eq('id', userId).single();
}

export async function updateUserProfile(userId: string, data: Record<string, unknown>) {
  return supabase.from('users').update(data).eq('id', userId);
}

export async function getAllUsers() {
  return supabase.rpc('get_all_users');
}
