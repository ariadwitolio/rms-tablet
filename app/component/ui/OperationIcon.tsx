import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface OperationIconProps {
  icon: LucideIcon;
  className?: string;
  size?: 'default' | 'lg';
}

export function OperationIcon({ icon: Icon, className = '', size = 'default' }: OperationIconProps) {
  const containerSize = size === 'lg' ? 'w-20 h-20' : 'w-10 h-10';
  const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-5 h-5';
  
  return (
    <div 
      className={`${containerSize} rounded-lg flex items-center justify-center ${className}`}
      style={{ backgroundColor: 'var(--feature-brand-container)' }}
    >
      <Icon className={iconSize} style={{ color: 'var(--feature-brand-oncontainer)' }} strokeWidth={size === 'lg' ? 1.5 : 2} />
    </div>
  );
}