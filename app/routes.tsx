import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import Root from './components/Root';
import { useAuth } from './context/AuthContext';
import FOHLayout from './components/layouts/FOHLayout';
import KitchenLayout from './components/layouts/KitchenLayout';
import BarLayout from './components/layouts/BarLayout';
import FloorLayout from './components/foh/FloorLayout';
import CheckScreen from './components/foh/CheckScreen';
import TakeawayList from './components/foh/TakeawayList';
import DeliveryList from './components/foh/DeliveryList';
import Transactions from './components/foh/Transactions';
import TransactionHistory from './components/foh/TransactionHistory';
import KitchenActiveQueue from './components/kitchen/ActiveQueue';
import KitchenCompletedOrders from './components/kitchen/CompletedOrders';
import BarActiveQueue from './components/bar/ActiveQueue';
import BarCompletedOrders from './components/bar/CompletedOrders';
import LoginScreen from './components/auth/LoginScreen';
import PairingScreen from './components/auth/PairingScreen';
import ModuleMenu from './components/auth/ModuleMenu';
import PrinterSettings from './components/shared/PrinterSettings';

// Guards /login — redirects to /pair if pairing hasn't happened this session
function RequirePaired() {
  const isPaired = sessionStorage.getItem('rms_paired') === 'true';
  if (!isPaired) return <Navigate to="/pair" replace />;
  return <Outlet />;
}

// Guards app routes — redirects to /login if not authenticated
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      // Pairing screen — always accessible
      { path: 'pair', Component: PairingScreen },

      // Login requires pairing to have been completed this session
      {
        Component: RequirePaired,
        children: [
          { path: 'login', Component: LoginScreen },
        ],
      },

      // App routes only require authentication (pairing is done before login)
      {
        Component: RequireAuth,
        children: [
          { path: 'home', Component: ModuleMenu },
          {
            Component: FOHLayout,
            children: [
              { index: true,                 Component: FloorLayout },
              { path: 'dine-in',             Component: FloorLayout },
              { path: 'check/:checkId',      Component: CheckScreen },
              { path: 'takeaway',            Component: TakeawayList },
              { path: 'delivery',            Component: DeliveryList },
              { path: 'transactions',        Component: Transactions },
              { path: 'transaction-history', Component: TransactionHistory },
            ],
          },
          {
            path: 'kitchen',
            Component: KitchenLayout,
            children: [
              { index: true,       Component: KitchenActiveQueue },
              { path: 'completed', Component: KitchenCompletedOrders },
            ],
          },
          {
            path: 'bar',
            Component: BarLayout,
            children: [
              { index: true,       Component: BarActiveQueue },
              { path: 'completed', Component: BarCompletedOrders },
            ],
          },
          { path: 'printer-settings', Component: PrinterSettings },
        ],
      },
    ],
  },
]);
