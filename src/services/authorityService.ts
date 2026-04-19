import { supabase } from '@/lib/supabaseClient';

export async function getAuthorityProfile(userId: string) {
  return supabase.from('authorities').select('*').eq('id', userId).single();
}

export async function verifyTourist(userId: string) {
  return supabase.from('users').update({ is_verified: true }).eq('id', userId);
}
