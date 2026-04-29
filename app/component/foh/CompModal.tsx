import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { TextField } from '../ui/TextField';
import { MainBtn } from '../ui/MainBtn';
import { NominalStepper } from '../ui/NominalStepper';
import { formatCurrency } from '../../utils/formatters';

interface CompModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemPrice: number;
  totalQuantity: number; // Total items available to comp
  compedQuantity?: number; // Already comped items
  nonCompedQuantity?: number; // Non-comped items
  statusBreakdown?: string; // e.g., "2x Sent to Kitchen | 1x In Prep | 1x Ready to Serve"
  onConfirm: (data: { quantity: number; reason: string; managerPin: string }) => void;
  onCancel?: () => void;
}

export function CompModal({
  open,
  onOpenChange,
  itemName,
  itemPrice,
  totalQuantity,
  compedQuantity = 0,
  nonCompedQuantity,
  statusBreakdown,
  onConfirm,
  onCancel,
}: CompModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [managerPin, setManagerPin] = useState('');

  const handleBack = () => {
    // Reset form
    setQuantity(1);
    setReason('');
    setManagerPin('');
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (!reason.trim() || !managerPin.trim()) return;
    
    onConfirm({
      quantity,
      reason: reason.trim(),
      managerPin: managerPin.trim(),
    });

    // Reset form
    setQuantity(1);
    setReason('');
    setManagerPin('');
  };

  const isConfirmDisabled = !reason.trim() || !managerPin.trim();

  // Calculate what to display for quantity x price
  const displayNonCompedQty = nonCompedQuantity ?? totalQuantity;

  // Debug logging
  console.log('CompModal Debug:', {
    itemName,
    totalQuantity,
    compedQuantity,
    nonCompedQuantity,
    displayNonCompedQty,
    willShowSelector: displayNonCompedQty > 1
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px]" 
        aria-describedby={(displayNonCompedQty > 0 || compedQuantity > 0) ? undefined : "comp-modal-description"}
      >
        <DialogHeader>
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}>
            {itemName}
          </DialogTitle>
          {(displayNonCompedQty > 0 || compedQuantity > 0) ? (
            <DialogDescription style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }}>
              {displayNonCompedQty > 0 && `${displayNonCompedQty}x ${formatCurrency(itemPrice)}`}
              {compedQuantity > 0 && (
                <>
                  {displayNonCompedQty > 0 && ' | '}
                  {compedQuantity}x Rp 0 [Comped]
                </>
              )}
            </DialogDescription>
          ) : (
            <DialogDescription id="comp-modal-description" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }}>
              Mark items as complimentary
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Status Container */}
        {statusBreakdown && (
          <div className="bg-muted px-4 py-3 -mx-6 -mt-2" style={{ fontSize: 'var(--text-label)' }}>
            <p className="text-muted-foreground">{statusBreakdown}</p>
          </div>
        )}

        <div className="space-y-4 py-4">
          {/* Quantity Selector - Only show if multiple items */}
          {displayNonCompedQty > 1 && (
            <div className="space-y-2">
              <Label style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                <span style={{ color: 'var(--status-red-primary)' }}>* </span>
                Quantity to Comp
              </Label>
              <NominalStepper
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={displayNonCompedQty}
                className="w-full"
              />
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
              <span style={{ color: 'var(--status-red-primary)' }}>* </span>
              Reason
            </Label>
            <TextField
              placeholder="e.g., Staff Meal, VIP Guest, Service Recovery..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="h-[48px]"
            />
          </div>

          {/* Manager PIN */}
          <div className="space-y-2">
            <Label style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
              <span style={{ color: 'var(--status-red-primary)' }}>* </span>
              Manager PIN
            </Label>
            <TextField
              type="password"
              placeholder="Enter manager PIN"
              value={managerPin}
              onChange={(e) => setManagerPin(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="h-[48px]"
              maxLength={4}
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2">
          <MainBtn
            variant="secondary"
            onClick={handleBack}
            size="lg"
            className="w-full"
          >
            Back
          </MainBtn>
          <MainBtn
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            size="lg"
            className="w-full"
          >
            Confirm Comp
          </MainBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}