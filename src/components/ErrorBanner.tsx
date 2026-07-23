import React from 'react';
import { AlertTriangle, RefreshCw, MapPin, Search } from 'lucide-react';
import { GeoLocationResult } from '../types';

interface ErrorBannerProps {
  errorMessage: string;
  onRetry?: () => void;
  onSelectPopularCity: (city: GeoLocationResult) => void;
  popularCities: GeoLocationResult[];
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  errorMessage,
  onRetry,
  onSelectPopularCity,
  popularCities,
}) => {
  return (
    <div
      id="error-banner"
      className="p-6 sm:p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-100 shadow-sm max-w-3xl mx-auto space-y-4"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5 flex-1">
          <h3 className="text-lg font-bold tracking-tight text-rose-950 dark:text-rose-100">
            {errorMessage.includes('not found') ? 'City Not Found' : 'Connection or Data Issue'}
          </h3>
          <p className="text-sm text-rose-700 dark:text-rose-200 leading-relaxed">
            {errorMessage}
          </p>
        </div>
      </div>

      {/* Suggested Actions & Popular City Links */}
      <div className="pt-3 border-t border-rose-200/80 dark:border-rose-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1">
            <Search className="w-3.5 h-3.5" /> Try popular cities:
          </span>
          {popularCities.slice(0, 4).map((city) => (
            <button
              key={city.name}
              type="button"
              id={`error-chip-${city.name.toLowerCase()}`}
              onClick={() => onSelectPopularCity(city)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-rose-900/40 border border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-800 text-xs font-medium transition-colors"
            >
              {city.name}
            </button>
          ))}
        </div>

        {onRetry && (
          <button
            type="button"
            id="error-retry-btn"
            onClick={onRetry}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Request
          </button>
        )}
      </div>
    </div>
  );
};
