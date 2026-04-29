import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useRestaurant } from '../../context/RestaurantContext';
import OperationalOrderScreen from './OperationalOrderScreen';
import PaymentScreen from './PaymentScreen';

export default function CheckScreen() {
  const { checkId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { getCheckById } = useRestaurant();

  const [showPayment, setShowPayment] = useState(false);

  const check = getCheckById(checkId || '');

  // Redirect to table layout if check not found
  useEffect(() => {
    if (!check) {
      navigate('/dine-in', { replace: true });
    }
  }, [check, navigate]);

  // Auto-open payment when navigated from table preview with autoOpenPayment flag
  useEffect(() => {
    if (location.state?.autoOpenPayment && check) {
      setShowPayment(true);
    }
  }, [location.state?.autoOpenPayment, check]);

  if (!check) return null;

  // OperationalOrderScreen is always mounted as the base view.
  // PaymentScreen overlays as a modal on top of it.
  return (
    <>
      <OperationalOrderScreen
        checkId={check.id}
        onClose={() => navigate(-1)}
        onOpenPayment={() => setShowPayment(true)}
        onOpenSplitBill={() => setShowPayment(true)}
        autoPrintBill={!!location.state?.autoPrintBill}
      />
      <PaymentScreen
        open={showPayment}
        checkId={check.id}
        onClose={() => setShowPayment(false)}
        onSuccess={() => {
          setShowPayment(false);
          navigate(-1);
        }}
      />
    </>
  );
}