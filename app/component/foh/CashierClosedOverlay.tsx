import { useState } from 'react';
import { ShoppingBasket } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useSnackbar } from '../labamu/Snackbar';
import { MainBtn } from '../ui/MainBtn';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function CashierClosedOverlay() {
  const { openCashier, cashierBalance } = useRestaurant();
  const snackbar = useSnackbar();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [showOpeningBalanceModal, setShowOpeningBalanceModal] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('');
  const [validatedPin, setValidatedPin] = useState('');

  const handleOpenRegisterClick = () => {
    setShowPinInput(true);
    setPin('');
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      // Auto-submit when 4 digits are entered
      if (newPin.length === 4) {
        handleSubmitPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmitPin = (pinToSubmit: string) => {
    setValidatedPin(pinToSubmit);
    setShowPinInput(false);
    setShowOpeningBalanceModal(true);
    setOpeningBalance(cashierBalance.toString());
  };

  const handleOpenCashier = () => {
    try {
      openCashier(validatedPin, parseFloat(openingBalance));
      snackbar.success('Cashier opened successfully');
      setShowOpeningBalanceModal(false);
      setPin('');
      setOpeningBalance('');
    } catch (error) {
      snackbar.error('Invalid PIN');
      setPin('');
      setShowPinInput(false);
      setShowOpeningBalanceModal(false);
    }
  };

  if (showPinInput) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-12 max-w-[480px] w-full mx-4"
          style={{ borderRadius: 'var(--radius-card)' }}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="w-16 h-16 rounded-full bg-[#006bff] flex items-center justify-center">
              <ShoppingBasket className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>

            <div className="flex flex-col items-center gap-4">
              <p 
                className="text-[#282828] text-center"
                style={{ 
                  fontSize: 'var(--text-h2)',
                  fontWeight: 'var(--font-weight-bold)'
                }}
              >
                Enter PIN
              </p>
              <p 
                className="text-[#7e7e7e] text-center"
                style={{ 
                  fontSize: 'var(--text-p)',
                  fontWeight: 'var(--font-weight-normal)'
                }}
              >
                Enter your 4-digit PIN to open the register
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex gap-4 justify-center">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2"
                  style={{
                    backgroundColor: index < pin.length ? '#006bff' : 'transparent',
                    borderColor: '#006bff'
                  }}
                />
              ))}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-[320px] mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  className="h-[72px] bg-white rounded-lg hover:bg-[#f0f0f0] transition-colors border border-[#e9e9e9]"
                  style={{ 
                    fontSize: 'var(--text-h2)',
                    fontWeight: 'var(--font-weight-semibold)',
                    borderRadius: 'var(--radius-button)'
                  }}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setShowPinInput(false)}
                className="h-[72px] bg-white rounded-lg hover:bg-[#f0f0f0] transition-colors border border-[#e9e9e9]"
                style={{ 
                  fontSize: 'var(--text-p)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: '#d0021b',
                  borderRadius: 'var(--radius-button)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handlePinInput('0')}
                className="h-[72px] bg-white rounded-lg hover:bg-[#f0f0f0] transition-colors border border-[#e9e9e9]"
                style={{ 
                  fontSize: 'var(--text-h2)',
                  fontWeight: 'var(--font-weight-semibold)',
                  borderRadius: 'var(--radius-button)'
                }}
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-[72px] bg-white rounded-lg hover:bg-[#f0f0f0] transition-colors border border-[#e9e9e9]"
                style={{ 
                  fontSize: 'var(--text-p)',
                  fontWeight: 'var(--font-weight-semibold)',
                  borderRadius: 'var(--radius-button)'
                }}
              >
                ⌫
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showOpeningBalanceModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-[500px] w-full mx-4"
          style={{ borderRadius: 'var(--radius-card)' }}
        >
          <div className="space-y-6">
            <div>
              <h2 
                className="text-[#282828]"
                style={{ 
                  fontSize: 'var(--text-h3)',
                  fontWeight: 'var(--font-weight-bold)'
                }}
              >
                Open Cashier
              </h2>
              <p 
                className="text-[#7e7e7e] mt-2"
                style={{ 
                  fontSize: 'var(--text-body)',
                  fontWeight: 'var(--font-weight-regular)'
                }}
              >
                Enter the opening cash balance
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="opening-balance" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                Opening Cash Balance
              </Label>
              <Input
                id="opening-balance"
                type="number"
                placeholder="0.00"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="h-[48px]"
                style={{ fontSize: 'var(--text-p)' }}
              />
            </div>
            
            <div className="flex gap-3 justify-end pt-4">
              <MainBtn 
                variant="secondary" 
                onClick={() => {
                  setShowOpeningBalanceModal(false);
                  setPin('');
                  setValidatedPin('');
                }} 
                size="lg"
              >
                Cancel
              </MainBtn>
              <MainBtn variant="primary" onClick={handleOpenCashier} size="lg">
                Open Cashier
              </MainBtn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default state - show "Open Register" button
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <button
        onClick={handleOpenRegisterClick}
        className="bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105 border border-[#e9e9e9] flex flex-col items-center gap-6 px-16 py-12"
        style={{ borderRadius: 'var(--radius-card)' }}
      >
        <div className="w-20 h-20 rounded-full bg-[#006bff] flex items-center justify-center">
          <ShoppingBasket className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
        <p 
          className="text-[#282828]"
          style={{ 
            fontSize: 'var(--text-h3)',
            fontWeight: 'var(--font-weight-bold)'
          }}
        >
          Open Register
        </p>
      </button>
    </div>
  );
}