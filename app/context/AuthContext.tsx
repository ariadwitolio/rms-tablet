import { createContext, useContext, useState, type ReactNode } from 'react';

export type AuthRole = 'CASHIER_WAITRESS' | 'KITCHEN' | 'ADMIN';

export const PIN_TO_ROLE: Record<string, AuthRole> = {
  '123456': 'CASHIER_WAITRESS',
  '222222': 'KITCHEN',
  '333333': 'ADMIN',
};

interface AuthContextType {
  isAuthenticated: boolean;
  role: AuthRole | null;
  login: (pin: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem('rms_auth') === 'true'
  );
  const [role, setRole] = useState<AuthRole | null>(
    () => (sessionStorage.getItem('rms_role') as AuthRole | null)
  );

  const login = (pin: string): boolean => {
    const r = PIN_TO_ROLE[pin];
    if (!r) return false;
    sessionStorage.setItem('rms_auth', 'true');
    sessionStorage.setItem('rms_role', r);
    setIsAuthenticated(true);
    setRole(r);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem('rms_auth');
    sessionStorage.removeItem('rms_role');
    sessionStorage.removeItem('rms_paired');
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
