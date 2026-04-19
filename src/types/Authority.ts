export interface Authority {
  id: string;
  email: string;
  name: string;
  role: 'authority';
  jurisdiction?: string;
}
