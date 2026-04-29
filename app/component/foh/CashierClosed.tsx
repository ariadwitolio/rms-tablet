import { useState } from 'react';
import { ShoppingBasket, User, ChefHat, Wine, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useRestaurant } from '../../context/RestaurantContext';
import { useSnackbar } from '../labamu/Snackbar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MainBtn } from '../ui/MainBtn';
import { OperationIcon } from '../ui/OperationIcon';

export default function CashierClosed() {
  const navigate = useNavigate();
  const { openCashier, setCurrentRole, cashierBalance } = useRestaurant();
  const snackbar = useSnackbar();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [showOpeningBalanceModal, setShowOpeningBalanceModal] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('');
  const [validatedPin, setValidatedPin] = useState('');

  // Get current time and date
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = now.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

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

  const handleSwitchToKitchen = () => {
    setCurrentRole('KITCHEN');
    navigate('/kitchen');
  };

  const handleSwitchToBar = () => {
    setCurrentRole('BAR');
    navigate('/bar');
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
    }
  };

  if (showPinInput) {
    return (
      <div 
        className="h-screen w-full flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #e8e8f0 0%, #f5f5fa 50%, #e8e8f0 100%)'
        }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex flex-col">
            <p 
              className="text-[#282828]"
              style={{ 
                fontSize: 'var(--text-h3)',
                fontWeight: 'var(--font-weight-bold)'
              }}
            >
              {timeString}
            </p>
            <p 
              className="text-[#7e7e7e]"
              style={{ 
                fontSize: 'var(--text-label)',
                fontWeight: 'var(--font-weight-normal)'
              }}
            >
              {dayOfWeek}, {dateString}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-[48px] px-6 bg-white"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleSwitchToKitchen} className="h-12 cursor-pointer">
                <ChefHat className="w-5 h-5" />
                <span>Switch to Kitchen</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSwitchToBar} className="h-12 cursor-pointer">
                <Wine className="w-5 h-5" />
                <span>Switch to Bar</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/login')} className="h-12 cursor-pointer">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* PIN Input Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
          <div className="flex flex-col items-center gap-8 max-w-[400px] w-full">
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
            <div className="grid grid-cols-3 gap-4 w-full max-w-[320px] mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handlePinInput(num.toString())}
                  className="h-[72px] bg-white rounded-lg hover:bg-[#f0f0f0] transition-colors border border-[#e9e9e9]"
                  style={{ 
                    fontSize: 'var(--text-h2)',
                    fontWeight: 'var(--font-weight-semibold)'
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
                  color: '#d0021b'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handlePinInput('0')}
                className="h-[72px] bg-white rounded-lg hover:bg-[#f0f0f0] transition-colors border border-[#e9e9e9]"
                style={{ 
                  fontSize: 'var(--text-h2)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-[72px] bg-white rounded-lg hover:bg-[#f0f0f0] transition-colors border border-[#e9e9e9]"
                style={{ 
                  fontSize: 'var(--text-p)',
                  fontWeight: 'var(--font-weight-semibold)'
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

  return (
    <div 
      className="h-screen w-full flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #e8e8f0 0%, #f5f5fa 50%, #e8e8f0 100%)'
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-6">
        <div className="flex flex-col">
          <p 
            className="text-[#282828]"
            style={{ 
              fontSize: 'var(--text-h3)',
              fontWeight: 'var(--font-weight-bold)'
            }}
          >
            {timeString}
          </p>
          <p 
            className="text-[#7e7e7e]"
            style={{ 
              fontSize: 'var(--text-label)',
              fontWeight: 'var(--font-weight-normal)'
            }}
          >
            {dayOfWeek}, {dateString}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-[48px] px-6 bg-white"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleSwitchToKitchen} className="h-12 cursor-pointer">
              <ChefHat className="w-5 h-5" />
              <span>Switch to Kitchen</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSwitchToBar} className="h-12 cursor-pointer">
              <Wine className="w-5 h-5" />
              <span>Switch to Bar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/login')} className="h-12 cursor-pointer">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content - Centered "Open Register" Card */}
      <div className="flex-1 flex items-center justify-center px-8">
        <button
          onClick={handleOpenRegisterClick}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-[#e9e9e9] flex flex-col items-center gap-4 px-16 py-12"
          style={{ borderRadius: 'var(--radius-card)' }}
        >
          <OperationIcon icon={ShoppingBasket} size="lg" />
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

      {/* Opening Balance Modal */}
      <Dialog open={showOpeningBalanceModal} onOpenChange={setShowOpeningBalanceModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Open Cashier
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Enter the opening cash balance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
          </div>
          
          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}