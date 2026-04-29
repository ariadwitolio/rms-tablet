import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Lock } from 'lucide-react';
import { useSnackbar } from '../labamu/Snackbar';
import { LabamuWordmark } from '../LabamuWordmark';
import { useAuth } from '../../context/AuthContext';
import { TableLayoutPreview } from '../foh/TableLayoutPreview';

export default function LoginScreen() {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { login } = useAuth();
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(60);

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

  const handlePinInput = (digit: string) => {
    // Clear error state and allow new input
    if (isError) {
      setIsError(false);
      setPin(digit);
      return;
    }
    
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);

      // Auto-submit when 6 digits are entered
      if (newPin.length === 6) {
        handleSubmitPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setIsError(false);
    setPin(pin.slice(0, -1));
  };

  const handleSubmitPin = (pinToSubmit: string) => {
    const success = login(pinToSubmit);
    if (success) {
      snackbar.success('Login successful');
      navigate(sessionStorage.getItem('rms_role') === 'KITCHEN' ? '/kitchen' : '/dine-in');
      setPin('');
      setIsError(false);
      setWrongAttempts(0);
    } else {
      setIsError(true);
      snackbar.error('Invalid PIN');
      setWrongAttempts(wrongAttempts + 1);
      if (wrongAttempts >= 2) {
        setIsLocked(true);
        setLockCountdown(60);
      }
      setTimeout(() => {
        setPin('');
        setIsError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (isLocked) {
      const countdownInterval = setInterval(() => {
        setLockCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [isLocked]);

  useEffect(() => {
    if (lockCountdown <= 0) {
      setIsLocked(false);
    }
  }, [lockCountdown]);

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-5 shrink-0" style={{ backgroundColor: 'var(--feature-brand-primary)' }}>
        <div className="flex flex-col">
          <p className="text-white" style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
            {timeString}
          </p>
          <p className="text-white" style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-normal)' }}>
            {dayOfWeek}, {dateString}
          </p>
        </div>
      </div>

      {/* Body — table preview on the left, PIN panel on the right */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: live table layout preview */}
        <div className="flex-1 overflow-hidden">
          <TableLayoutPreview />
        </div>

        {/* Divider */}
        <div style={{ width: 1, backgroundColor: 'var(--neutral-line-outline)', flexShrink: 0 }} />

        {/* Right: PIN panel */}
        <div
          className="w-[420px] flex items-center justify-center px-8 shrink-0"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(74, 144, 226, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(107, 163, 232, 0.12) 0%, transparent 50%),
              #f5f5fa
            `,
          }}
        >
          <div className="flex flex-col items-center gap-[12px] w-full bg-white p-[40px] rounded-[16px]"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
          >
          {/* Logo/Icon */}
          <div className="flex items-center justify-center">
            <LabamuWordmark size="lg" />
          </div>

          {isLocked ? (
            /* Locked State */
            <div className="flex flex-col items-center gap-6 mt-8">
              <div className="flex items-center justify-center w-24 h-24 rounded-full" style={{ backgroundColor: 'var(--feature-brand-primary)', opacity: 0.1 }}>
                <Lock size={32} style={{ color: 'var(--destructive)' }} />
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <p 
                  className="text-center"
                  style={{ 
                    fontSize: 'var(--text-h3)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--destructive)'
                  }}
                >
                  Device Locked
                </p>
                <p 
                  className="text-[#7e7e7e] text-center max-w-[300px]"
                  style={{ 
                    fontSize: 'var(--text-p)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}
                >
                  Device locked due to multiple incorrect PIN attempts.
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 mt-4">
                <p 
                  className="text-[#7e7e7e]"
                  style={{ 
                    fontSize: 'var(--text-p)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}
                >
                  Try again in
                </p>
                <p 
                  style={{ 
                    fontSize: 'var(--text-h1)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--destructive)'
                  }}
                >
                  {lockCountdown}s
                </p>
              </div>

              <button
                onClick={() => {
                  setIsLocked(false);
                  setWrongAttempts(0);
                  setPin('');
                  setIsError(false);
                }}
                className="mt-4 px-6 py-3 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: 'var(--feature-brand-primary)',
                  color: 'white',
                  fontSize: 'var(--text-p)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}
              >
                Reinput PIN
              </button>
            </div>
          ) : (
            /* Normal PIN Input State */
            <>
              <div className="flex flex-col items-center gap-2">
                <p 
                  className="text-[#282828] text-center"
                  style={{ 
                    fontSize: 'var(--text-h2)',
                    fontWeight: 'var(--font-weight-bold)'
                  }}
                >
                  Welcome Back
                </p>
                <p 
                  className="text-[#7e7e7e] text-center"
                  style={{ 
                    fontSize: 'var(--text-p)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}
                >
                  Enter your 6-digit PIN to continue
                </p>
              </div>

              {/* PIN Dots Display */}
              <div className="flex gap-4 justify-center mt-[24px] mb-[8px]">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      backgroundColor: isError ? 'var(--destructive)' : (index < pin.length ? '#006bff' : 'transparent'),
                      borderColor: isError ? 'var(--destructive)' : (index < pin.length ? '#006bff' : 'var(--neutral-surface-greydarker)')
                    }}
                  />
                ))}
              </div>

              {/* Error Message */}
              <div className="h-[24px] flex items-center justify-center mb-[16px]">
                {isError && (
                  <p 
                    className="text-center"
                    style={{ 
                      fontSize: 'var(--text-p)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--destructive)'
                    }}
                  >
                    Incorrect PIN, please reinput the correct one.
                  </p>
                )}
              </div>

              {/* Number Pad */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-[320px]">
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
                <div className="h-[72px]" /> {/* Empty space */}
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
            </>
          )}
          </div>{/* end inner card */}
        </div>{/* end right PIN panel */}
      </div>{/* end body row */}
    </div>
  );
}