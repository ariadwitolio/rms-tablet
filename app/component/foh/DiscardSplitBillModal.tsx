import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { MainBtn } from '../ui/MainBtn';

interface DiscardSplitBillModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DiscardSplitBillModal({ 
  open, 
  onCancel, 
  onConfirm 
}: DiscardSplitBillModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-md" style={{ borderRadius: 'var(--radius-card)' }}>
        <DialogHeader className="space-y-2">
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
            Discard Split Bill?
          </DialogTitle>
          <p style={{ fontSize: 'var(--text-p)' }} className="text-muted-foreground">
            Your split bill configuration will be lost. Are you sure you want to continue?
          </p>
        </DialogHeader>

        <DialogFooter className="gap-3 sm:gap-3 flex-row sm:flex-row w-full">
          <MainBtn
            variant="secondary"
            size="lg"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </MainBtn>
          <MainBtn
            variant="primary"
            size="lg"
            onClick={onConfirm}
            className="flex-1"
          >
            Discard Split Bill
          </MainBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
