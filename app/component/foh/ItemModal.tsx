import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { TextField } from '../ui/TextField';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { MainBtn } from '../ui/MainBtn';
import { Plus, Trash2, Printer, Ban, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { CompModal } from './CompModal';
import { VoidItemModal } from './VoidItemModal';
import { useSnackbar } from '../labamu/Snackbar';
import { useVirtualInputContext } from '../../context/VirtualInputContext';

interface ItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'ADD' | 'EDIT';
  itemId?: string;
  itemStatus?: 'DRAFT' | 'SENT' | 'PREPARING' | 'FIRED' | 'COMPLETED';
  menuItem: {
    id: string;
    name: string;
    price: number;
    availableModifiers: Array<string | { name: string; price: number }>;
  } | null;
  selectedModifiers: string[];
  onModifiersChange: (modifiers: string[]) => void;
  modifierNotes: string;
  onNotesChange: (notes: string) => void;
  discountType: 'PERCENTAGE' | 'FIXED';
  onDiscountTypeChange: (type: 'PERCENTAGE' | 'FIXED') => void;
  discountValue: string;
  onDiscountValueChange: (value: string) => void;
  isComplimentary: boolean;
  onComplimentaryChange: (isComp: boolean) => void;
  compReason: string;
  onCompReasonChange: (reason: string) => void;
  compManagerPin: string;
  onCompManagerPinChange: (pin: string) => void;
  // Dine type per-item
  dineType?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  onDineTypeChange?: (type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY') => void;
  packagingPrice?: string;
  onPackagingPriceChange?: (price: string) => void;
  onConfirm: () => void;
  onDelete?: () => void;
  onSend?: () => void;
  onVoid?: (data: { reason: string; managerPin: string }) => void;
  onReprint?: () => void;
  isReprinting?: boolean;
  checkStatus?: string;
  /** Called immediately when a non-draft item is confirmed as comp — bypasses the staged state pattern so changes persist without a Save button. */
  onComp?: (data: { reason: string }) => void;
}

export function ItemModal({
  open,
  onOpenChange,
  mode = 'ADD',
  itemId,
  itemStatus,
  menuItem,
  selectedModifiers,
  onModifiersChange,
  modifierNotes,
  onNotesChange,
  discountType,
  onDiscountTypeChange,
  discountValue,
  onDiscountValueChange,
  isComplimentary,
  onComplimentaryChange,
  compReason,
  onCompReasonChange,
  compManagerPin,
  onCompManagerPinChange,
  dineType = 'DINE_IN',
  onDineTypeChange,
  packagingPrice = '',
  onPackagingPriceChange,
  onConfirm,
  onDelete,
  onSend,
  onVoid,
  onReprint,
  isReprinting = false,
  checkStatus,
  onComp
}: ItemModalProps) {
  const snackbar = useSnackbar();
  const ctx = useVirtualInputContext();
  // CompModal state
  const [showCompModal, setShowCompModal] = useState(false);
  // VoidItemModal state
  const [showVoidModal, setShowVoidModal] = useState(false);

  const handleToggleModifier = (modifierName: string, checked: boolean) => {
    if (checked) {
      onModifiersChange([...selectedModifiers, modifierName]);
    } else {
      onModifiersChange(selectedModifiers.filter(m => m !== modifierName));
    }
  };

  const handleCompToggleChange = (checked: boolean) => {
    if (checked) {
      // Show CompModal when toggled on
      setShowCompModal(true);
    } else {
      // Turn off comp
      onComplimentaryChange(false);
      onCompReasonChange('');
      onCompManagerPinChange('');
    }
  };

  const handleCompModalConfirm = (data: { quantity: number; reason: string; managerPin: string }) => {
    // Validate Manager PIN
    if (data.managerPin !== '1234') {
      snackbar.error('Invalid Manager PIN');
      return;
    }

    // For non-DRAFT items (SENT, IN_PREP, READY, SERVED), immediately persist via onComp
    // so the change is not lost (there is no "Save" button for fired items).
    if (onComp) {
      onComp({ reason: data.reason });
      setShowCompModal(false);
      return;
    }

    // For DRAFT items: stage the change in parent state; parent "Save" button commits it.
    onComplimentaryChange(true);
    onCompReasonChange(data.reason);
    onCompManagerPinChange(data.managerPin);
    setShowCompModal(false);
  };

  const handleCompModalCancel = () => {
    setShowCompModal(false);
    // Don't change the toggle state - keep it off
  };

  const handleVoidModalConfirm = (data: { reason: string; managerPin: string }) => {
    // Validate Manager PIN
    if (data.managerPin !== '1234') {
      snackbar.error('Invalid Manager PIN');
      return;
    }

    // Pass data to parent
    onVoid?.(data);
    setShowVoidModal(false);
  };

  const handleVoidModalCancel = () => {
    setShowVoidModal(false);
  };

  if (!menuItem) return null;

  // Determine if sections are editable based on itemStatus
  const isModifiersEditable = mode === 'ADD' || itemStatus === 'DRAFT';
  const isNotesEditable = mode === 'ADD' || itemStatus === 'DRAFT';
  const isDiscountEditable = mode === 'ADD' || itemStatus === 'DRAFT';
  // Allow comp for DRAFT and SENT items (as long as check is not paid)
  const isCompEditable = (mode === 'ADD' || itemStatus === 'DRAFT' || itemStatus === 'SENT') && checkStatus !== 'FULLY_PAID' && checkStatus !== 'PARTIALLY_PAID';
  
  // Show modifiers section: for editable items only when there are available modifiers;
  // for non-editable items always (to show selected modifiers or "–")
  const shouldShowModifiers = !isModifiersEditable || menuItem.availableModifiers.length > 0;
  
  // Show comp section for SENT items as well (now editable if not paid)
  const shouldShowCompSection = mode === 'ADD' || itemStatus === 'DRAFT' || itemStatus === 'SENT';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: '20px', fontWeight: 'var(--font-weight-bold)' }}>
              {menuItem.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 px-[0px] pt-[0px] pb-[16px]">
            {/* Price */}
            <div className="flex items-center gap-3">
              {discountValue && parseFloat(discountValue) > 0 ? (
                <>
                  <p style={{ fontSize: '16px', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-secondary)' }} className="line-through">
                    {formatCurrency(menuItem.price)}
                  </p>
                  <p style={{ fontSize: '16px', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-secondary)' }}>
                    {formatCurrency(
                      discountType === 'PERCENTAGE'
                        ? menuItem.price * (1 - parseFloat(discountValue) / 100)
                        : Math.max(0, menuItem.price - parseFloat(discountValue))
                    )}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: '16px', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-secondary)' }}>
                  {formatCurrency(menuItem.price)}
                </p>
              )}
            </div>

            {/* ── Dine Type — only for DRAFT items ─────────────────────── */}
            {(mode === 'ADD' || itemStatus === 'DRAFT') && onDineTypeChange && (
              <div className="space-y-3 pt-1">
                <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
                  Dine Type
                </Label>

                {/* Selectable card selection */}
                 <div className="grid grid-cols-2 gap-3">
                   {(['DINE_IN', 'TAKEAWAY'] as const).map(type => {
                     const isActive = dineType === type;
                     const label = type === 'DINE_IN' ? 'Dine In' : 'Takeaway';
                     return (
                       <label
                         key={type}
                         className={`relative flex items-center gap-3 cursor-pointer transition-all overflow-hidden ${
                           isActive
                             ? 'bg-primary/5'
                             : 'hover:bg-[var(--neutral-surface-greylighter)]'
                         }`}
                         style={{
                           borderRadius: 'var(--radius-card)',
                           border: isActive
                             ? '1px solid var(--primary)'
                             : '1px solid var(--neutral-10)',
                           padding: '16px 20px',
                           height: '68px',
                           userSelect: 'none',
                         }}
                       >
                         <input
                           type="radio"
                           name="dineType"
                           value={type}
                           checked={isActive}
                           onChange={() => {
                             onDineTypeChange(type);
                             if (type === 'DINE_IN') onPackagingPriceChange?.('');
                           }}
                           style={{ display: 'none' }}
                         />
                         {/* Radio indicator */}
                         <span
                           style={{
                             width: 20,
                             height: 20,
                             borderRadius: '50%',
                             border: `2px solid ${isActive ? 'var(--primary)' : 'var(--neutral-line-outline)'}`,
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             flexShrink: 0,
                             transition: 'border-color 0.15s',
                             backgroundColor: 'var(--neutral-surface-primary)',
                           }}
                         >
                           {isActive && (
                             <span
                               style={{
                                 width: 10,
                                 height: 10,
                                 borderRadius: '50%',
                                 backgroundColor: 'var(--primary)',
                               }}
                             />
                           )}
                         </span>
                         {/* Label text */}
                         <span
                           style={{
                             fontFamily: 'Lato, sans-serif',
                             fontSize: 'var(--text-p)',
                             fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                             color: isActive ? 'var(--primary)' : 'var(--neutral-onsurface-primary)',
                             transition: 'color 0.15s',
                           }}
                         >
                           {label}
                         </span>
                       </label>
                     );
                   })}
                 </div>

                {/* Packaging price — shown only for Takeaway / Delivery */}
                {(dineType === 'TAKEAWAY' || dineType === 'DELIVERY') && onPackagingPriceChange && (
                  <div className="space-y-2">
                    <Label style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)', color: 'var(--neutral-onsurface-secondary)' }}>
                      Packaging Price
                    </Label>
                    <div className="relative bg-white rounded-[10px] border border-[#e9e9e9]">
                      <span
                        className="absolute left-[16px] top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                        style={{ fontSize: 'var(--text-p)' }}
                      >
                        IDR
                      </span>
                      <input
                        type="text"
                        readOnly
                        placeholder="0"
                        value={packagingPrice}
                        onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', packagingPrice, (val) => onPackagingPriceChange?.(val), e.currentTarget); }}
                        className="w-full py-[12px] pl-[52px] pr-[16px] rounded-[10px] bg-transparent outline-none"
                        style={{ fontSize: 'var(--text-p)', cursor: 'pointer' }}
                      />
                    </div>
                    {packagingPrice && parseFloat(packagingPrice) > 0 && (
                      <p style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-secondary)' }}>
                        Total price:{' '}
                        <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--feature-brand-primary)' }}>
                          {formatCurrency(menuItem.price + parseFloat(packagingPrice))}
                        </span>
                        {' '}(base {formatCurrency(menuItem.price)} + packaging {formatCurrency(parseFloat(packagingPrice))})
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Modifiers Grid */}
            {shouldShowModifiers && (
              <div className="space-y-3">
                <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
                  {isModifiersEditable ? 'Select Modifiers' : 'Modifier:'}
                </Label>
                {/* For non-editable items, show "value" or "-" after the label */}
                {!isModifiersEditable && (
                  <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)', color: selectedModifiers.length > 0 ? 'var(--neutral-onsurface-primary)' : 'var(--neutral-onsurface-secondary)' }}>
                    {selectedModifiers.length > 0 ? selectedModifiers.join(', ') : '-'}
                  </p>
                )}
                
                {/* For editable items, show grid of checkboxes */}
                {isModifiersEditable && menuItem.availableModifiers.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {menuItem.availableModifiers.map(modifier => {
                      const modifierName = typeof modifier === 'string' ? modifier : modifier.name;
                      const modifierPrice = typeof modifier === 'string' ? null : modifier.price;
                      const isChecked = selectedModifiers.includes(modifierName);
                      
                      return (
                        <label
                          key={modifierName}
                          className={`relative flex flex-col p-5 bg-card cursor-pointer transition-all overflow-hidden ${
                            isChecked ? 'border-primary bg-primary/5' : 'hover:border-primary/50 hover:bg-[var(--neutral-surface-greylighter)]'
                          }`}
                          style={{ 
                            borderRadius: 'var(--radius-card)',
                            border: isChecked ? '1px solid var(--primary)' : '1px solid var(--neutral-10)',
                            height: '68px'
                          }}
                        >
                          {modifierPrice && (
                            <div 
                              className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1" 
                              style={{ 
                                fontSize: 'var(--text-label)', 
                                fontWeight: 'var(--font-weight-bold)',
                                borderBottomLeftRadius: 'var(--radius-small)'
                              }}
                            >
                              + {formatCurrency(modifierPrice)}
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => handleToggleModifier(modifierName, !!checked)}
                              disabled={!isModifiersEditable}
                            />
                            <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }} className="flex-1 pr-2">
                              {modifierName}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
                {isNotesEditable ? 'Item Notes (Optional)' : 'Notes:'}
              </Label>
              {/* For non-editable items, show "value" or "-" after the label */}
              {!isNotesEditable ? (
                <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)', color: modifierNotes ? 'var(--neutral-onsurface-primary)' : 'var(--neutral-onsurface-secondary)' }}>
                  {modifierNotes || '-'}
                </p>
              ) : (
                <Textarea
                  placeholder="e.g., No onions, extra spicy..."
                  value={modifierNotes}
                  onChange={(e) => onNotesChange(e.target.value)}
                  className="min-h-[100px]"
                  style={{ 
                    borderRadius: 'var(--radius-input)', 
                    fontSize: 'var(--text-p)',
                    border: '1px solid var(--neutral-10)'
                  }}
                  disabled={!isNotesEditable}
                />
              )}
            </div>

            {/* Discount Section */}
            {isDiscountEditable && (
              <div className="space-y-3 pt-2">
                <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
                  Discount
                </Label>
                
                <div>
                  {/* Discount Field Container */}
                  <div className="flex gap-[10px] items-center">
                    {/* Toggle Container */}
                    <div className="flex items-center p-[4px] relative rounded-[10px] shrink-0 border border-primary">
                      <button
                        type="button"
                        onClick={() => onDiscountTypeChange('FIXED')}
                        className={`flex items-center justify-center px-[10px] py-[9px] rounded-[8px] w-[56px] h-[40px] transition-colors ${
                          discountType === 'FIXED' 
                            ? 'bg-primary text-white' 
                            : 'bg-transparent text-primary'
                        }`}
                      >
                        <span style={{ fontSize: 'var(--text-label)' }}>IDR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDiscountTypeChange('PERCENTAGE')}
                        className={`flex items-center justify-center px-[10px] py-[9px] rounded-[8px] w-[56px] h-[40px] transition-colors ${
                          discountType === 'PERCENTAGE' 
                            ? 'bg-primary text-white' 
                            : 'bg-transparent text-primary'
                        }`}
                      >
                        <span style={{ fontSize: 'var(--text-label)' }}>%</span>
                      </button>
                    </div>

                    {/* Input Field */}
                    <div className="flex-1 relative bg-white rounded-[10px] border border-[#e9e9e9]">
                      <input
                        type="text"
                        readOnly
                        placeholder="0"
                        value={discountValue}
                        onClick={(e) => {
                          ctx.openFor('numeric', discountValue, (val) => {
                            if (val === '' || val === '0') { onDiscountValueChange(val); return; }
                            const numValue = parseFloat(val);
                            if (isNaN(numValue) || numValue < 0) { onDiscountValueChange('0'); return; }
                            if (discountType === 'PERCENTAGE') {
                              onDiscountValueChange(numValue > 100 ? '100' : val);
                            } else {
                              const itemPrice = menuItem?.price || 0;
                              onDiscountValueChange(numValue > itemPrice ? itemPrice.toString() : val);
                            }
                          }, e.currentTarget);
                        }}
                        className={`w-full py-[12px] rounded-[10px] bg-transparent outline-none text-left ${
                          discountType === 'FIXED' 
                            ? 'pl-[60px] pr-[16px]' 
                            : 'pl-[16px] pr-[60px]'
                        }`}
                        style={{ fontSize: 'var(--text-p)', cursor: 'pointer' }}
                      />
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                          discountType === 'FIXED' ? 'left-[16px]' : 'right-[16px]'
                        }`} 
                        style={{ fontSize: 'var(--text-p)' }}
                      >
                        {discountType === 'PERCENTAGE' ? '%' : 'IDR'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mark as Comp - Hide when check is paid (fully or partially) */}
            {checkStatus !== 'FULLY_PAID' && checkStatus !== 'PARTIALLY_PAID' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between gap-3">
                  <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
                    {isComplimentary ? 'Item is Comped' : 'Mark as Comp'}
                  </Label>
                  {isComplimentary ? (
                    <MainBtn
                      variant="destructive"
                      size="md"
                      onClick={() => {
                        onComplimentaryChange(false);
                        onCompReasonChange('');
                        onCompManagerPinChange('');
                      }}
                      style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                      Unmark Comp
                    </MainBtn>
                  ) : (
                    <MainBtn
                      variant="secondary"
                      size="md"
                      onClick={() => setShowCompModal(true)}
                      disabled={checkStatus === 'FULLY_PAID' || checkStatus === 'PARTIALLY_PAID'}
                      style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                      Mark as Comp
                    </MainBtn>
                  )}
                </div>
                {isComplimentary && compReason && (
                  <div className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                    Reason: {compReason}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="gap-3 sm:gap-3">
            {mode === 'ADD' && (
              <MainBtn
                variant="primary"
                size="lg"
                onClick={onConfirm}
                className="w-full"
              >
                <Plus className="w-5 h-5" />
                Add to Order
              </MainBtn>
            )}

            {mode === 'EDIT' && itemStatus === 'DRAFT' && (
              <>
                <MainBtn
                  variant="destructive"
                  size="lg"
                  onClick={onDelete}
                  className="flex-1"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </MainBtn>
                <MainBtn
                  variant="secondary"
                  size="lg"
                  onClick={onConfirm}
                  className="flex-1"
                >
                  Update
                </MainBtn>
                <MainBtn
                  variant="primary"
                  size="lg"
                  onClick={onSend}
                  className="flex-1"
                >
                  <Printer className="w-5 h-5" />
                  Send to Kitchen
                </MainBtn>
              </>
            )}

            {mode === 'EDIT' && itemStatus === 'SENT' && (
              <>
                <MainBtn
                  variant="destructive"
                  size="lg"
                  onClick={() => setShowVoidModal(true)}
                  className="flex-1"
                >
                  <Ban className="w-5 h-5 mr-2" />
                  Void Item
                </MainBtn>
                {onReprint && (
                  <MainBtn
                    variant="secondary"
                    size="lg"
                    onClick={onReprint}
                    className="flex-1"
                    disabled={isReprinting}
                  >
                    {isReprinting
                      ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      : <Printer className="w-5 h-5 mr-2" />
                    }
                    {isReprinting ? 'Reprinting…' : 'Reprint Ticket'}
                  </MainBtn>
                )}
              </>
            )}

            {/* Reprint Ticket for non-DRAFT, non-SENT statuses (IN_PREP, READY, SERVED) */}
            {mode === 'EDIT' && itemStatus !== 'DRAFT' && itemStatus !== 'SENT' && (
              <div className="flex gap-3 w-full">
                {onReprint && (
                  <MainBtn
                    variant="secondary"
                    size="lg"
                    onClick={onReprint}
                    className="flex-1"
                    disabled={isReprinting}
                  >
                    {isReprinting
                      ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      : <Printer className="w-5 h-5 mr-2" />
                    }
                    {isReprinting ? 'Reprinting…' : 'Reprint Ticket'}
                  </MainBtn>
                )}
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CompModal - Shows on top of ItemModal */}
      <CompModal
        open={showCompModal}
        onOpenChange={setShowCompModal}
        itemName={menuItem.name}
        itemPrice={menuItem.price}
        totalQuantity={1}
        onConfirm={handleCompModalConfirm}
        onCancel={handleCompModalCancel}
      />

      {/* VoidItemModal - Shows on top of ItemModal */}
      <VoidItemModal
        open={showVoidModal}
        onOpenChange={setShowVoidModal}
        itemName={menuItem.name}
        onConfirm={handleVoidModalConfirm}
        onCancel={handleVoidModalCancel}
      />
    </>
  );
}