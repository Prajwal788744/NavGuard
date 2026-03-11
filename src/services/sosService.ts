import { supabase } from '@/lib/supabaseClient';

export async function sendSOSAlert(userId: string, latitude: number, longitude: number) {
  return supabase.from('sos_alerts').insert({ user_id: userId, latitude, longitude, status: 'active' });
}

export async function getSOSAlerts() {
  return supabase.rpc('get_sos_alerts');
}

export async function resolveSOSAlert(alertId: string) {
  return supabase.from('sos_alerts').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', alertId);
}
