import React from 'react';
import { CloudSun, RefreshCw, Sun, Moon, Compass } from 'lucide-react';
import { TemperatureUnit } from '../types';

interface NavbarProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  isDarkMode,
  onToggleDarkMode,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 backdrop-blur-md bg-white/75 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div id="brand-logo" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/20 text-white">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Weather Intel
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
              Precision forecasts & activity intelligence
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div id="header-actions" className="flex items-center gap-2 sm:gap-3">
          
          {/* Refresh Button */}
          <button
            id="refresh-btn"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh current weather data"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-500' : ''}`} />
          </button>

          {/* Unit Toggle (°C / °F) */}
          <div
            id="unit-toggle-container"
            className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <button
              id="unit-c-btn"
              onClick={() => onToggleUnit('C')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === 'C'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              id="unit-f-btn"
              onClick={() => onToggleUnit('F')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === 'F'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Dark / Light Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

        </div>

      </div>
    </header>
  );
};
