import React, { useEffect, useMemo } from 'react';
import { AppShell } from './components/dashboard/AppShell';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { SavingsBanner } from './components/dashboard/SavingsBanner';
import { GainCard } from './components/dashboard/GainCard';
import { DeltaIndicator } from './components/dashboard/DeltaIndicator';
import { HoldingsTable } from './components/dashboard/HoldingsTable';
import { SelectionToolbar } from './components/dashboard/SelectionToolbar';
import { LoadingState } from './components/shared/LoadingState';
import { ErrorState } from './components/shared/ErrorState';
import { useHarvestStore } from './store/useHarvestStore';
import { calculateHarvestImpact } from './utils/calculations';

const App: React.FC = () => {
  const { 
    initializeDashboard, 
    loading, 
    error,
    preHarvestGains,
    holdings,
    selections
  } = useHarvestStore();

  const harvestResult = useMemo(() => {
    return calculateHarvestImpact(preHarvestGains, holdings, selections);
  }, [preHarvestGains, holdings, selections]);

  const selectedCount = useMemo(() => {
    return Object.values(selections).filter((s) => s.isSelected).length;
  }, [selections]);

  // Trigger data hydration from mock service on mount
  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  return (
    <AppShell>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => initializeDashboard(true)} />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Real-time Savings Banner */}
          <SavingsBanner savings={harvestResult.taxSavings} />

          {/* Page Heading and Sync Toggles */}
          <DashboardHeader />

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-start flex-1">
            {/* Left Column: Gains Comparison (xl:col-span-5) */}
            <div className="xl:col-span-5 flex flex-col xl:flex-col gap-6 w-full">
              
              <GainCard
                type="pre"
                title="Pre-Harvesting Gains"
                description="Your current capital gains baseline before harvesting losses."
                report={harvestResult.preHarvest}
                isActive={selectedCount > 0}
              />

              <DeltaIndicator difference={harvestResult.taxSavings} />

              <GainCard
                type="post"
                title="After-Harvesting Gains"
                description="Simulated capital gains after selling selected positions."
                report={harvestResult.postHarvest}
                isActive={selectedCount > 0}
              />

            </div>

            {/* Right Column: Holdings Table (xl:col-span-7) */}
            <div className="xl:col-span-7 w-full flex flex-col">
              <HoldingsTable />
            </div>
          </div>

          {/* Floating Actions Toolbar */}
          <SelectionToolbar />
        </div>
      )}
    </AppShell>
  );
};

export default App;
