import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-lg border border-dark-border bg-dark-input px-4 py-2 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent disabled:cursor-not-allowed disabled:bg-dark-card disabled:text-text-muted transition-all',
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';
