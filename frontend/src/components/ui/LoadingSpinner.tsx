import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClass = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClass} animate-spin text-accent-orange`} />
    </div>
  );
}
