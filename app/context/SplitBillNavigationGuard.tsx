import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import DiscardSplitBillModal from '../components/foh/DiscardSplitBillModal';

interface SplitBillNavigationGuardContextType {
  registerGuard: (hasUnsavedChanges: () => boolean) => void;
  unregisterGuard: () => void;
  requestNavigation: (onConfirm: () => void) => void;
}

const SplitBillNavigationGuardContext = createContext<SplitBillNavigationGuardContextType | undefined>(undefined);

export function SplitBillNavigationGuardProvider({ children }: { children: React.ReactNode }) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const hasUnsavedChangesRef = useRef<(() => boolean) | null>(null);
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const registerGuard = useCallback((hasUnsavedChanges: () => boolean) => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, []);

  const unregisterGuard = useCallback(() => {
    hasUnsavedChangesRef.current = null;
  }, []);

  const requestNavigation = useCallback((onConfirm: () => void) => {
    if (hasUnsavedChangesRef.current && hasUnsavedChangesRef.current()) {
      // Has unsaved changes, show modal
      pendingNavigationRef.current = onConfirm;
      setShowDiscardModal(true);
    } else {
      // No unsaved changes, proceed immediately
      onConfirm();
    }
  }, []);

  const handleConfirm = () => {
    setShowDiscardModal(false);
    if (pendingNavigationRef.current) {
      pendingNavigationRef.current();
      pendingNavigationRef.current = null;
    }
  };

  const handleCancel = () => {
    setShowDiscardModal(false);
    pendingNavigationRef.current = null;
  };

  return (
    <SplitBillNavigationGuardContext.Provider value={{ registerGuard, unregisterGuard, requestNavigation }}>
      {children}
      <DiscardSplitBillModal
        open={showDiscardModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </SplitBillNavigationGuardContext.Provider>
  );
}

export function useSplitBillNavigationGuard() {
  const context = useContext(SplitBillNavigationGuardContext);
  if (!context) {
    throw new Error('useSplitBillNavigationGuard must be used within SplitBillNavigationGuardProvider');
  }
  return context;
}
