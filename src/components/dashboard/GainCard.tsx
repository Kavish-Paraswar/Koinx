import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { GainSection } from './GainSection';
import { CurrencyText } from '../ui/CurrencyText';
import { Badge } from '../ui/Badge';
import { Scale, Milestone } from 'lucide-react';

interface GainCardProps {
  title: string;
  description: string;
  report: {
    stcg: { profits: number; losses: number; net: number };
    ltcg: { profits: number; losses: number; net: number };
    realised: number;
  };
  type: 'pre' | 'post';
  isActive?: boolean;
}

export const GainCard: React.FC<GainCardProps> = ({
  title,
  description,
  report,
  type,
  isActive = false,
}) => {
  const isPre = type === 'pre';
  const realisedGainsVal = report.realised;
  const isNetLoss = realisedGainsVal < 0;

  return (
    <Card 
      variant={isActive ? 'glow' : 'glass'}
      className={`flex-1 transition-all duration-300 ${
        isActive 
          ? 'border-brand-accent/40 shadow-glow shadow-brand-accent/10' 
          : 'hover:border-slate-800'
      }`}
    >
      <CardHeader className={isPre ? 'bg-slate-900/10' : 'bg-brand-accent/5'}>
        <div className="flex items-center gap-2">
          {isPre ? (
            <Scale className="w-5 h-5 text-indigo-400" />
          ) : (
            <Milestone className="w-5 h-5 text-brand-accent" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-brand-text leading-tight tracking-tight">
              {title}
            </span>
            <span className="text-[10.5px] text-brand-textMuted font-medium">
              {description}
            </span>
          </div>
        </div>
        <Badge variant={isPre ? 'secondary' : 'primary'}>
          {isPre ? 'Current State' : 'Simulated'}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Short Term Section */}
        <GainSection 
          label="Short-Term Capital Gains (STCG)" 
          profits={report.stcg.profits} 
          losses={report.stcg.losses} 
          net={report.stcg.net} 
        />

        {/* Long Term Section */}
        <GainSection 
          label="Long-Term Capital Gains (LTCG)" 
          profits={report.ltcg.profits} 
          losses={report.ltcg.losses} 
          net={report.ltcg.net} 
        />
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-slate-950/20 border-t border-brand-border/40 py-3.5">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">
            Realised Capital Gains
          </span>
          <span className="text-[10.5px] text-brand-textMuted font-semibold">
            Formula: Net STCG + Net LTCG
          </span>
        </div>
        <div className="text-right">
          <CurrencyText 
            value={realisedGainsVal} 
            colorCoded 
            showSign={realisedGainsVal !== 0} 
            className="text-lg sm:text-xl font-bold tracking-tight" 
          />
          {isNetLoss && (
            <span className="block text-[9.5px] font-bold text-rose-400/90 uppercase tracking-wider leading-none mt-0.5">
              Available to offset
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
