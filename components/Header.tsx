import React from 'react';

interface HeaderProps {
  lastUpdated: Date | null;
  loading: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdated, loading, onRefresh }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 pb-4 pt-6 px-4 md:px-8 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="bg-red-600 w-3 h-3 rounded-full animate-pulse"></span>
            Bangladesh QuakeMonitor
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time seismic activity (Powered by USGS)
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs text-slate-500 uppercase font-semibold">Last Updated</p>
            <p className="text-sm text-slate-300 font-mono">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
            </p>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`
              flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-sm transition-all
              ${loading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/20 shadow-lg'}
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Refresh Data'
            )}
          </button>
        </div>
      </div>
    </header>
  );
};