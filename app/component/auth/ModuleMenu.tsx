import { useNavigate } from 'react-router';
import { UtensilsCrossed, ChefHat, Wine, Printer, LogOut } from 'lucide-react';
import { useAuth, type AuthRole } from '../../context/AuthContext';
import { LabamuWordmark } from '../LabamuWordmark';

interface Module {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  bg: string;
  color: string;
  path: string;
}

const MODULE_LIBRARY: Record<string, Module> = {
  pos: {
    key: 'pos',
    label: 'POS Cashier',
    description: 'Table service & orders',
    icon: UtensilsCrossed,
    bg: '#EBF3FF',
    color: '#006BFF',
    path: '/dine-in',
  },
  kitchen: {
    key: 'kitchen',
    label: 'Kitchen',
    description: 'Kitchen display & queue',
    icon: ChefHat,
    bg: '#FEF3C7',
    color: '#D97706',
    path: '/kitchen',
  },
  bar: {
    key: 'bar',
    label: 'Bar',
    description: 'Bar display & queue',
    icon: Wine,
    bg: '#FCE7F3',
    color: '#DB2777',
    path: '/bar',
  },
  printer: {
    key: 'printer',
    label: 'Printer Settings',
    description: 'Configure printers',
    icon: Printer,
    bg: '#F3F4F6',
    color: '#4B5563',
    path: '/printer-settings',
  },
};

const ROLE_MODULES: Record<AuthRole, string[]> = {
  CASHIER_WAITRESS: ['pos', 'printer'],
  KITCHEN:          ['kitchen', 'bar', 'printer'],
  ADMIN:            ['pos', 'kitchen', 'bar', 'printer'],
};

const ROLE_LABELS: Record<AuthRole, string> = {
  CASHIER_WAITRESS: 'Cashier / Waitress',
  KITCHEN:          'Kitchen Staff',
  ADMIN:            'Admin / Manager',
};

export default function ModuleMenu() {
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const modules = role
    ? ROLE_MODULES[role].map(k => MODULE_LIBRARY[k])
    : [];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F5F5FA' }}>

      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: 72, backgroundColor: '#fff', borderBottom: '1px solid var(--neutral-line-outline)' }}
      >
        <LabamuWordmark size="sm" />

        <div className="flex items-center gap-3">
          {role && (
            <span
              style={{
                fontSize: 12,
                fontFamily: 'Lato, sans-serif',
                fontWeight: 600,
                color: 'var(--feature-brand-primary)',
                backgroundColor: '#EBF3FF',
                padding: '4px 12px',
                borderRadius: 999,
              }}
            >
              {ROLE_LABELS[role]}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
            style={{
              fontSize: 14,
              fontFamily: 'Lato, sans-serif',
              fontWeight: 600,
              color: '#6B7280',
              border: '1px solid var(--neutral-line-outline)',
            }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>

      {/* Module grid */}
      <div className="flex-1 flex flex-col items-center justify-center gap-10 p-8">
        <div className="text-center">
          <p
            style={{
              fontSize: 'var(--text-h2)',
              fontWeight: 'var(--font-weight-bold)',
              fontFamily: 'Lato, sans-serif',
              color: '#282828',
            }}
          >
            Select Module
          </p>
          <p
            style={{
              fontSize: 'var(--text-p)',
              fontFamily: 'Lato, sans-serif',
              color: '#7E7E7E',
              marginTop: 4,
            }}
          >
            Choose a module to get started
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(modules.length, 3)}, 1fr)`,
            gap: 24,
          }}
        >
          {modules.map(mod => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.key}
                onClick={() => navigate(mod.path)}
                className="flex flex-col items-center gap-4 bg-white rounded-2xl transition-all"
                style={{
                  width: 200,
                  padding: '36px 24px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)';
                  (e.currentTarget as HTMLElement).style.borderColor = mod.color + '40';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    backgroundColor: mod.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon style={{ width: 34, height: 34, color: mod.color }} />
                </div>
                <div className="text-center">
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      fontFamily: 'Lato, sans-serif',
                      color: '#282828',
                    }}
                  >
                    {mod.label}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      fontFamily: 'Lato, sans-serif',
                      color: '#9CA3AF',
                      marginTop: 3,
                    }}
                  >
                    {mod.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
