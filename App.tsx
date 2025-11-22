import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchEarthquakeData } from './services/earthquakeService';
import { Earthquake, AppState } from './types';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { EarthquakeList } from './components/EarthquakeList';
import { MagnitudeChart } from './components/MagnitudeChart';
import { QuakeMap } from './components/QuakeMap';

const REFRESH_INTERVAL_MS = 60000; // 60 seconds

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    loading: true,
    error: null,
    data: [],
    lastUpdated: null,
    sources: []
  });

  const isFetching = useRef(false);

  const loadData = useCallback(async (forceRefresh = false) => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    
    // Optimistic loading state: only show full spinner if no data exists
    if (state.data.length === 0) {
        setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const { data, sources } = await fetchEarthquakeData(forceRefresh);
      
      // Sort by timestamp descending (Newest first)
      const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);

      setState({
        loading: false,
        error: null,
        data: sortedData,
        lastUpdated: new Date(),
        sources
      });
    } catch (err) {
      console.error(err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Unable to reach USGS service. Showing last known info.",
      }));
    } finally {
      isFetching.current = false;
    }
  }, [state.data.length]);

  useEffect(() => {
    // Initial load
    loadData(false);

    // Auto refresh
    const intervalId = setInterval(() => {
      loadData(true);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [loadData]);

  // Derived statistics
  const totalQuakes = state.data.length;
  const maxMag = state.data.length > 0 ? Math.max(...state.data.map(d => d.magnitude)) : 0;
  const recentQuakeLocation = state.data.length > 0 ? state.data[0].location : 'N/A';

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1120]">
      <Header 
        lastUpdated={state.lastUpdated} 
        loading={state.loading && state.data.length === 0} 
        onRefresh={() => loadData(true)}
      />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8">
        {state.error && state.data.length === 0 && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 shadow-lg shadow-red-900/10">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{state.error}</span>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Events (Last 365 Days)" 
            value={state.loading && state.data.length === 0 ? '-' : totalQuakes} 
            subValue="Bangladesh & Border Regions"
          />
          <StatCard 
            label="Max Magnitude" 
            value={state.loading && state.data.length === 0 ? '-' : maxMag.toFixed(1)} 
            subValue={state.loading && state.data.length === 0 ? '...' : (maxMag > 5 ? "High Intensity" : "Low-Med Intensity")}
            type={maxMag > 5 ? 'danger' : maxMag > 4 ? 'warning' : 'neutral'}
          />
          <StatCard 
            label="Latest Activity" 
            value={state.loading && state.data.length === 0 ? '...' : (state.data.length > 0 ? state.data[0].magnitude.toFixed(1) : '-')} 
            subValue={recentQuakeLocation}
          />
        </div>

        {/* Map Section - Full Width */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Seismic Map
            </h2>
          </div>
          <QuakeMap data={state.data} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Live Feed (USGS)
              </h2>
              {!state.loading && (
                 <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded border border-slate-700">
                   Auto-refresh: 60s
                 </span>
              )}
            </div>
            <EarthquakeList earthquakes={state.data} loading={state.loading && state.data.length === 0} />
          </div>

          {/* Right Column: Chart & Sources */}
          <div className="space-y-8">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Magnitude Trend
              </h3>
              {state.loading && state.data.length === 0 ? (
                 <div className="h-[300px] w-full flex items-center justify-center">
                   <div className="text-slate-600 text-sm animate-pulse">Loading chart data...</div>
                 </div>
              ) : (
                 <MagnitudeChart data={state.data} />
              )}
            </div>

            {state.sources.length > 0 && (
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Official Source
                </h3>
                <ul className="space-y-3">
                  {state.sources.map((source, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm group">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-blue-300 hover:underline break-all leading-relaxed transition-colors"
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-8 mt-8 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-slate-500 text-sm">
             Real-time data provided directly by the USGS Earthquake Hazards Program.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;