import { Outlet } from 'react-router';
import { RestaurantProvider } from '../context/RestaurantContext';
import { SplitBillNavigationGuardProvider } from '../context/SplitBillNavigationGuard';
import { SnackbarProvider } from './labamu/Snackbar';
import { VirtualInputProvider } from '../context/VirtualInputContext';
import { AuthProvider } from '../context/AuthContext';

function Root() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <SplitBillNavigationGuardProvider>
          <SnackbarProvider>
            <VirtualInputProvider>
              <Outlet />
            </VirtualInputProvider>
          </SnackbarProvider>
        </SplitBillNavigationGuardProvider>
      </RestaurantProvider>
    </AuthProvider>
  );
}

Root.displayName = 'Root';

export default Root;