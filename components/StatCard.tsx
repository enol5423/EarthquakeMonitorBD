import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  type?: 'danger' | 'warning' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, type = 'neutral' }) => {
  const getColors = () => {
    switch (type) {
      case 'danger': 
        return {
          border: 'border-red-500/50',
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          label: 'text-red-200'
        };
      case 'warning': 
        return {
          border: 'border-orange-500/50',
          bg: 'bg-orange-500/10',
          text: 'text-orange-400',
          label: 'text-orange-200'
        };
      default: 
        return {
          border: 'border-slate-700',
          bg: 'bg-slate-800',
          text: 'text-white',
          label: 'text-slate-400'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`${colors.bg} rounded-xl p-6 border ${colors.border} backdrop-blur-sm shadow-lg transition-all hover:translate-y-[-2px]`}>
      <p className={`${colors.label} text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2`}>
        {label}
      </p>
      <div className={`text-4xl font-black ${colors.text} tracking-tight`}>
        {value}
      </div>
      {subValue && (
        <p className="text-slate-400 text-sm mt-2 font-medium border-t border-slate-700/50 pt-2 inline-block w-full">
          {subValue}
        </p>
      )}
    </div>
  );
};