import React from 'react';
import { Earthquake } from '../types';

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  loading?: boolean;
}

export const EarthquakeList: React.FC<EarthquakeListProps> = ({ earthquakes, loading }) => {
  const getMagnitudeColor = (mag: number) => {
    if (mag >= 6) return 'bg-red-600 text-white shadow-red-500/50';
    if (mag >= 4.5) return 'bg-orange-500 text-white shadow-orange-500/50';
    if (mag >= 3) return 'bg-yellow-500 text-black shadow-yellow-500/50';
    return 'bg-emerald-500 text-black shadow-emerald-500/50';
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-lg bg-slate-700/50 flex-shrink-0" />
            <div className="flex-grow space-y-2">
              <div className="h-5 bg-slate-700/50 rounded w-3/4" />
              <div className="h-4 bg-slate-700/50 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (earthquakes.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-800 border-dashed">
        <p className="text-slate-400 font-medium">No recent earthquakes detected in the Bangladesh region (USGS).</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {earthquakes.map((eq) => (
        <div 
          key={eq.id} 
          className="group relative bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-500 transition-all hover:bg-slate-750 hover:shadow-xl hover:shadow-black/20 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className={`
            ${getMagnitudeColor(eq.magnitude)}
            w-16 h-16 rounded-lg flex flex-col items-center justify-center shadow-lg flex-shrink-0 transition-transform group-hover:scale-105
          `}>
            <span className="text-2xl font-black leading-none tracking-tighter">{eq.magnitude.toFixed(1)}</span>
            <span className="text-[10px] uppercase font-bold opacity-90 mt-1">Mag</span>
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                {eq.location}
              </h3>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="text-sm text-blue-200/80 font-medium">{eq.time}, {eq.date}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400 font-medium font-mono mt-1">
              <div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                {eq.depth}
              </div>
              {eq.lat && eq.lon && (
                <div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded">
                   <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   {eq.lat.toFixed(2)}, {eq.lon.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          <div className="absolute right-4 top-4 md:static">
            <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-slate-900/80 text-blue-400 border border-blue-900/30">
               Official Data
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};