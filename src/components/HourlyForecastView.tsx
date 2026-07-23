import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../types';
import { formatTemp, getWeatherConditionInfo } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcons';

interface HourlyForecastViewProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

export const HourlyForecastView: React.FC<HourlyForecastViewProps> = ({ hourly, unit }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <section id="hourly-forecast-section" className="space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            24-Hour Hourly Outlook
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Scroll horizontally →
        </span>
      </div>

      {/* Horizontal Scroll Pill Cards */}
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm">
        <div
          id="hourly-scroll-container"
          className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
        >
          {hourly.map((item, idx) => {
            const condition = getWeatherConditionInfo(item.weatherCode, true);
            const isNow = idx === 0;

            return (
              <div
                key={`${item.time}-${idx}`}
                id={`hourly-pill-${idx}`}
                className={`flex flex-col items-center justify-between min-w-[85px] p-3 rounded-2xl border transition-all duration-200 shrink-0 ${
                  isNow
                    ? 'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/20'
                    : 'bg-slate-50 dark:bg-slate-700/40 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-500'
                }`}
              >
                {/* Time Label */}
                <span className={`text-xs font-bold ${isNow ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                  {item.formattedTime}
                </span>

                {/* Weather Icon */}
                <div className="my-2.5">
                  <WeatherIcon name={condition.iconName} className="w-7 h-7" />
                </div>

                {/* Temperature */}
                <span className={`text-sm font-extrabold ${isNow ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {formatTemp(item.temperature, unit)}
                </span>

                {/* Rain probability */}
                {item.precipProb > 0 ? (
                  <span
                    className={`mt-1.5 flex items-center gap-0.5 text-[10px] font-bold ${
                      isNow ? 'text-sky-100' : 'text-sky-600 dark:text-sky-400'
                    }`}
                  >
                    <Droplets className="w-2.5 h-2.5" />
                    {item.precipProb}%
                  </span>
                ) : (
                  <span className="h-4 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
