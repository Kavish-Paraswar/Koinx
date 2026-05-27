import React from 'react';
import { clsx } from 'clsx';

interface CurrencyTextProps {
  value: number;
  className?: string;
  showSign?: boolean;
  colorCoded?: boolean;
  prefix?: string;
  decimals?: number;
}

export const CurrencyText: React.FC<CurrencyTextProps> = ({
  value,
  className = '',
  showSign = false,
  colorCoded = false,
  prefix = '₹',
  decimals = 2,
}) => {
  // Format the absolute number using English-Indian locale
  const formattedVal = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(value));

  const isPositive = value > 0;
  const isNegative = value < 0;

  // Determine sign character
  let sign = '';
  if (showSign) {
    if (isPositive) sign = '+';
    if (isNegative) sign = '-';
  } else if (isNegative) {
    sign = '-'; // always show minus sign for negative numbers
  }

  // Combine classes for dynamic colors
  const textClass = clsx(
    className,
    {
      'text-emerald-500 font-semibold': colorCoded && isPositive,
      'text-rose-500 font-semibold': colorCoded && isNegative,
      'text-slate-400': colorCoded && !isPositive && !isNegative,
    }
  );

  return (
    <span className={textClass}>
      {sign}
      {prefix}
      {formattedVal}
    </span>
  );
};
