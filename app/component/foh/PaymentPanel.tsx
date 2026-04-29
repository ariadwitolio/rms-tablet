import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/formatters';
import { CreditCard, Banknote, QrCode, X } from 'lucide-react';
import { useSnackbar } from '../labamu/Snackbar';
import type { PaymentMethod } from '../../types';

interface PaymentPanelProps {
  checkId: string;
  onClose: () => void;
}

export default function PaymentPanel({ checkId, onClose }: PaymentPanelProps) {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { getCheckById, addPayment } = useRestaurant();
  const check = getCheckById(checkId);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');

  if (!check) return null;

  const totalWithTax = check.totalAmount * 1.1;
  const remaining = totalWithTax - check.paidAmount;

  const handlePayment = () => {
    if (!selectedMethod || !amount) {
      snackbar.error('Please select payment method and enter amount');
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      snackbar.error('Invalid amount');
      return;
    }

    if (paymentAmount > remaining) {
      snackbar.error('Amount exceeds remaining balance');
      return;
    }

    addPayment(checkId, selectedMethod, paymentAmount);
    
    if (paymentAmount >= remaining) {
      snackbar.success('Payment completed!');
      setTimeout(() => {
        if (check.serviceType === 'DINE_IN') {
          navigate('/dine-in');
        } else if (check.serviceType === 'TAKEAWAY') {
          navigate('/takeaway');
        } else {
          navigate('/delivery');
        }
      }, 1000);
    } else {
      snackbar.success('Partial payment recorded');
      setAmount('');
      setSelectedMethod(null);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border w-[600px] max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-[20px] font-bold">Payment</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Bill Summary */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-[14px]">Subtotal</p>
              <p className="text-[14px] font-bold">{formatCurrency(check.totalAmount)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-[14px]">Tax (10%)</p>
              <p className="text-[14px] font-bold">{formatCurrency(check.totalAmount * 0.1)}</p>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between">
              <p className="text-[16px] font-bold">Total</p>
              <p className="text-[20px] font-bold text-primary">{formatCurrency(totalWithTax)}</p>
            </div>
            {check.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <p className="text-[14px]">Paid</p>
                  <p className="text-[14px] font-bold">{formatCurrency(check.paidAmount)}</p>
                </div>
                <div className="flex justify-between text-orange-600">
                  <p className="text-[16px] font-bold">Remaining</p>
                  <p className="text-[18px] font-bold">{formatCurrency(remaining)}</p>
                </div>
              </>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={selectedMethod === 'CASH' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setSelectedMethod('CASH')}
                className="h-[80px] flex-col"
              >
                <Banknote className="w-8 h-8 mb-2" />
                <span>Cash</span>
              </Button>
              <Button
                variant={selectedMethod === 'CARD' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setSelectedMethod('CARD')}
                className="h-[80px] flex-col"
              >
                <CreditCard className="w-8 h-8 mb-2" />
                <span>Card</span>
              </Button>
              <Button
                variant={selectedMethod === 'QRIS' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setSelectedMethod('QRIS')}
                className="h-[80px] flex-col"
              >
                <QrCode className="w-8 h-8 mb-2" />
                <span>QRIS</span>
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-[56px] text-[20px]"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Amount</Label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleQuickAmount(remaining)}
                className="h-[48px]"
              >
                Full
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleQuickAmount(Math.ceil(remaining / 2 / 50000) * 50000)}
                className="h-[48px]"
              >
                Half
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleQuickAmount(100000)}
                className="h-[48px]"
              >
                100K
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleQuickAmount(500000)}
                className="h-[48px]"
              >
                500K
              </Button>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            variant="default"
            size="lg"
            onClick={handlePayment}
            disabled={!selectedMethod || !amount}
            className="w-full h-[56px]"
          >
            Confirm Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
