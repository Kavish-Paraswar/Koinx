import React from 'react';
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useHarvestStore } from '../../store/useHarvestStore';

export const DashboardHeader: React.FC = () => {
  const { initializeDashboard, resetSelections, loading } = useHarvestStore();

  const handleToggleErrorSimulation = async () => {
    const active = localStorage.getItem('simulate_api_error') === 'true';
    if (active) {
      localStorage.setItem('simulate_api_error', 'false');
    } else {
      localStorage.setItem('simulate_api_error', 'true');
    }
    // Re-initialize to trigger the state change
    await initializeDashboard();
  };

  const isSimulatedErrorActive = localStorage.getItem('simulate_api_error') === 'true';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 select-none">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
            Tax Loss Harvesting
          </h1>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-brand-textMuted font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Mock Sync</span>
          </div>
        </div>
        <p className="text-sm text-brand-textMuted max-w-2xl leading-relaxed">
          Harvest capital losses dynamically by selling depreciating crypto assets to offset capital gain taxes. Rebalance positions instantly.
        </p>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        {/* Toggle Error Simulation Trigger */}
        <button
          onClick={handleToggleErrorSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isSimulatedErrorActive
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20'
              : 'bg-slate-900 border-slate-800 text-brand-textMuted hover:border-slate-700 hover:text-brand-text'
          }`}
          title="Simulate network failure to test ErrorState fallback boundary"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isSimulatedErrorActive ? 'Sim Error: ON' : 'Sim Error'}</span>
        </button>

        {/* Reset Positions */}
        <button
          onClick={() => resetSelections()}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-brand-textMuted hover:border-slate-700 hover:text-brand-text transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Selections</span>
        </button>

        {/* Refresh feed */}
        <button
          onClick={() => initializeDashboard(true)}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-accent hover:bg-brand-accentLight disabled:opacity-50 text-xs font-bold text-white shadow-glow transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Refresh Feed</span>
        </button>
      </div>
    </div>
  );
};
