import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-4 select-none">
      <Card variant="solid" className="max-w-md w-full border-rose-500/20 shadow-lg shadow-rose-950/5">
        <CardContent className="flex flex-col items-center text-center p-8">
          
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/35 flex items-center justify-center text-rose-500 mb-5">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h2 className="text-lg font-extrabold text-brand-text mb-2 tracking-tight">
            Failed to Load Tax Metrics
          </h2>
          
          <p className="text-sm text-brand-textMuted mb-6 leading-relaxed">
            {message || 'An unexpected error occurred while communicating with the simulated brokerage database.'}
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentLight text-xs font-bold text-white shadow-glow transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Fetching Data</span>
            </button>
            
            <p className="text-[10px] text-brand-textMuted">
              Note: If this error was simulated, check your Dashboard Header error toggles.
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};
