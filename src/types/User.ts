export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  nationality?: string;
  blood_group?: string;
  emergency_contact?: string;
  is_verified?: boolean;
  blockchain_id?: string;
  avatar_url?: string;
  created_at?: string;
}
