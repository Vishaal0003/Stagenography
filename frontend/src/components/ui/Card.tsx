import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-dark-border bg-dark-card shadow-lg p-6 transition-all hover:border-accent-orange/50',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-2xl font-bold text-text-dark', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-4', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';
