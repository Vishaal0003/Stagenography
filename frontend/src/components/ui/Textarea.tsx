import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[100px] w-full rounded-lg border border-dark-border bg-dark-input px-4 py-2 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent disabled:cursor-not-allowed disabled:bg-dark-card disabled:text-text-muted resize-none transition-all',
      className
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
