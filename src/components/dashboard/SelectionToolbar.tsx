import React, { useMemo } from 'react';
import { useHarvestStore } from '../../store/useHarvestStore';
import { selectSelectedSummary } from '../../store/selectors';
import { CurrencyText } from '../ui/CurrencyText';
import { Flame, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const SelectionToolbar: React.FC = () => {
  const { resetSelections, executeHarvest, holdings, selections } = useHarvestStore();

  const summary = useMemo(() => {
    return selectSelectedSummary({ holdings, selections } as any);
  }, [holdings, selections]);

  const hasSelections = summary.count > 0;

  return (
    <AnimatePresence>
      {hasSelections && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl select-none"
        >
          {/* Glass floating panel */}
          <div className="bg-slate-900/90 border border-brand-accent/50 shadow-glow shadow-brand-accent/10 backdrop-blur-lg rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Meta details */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-center md:text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center border border-brand-accent/35 text-indigo-400">
                  <Flame className="w-4.5 h-4.5 animate-pulse" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-brand-textMuted uppercase tracking-wider leading-none mb-1">
                    Holdings Tagged
                  </span>
                  <span className="text-sm font-extrabold text-brand-text">
                    {summary.count} {summary.count === 1 ? 'Asset' : 'Assets'} Selected
                  </span>
                </div>
              </div>

              <div className="h-6 w-px bg-brand-border/60 hidden sm:block" />

              <div>
                <span className="block text-[10px] font-bold text-brand-textMuted uppercase tracking-wider leading-none mb-1">
                  Valuation To Harvest
                </span>
                <CurrencyText 
                  value={summary.totalMarketValue} 
                  className="text-sm sm:text-base font-extrabold text-slate-100" 
                />
              </div>

              <div className="h-6 w-px bg-brand-border/60 hidden sm:block" />

              <div>
                <span className="block text-[10px] font-bold text-brand-textMuted uppercase tracking-wider leading-none mb-1">
                  Net Loss Realized
                </span>
                {/* Sum up STCG and LTCG harvested gains (losses are negative, so sum can be negative) */}
                <CurrencyText 
                  value={summary.harvestedGainsSTCG + summary.harvestedGainsLTCG} 
                  colorCoded 
                  showSign
                  className="text-sm sm:text-base font-extrabold" 
                />
              </div>
            </div>

            {/* Actions CTA */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              <button
                onClick={() => resetSelections()}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-bold text-brand-textMuted hover:border-slate-700 hover:text-brand-text transition-colors w-1/2 md:w-auto"
              >
                <XCircle className="w-4 h-4" />
                <span>Clear All</span>
              </button>

              <button
                onClick={() => executeHarvest()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentLight text-xs font-extrabold text-white shadow-glow shadow-brand-accent/30 transition-all active:scale-[0.98] w-1/2 md:w-auto"
              >
                <span>Execute Harvest</span>
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
