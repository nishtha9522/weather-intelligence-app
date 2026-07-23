import React from 'react';
import { Calendar, Umbrella, Droplets, Sun, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '../types';
import { formatTemp, getWeatherConditionInfo } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcons';

interface ForecastCardsProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
}

export const ForecastCards: React.FC<ForecastCardsProps> = ({ daily, unit }) => {
  if (!daily || daily.length === 0) return null;

  // Calculate global min and max temperatures across the 7 days for the visual bar calculation
  const globalMin = Math.min(...daily.map((d) => d.minTemp));
  const globalMax = Math.max(...daily.map((d) => d.maxTemp));
  const tempRange = Math.max(1, globalMax - globalMin);

  return (
    <section id="forecast-section" className="space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            7-Day Weather Forecast
          </h3>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          7 Days Outlook
        </span>
      </div>

      {/* Grid Layout of 7 Forecast Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {daily.map((item, idx) => {
          const condition = getWeatherConditionInfo(item.weatherCode, true);

          // Calculate percentage for temperature scale bar
          const leftPct = Math.round(((item.minTemp - globalMin) / tempRange) * 100);
          const widthPct = Math.max(12, Math.round(((item.maxTemp - item.minTemp) / tempRange) * 100));

          return (
            <div
              key={item.date}
              id={`forecast-card-${idx}`}
              className={`relative group p-4 rounded-2xl transition-all duration-300 border flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 ${
                idx === 0
                  ? 'bg-gradient-to-b from-sky-500/10 via-white to-sky-50/50 dark:from-sky-950/40 dark:via-slate-800 dark:to-slate-800/90 border-sky-300/80 dark:border-sky-500/40 shadow-sky-500/5'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 hover:border-sky-300 dark:hover:border-sky-600'
              }`}
            >
              {/* Card Header: Day Name & Date */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${idx === 0 ? 'text-sky-600 dark:text-sky-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {item.dayName}
                  </span>
                  {idx === 0 && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-sky-500 text-white">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                  {item.date.split('-').slice(1).join('/')}
                </p>
              </div>

              {/* Weather Icon & Label */}
              <div className="my-3 flex flex-col items-center text-center">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 group-hover:scale-110 transition-transform my-1">
                  <WeatherIcon name={condition.iconName} className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 truncate w-full">
                  {condition.label}
                </span>

                {/* Rain probability badge if applicable */}
                {item.precipProbMax > 0 && (
                  <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400">
                    <Droplets className="w-3 h-3" />
                    {item.precipProbMax}%
                  </span>
                )}
              </div>

              {/* Temperature Min / Max */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    {formatTemp(item.minTemp, unit)}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    {formatTemp(item.maxTemp, unit)}
                  </span>
                </div>

                {/* Relative Bar visual */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-sky-400 to-amber-400"
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                    }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
