export const ROLES = {
  USER: 'user',
  AUTHORITY: 'authority',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
