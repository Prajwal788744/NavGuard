export interface SOSAlert {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'resolved';
  created_at: string;
  resolved_at?: string;
}
