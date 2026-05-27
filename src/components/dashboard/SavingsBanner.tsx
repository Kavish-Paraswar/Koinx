import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CurrencyText } from '../ui/CurrencyText';
import { motion, AnimatePresence } from 'framer-motion';

interface SavingsBannerProps {
  savings: number;
}

export const SavingsBanner: React.FC<SavingsBannerProps> = ({ savings }) => {
  const hasSavings = savings > 0;

  return (
    <AnimatePresence>
      {hasSavings && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="overflow-hidden mb-6 sm:mb-8 select-none"
        >
          {/* Main banner card */}
          <div className="bg-gradient-to-r from-brand-accent/20 via-emerald-500/10 to-brand-accent/5 border border-brand-accent/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow shadow-brand-accent/5 backdrop-blur-md">
            
            <div className="flex items-center gap-3.5 text-center sm:text-left flex-col sm:flex-row">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9.5px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5">
                  Tax Optimization Active
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-brand-text leading-tight tracking-tight">
                  Simulated Tax Reduction Detected
                </h3>
                <p className="text-xs text-brand-textMuted mt-0.5 leading-relaxed">
                  Your selected sales offset realized capital gains, lowering your overall tax liability.
                </p>
              </div>
            </div>

            {/* Savings Display block */}
            <div className="flex items-center gap-3 bg-slate-950/40 border border-brand-border/60 rounded-xl px-4 py-3 min-w-[200px] justify-center sm:justify-end">
              <div className="text-right">
                <span className="block text-[10px] font-bold text-brand-textMuted uppercase tracking-wider mb-0.5">
                  Estimated Savings
                </span>
                <CurrencyText 
                  value={savings} 
                  className="text-xl sm:text-2xl font-extrabold text-emerald-400 tracking-tight" 
                  decimals={2}
                />
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
