// Centralised auth state — consumed by AuthContext
// Extend this with Zustand or another state manager as needed.
export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  isAdmin: boolean;
}

export const defaultAuthState: AuthState = {
  isAuthenticated: false,
  userId: null,
  isAdmin: false,
};
