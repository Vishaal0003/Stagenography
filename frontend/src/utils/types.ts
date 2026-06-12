/**
 * UI Component Library inspired by shadcn/ui patterns
 */

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}
