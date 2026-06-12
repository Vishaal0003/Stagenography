import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from './ToastProvider';
import { cn } from '../../utils/cn';

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 rounded-lg p-4 text-sm border pointer-events-auto animate-in slide-in-from-right-1/2 duration-300',
            toast.variant === 'destructive'
              ? 'bg-dark-card border-red-600/50 text-red-400'
              : 'bg-dark-card border-accent-orange/50 text-accent-orange'
          )}
        >
          {toast.variant === 'destructive' ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            {toast.title && <p className="font-medium">{toast.title}</p>}
            {toast.description && <p className="text-xs opacity-90">{toast.description}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-lg hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
