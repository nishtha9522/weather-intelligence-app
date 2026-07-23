import React from 'react';
import {
  Sun,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Eye,
  Compass,
  Gauge,
  Activity,
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types';

interface WeatherMetricsGridProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ weather }) => {
  const { current, daily } = weather;
  const todayForecast = daily[0];

  // Wind direction compass calculation
  const getWindCardinal = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const windCardinal = getWindCardinal(current.windDirection);

  // UV category level
  const getUVCategory = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'text-emerald-500', bg: 'bg-emerald-500' };
    if (uv <= 5) return { text: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-500' };
    if (uv <= 7) return { text: 'High', color: 'text-orange-500', bg: 'bg-orange-500' };
    if (uv <= 10) return { text: 'Very High', color: 'text-red-500', bg: 'bg-red-500' };
    return { text: 'Extreme', color: 'text-purple-500', bg: 'bg-purple-500' };
  };

  const uvMeta = getUVCategory(current.uvIndex);

  return (
    <section id="weather-metrics-section" className="space-y-4">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Detailed Environmental Metrics
        </h3>
      </div>

      {/* Grid of 4 Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: UV Index & Sun Safety */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" />
              UV Index
            </span>
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${uvMeta.color} bg-slate-100 dark:bg-slate-700`}>
              {uvMeta.text}
            </span>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {current.uvIndex.toFixed(1)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Max today: {todayForecast ? todayForecast.uvIndexMax.toFixed(1) : current.uvIndex.toFixed(1)}
            </p>
          </div>

          {/* Progress scale */}
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full ${uvMeta.bg}`}
              style={{ width: `${Math.min(100, (current.uvIndex / 11) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Wind Speed & Bearing Compass */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-500" />
              Wind Status
            </span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              {windCardinal} ({current.windDirection}°)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {Math.round(current.windSpeed)}{' '}
                <span className="text-sm font-normal text-slate-500">km/h</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Max gust: {todayForecast ? Math.round(todayForecast.windSpeedMax) : Math.round(current.windSpeed)} km/h
              </p>
            </div>

            {/* Rotating compass needle */}
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
              <Compass
                className="w-6 h-6 text-sky-500 transition-transform duration-700"
                style={{ transform: `rotate(${current.windDirection}deg)` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Humidity & Dew Point Level */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-500" />
              Humidity Level
            </span>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              {current.humidity > 70 ? 'Humid' : current.humidity < 30 ? 'Dry' : 'Comfortable'}
            </span>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {current.humidity}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Precipitation: {current.precipitation} mm
            </p>
          </div>

          {/* Humidity bar */}
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${current.humidity}%` }}
            />
          </div>
        </div>

        {/* Card 4: Sunrise & Sunset Timeline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sunrise className="w-4 h-4 text-amber-500" />
              Sun Timeline
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Daily Arc
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 text-xs font-bold mb-1">
                <Sunrise className="w-3.5 h-3.5" /> Sunrise
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {todayForecast ? todayForecast.sunrise : '--:--'}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50">
              <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-1">
                <Sunset className="w-3.5 h-3.5" /> Sunset
              </div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {todayForecast ? todayForecast.sunset : '--:--'}
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
