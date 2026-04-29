import { Outlet, useNavigate, useLocation } from 'react-router';
import { Button } from '../ui/button';
import { Wine, ClipboardList, CheckCircle, UtensilsCrossed, ChefHat, LogOut, Menu, Printer } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useSnackbar } from '../labamu/Snackbar';
import { Chip } from '../ui/Chip';
import { MainBtn } from '../ui/MainBtn';
import { LabamuWordmark } from '../LabamuWordmark';

function BarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentRole, kots, posProfile, setPosProfile } = useRestaurant();
  const snackbar = useSnackbar();

  const handleSwitchToFOH = (profile: 'POS_CASHIER' | 'POS_EMPTY_MENU' | 'POS_IMAGE') => {
    setPosProfile(profile);
    setCurrentRole('FOH');
    navigate('/');
  };

  const handleSwitchToKitchen = () => {
    setCurrentRole('KITCHEN');
    navigate('/kitchen');
  };

  const handleLogout = () => {
    snackbar.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/bar') {
      return location.pathname === '/bar';
    }
    return location.pathname.startsWith(path);
  };

  // Calculate BOT counts (tickets with station = 'BAR')
  const activeBOTCount = kots.filter(kot => kot.station === 'BAR' && kot.status !== 'COMPLETED').length;
  const completedBOTCount = kots.filter(kot => kot.station === 'BAR' && kot.status === 'COMPLETED').length;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="h-[72px] flex shrink-0">
        {/* Header Content — full width, no sidebar offset */}
        <div className="flex-1 bg-card border-b border-border px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Labamu logo — matches POS header */}
            <LabamuWordmark size="sm" style={{ width: 132, height: 'auto' }} />
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MainBtn
                  size="lg"
                  style={{ backgroundColor: '#e6f0ff', borderColor: '#b3d9ff', borderWidth: '1.5px', color: '#282828', fontWeight: 600 }}
                  className="min-w-[56px]"
                >
                  <Menu className="w-5 h-5" />
                </MainBtn>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuItem
                  onClick={() => handleSwitchToFOH('POS_CASHIER')}
                  className="h-12 cursor-pointer"
                  style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span>POS Cashier</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSwitchToFOH('POS_IMAGE')}
                  className="h-12 cursor-pointer"
                  style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span style={{ whiteSpace: 'nowrap' }}>POS Cashier (Image)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSwitchToFOH('POS_EMPTY_MENU')}
                  className="h-12 cursor-pointer"
                  style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span style={{ whiteSpace: 'nowrap' }}>POS Cashier (Empty Menu)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSwitchToKitchen}
                  className="h-12 cursor-pointer"
                  style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
                >
                  <ChefHat className="w-5 h-5" />
                  <span>Kitchen</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate('/printer-settings')}
                  className="h-12 cursor-pointer"
                  style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
                >
                  <Printer className="w-5 h-5" />
                  <span>Printer Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="h-12 cursor-pointer"
                  style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* View Type Navigation */}
      <div
        className="bg-card border-b border-border px-6 flex items-center gap-3 shrink-0"
        style={{ height: 69 }}
      >
        <Chip
          active={isActive('/bar') && location.pathname === '/bar'}
          onClick={() => navigate('/bar')}
          icon={<ClipboardList className="w-5 h-5" />}
          label={`Active Queue (${activeBOTCount})`}
        />
        <Chip
          active={isActive('/bar/completed')}
          onClick={() => navigate('/bar/completed')}
          icon={<CheckCircle className="w-5 h-5" />}
          label={`Completed (${completedBOTCount})`}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

BarLayout.displayName = 'BarLayout';

export default BarLayout;