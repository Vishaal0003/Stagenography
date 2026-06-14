import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'default' | 'sm' | 'lg';
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseStyles =
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-orange disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default:
      'bg-accent-orange text-dark-bg font-bold hover:bg-accent-orange-hover active:bg-accent-orange-dark shadow-lg hover:shadow-xl',
    outline:
      'border-2 border-dark-border bg-dark-card hover:bg-dark-input text-text-dark',
    ghost: 'hover:bg-dark-input text-text-dark',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    default: 'h-10 px-6 py-2 text-sm',
    sm: 'h-8 px-3 text-xs',
    lg: 'h-12 px-8 text-base',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';
