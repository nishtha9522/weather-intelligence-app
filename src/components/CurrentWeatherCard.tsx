import React from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  Sun,
  Gauge,
  Thermometer,
  CloudRain,
  Compass,
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types';
import { formatTemp, getWeatherConditionInfo } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcons';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const { location, current, daily } = weather;
  const condition = getWeatherConditionInfo(current.weatherCode, current.isDay);
  const todayForecast = daily[0];

  return (
    <div
      id="current-weather-hero"
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl transition-all duration-500 bg-gradient-to-br ${condition.gradient}`}
    >
      {/* Decorative ambient blurred circles */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Header: Location & Time */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-200 shrink-0 animate-bounce" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">
                {location.name}
              </h2>
              {location.country_code && (
                <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {location.country_code}
                </span>
              )}
            </div>
            <p className="text-sm text-white/80 font-medium mt-1 flex items-center gap-2">
              <span>{location.admin1 ? `${location.admin1}, ` : ''}{location.country}</span>
            </p>
          </div>

          {/* Condition Badge & Local Status */}
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-semibold text-white tracking-wide shadow-sm">
              {condition.label}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/20 text-[11px] font-medium text-white/90">
              {current.isDay ? 'Daytime' : 'Nighttime'}
            </span>
          </div>
        </div>

        {/* Main Temperature & Visual Icon Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Main Temperature */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="p-4 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner shrink-0">
              <WeatherIcon name={condition.iconName} className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>

            <div>
              <div className="flex items-start">
                <span id="current-temp-display" className="text-6xl sm:text-7xl font-extrabold tracking-tighter leading-none">
                  {formatTemp(current.temperature, unit, false)}
                </span>
                <span className="text-2xl sm:text-3xl font-light text-white/80 ml-1">
                  °{unit}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-white/90 font-medium flex items-center gap-3">
                <span>Feels like {formatTemp(current.feelsLike, unit)}</span>
                {todayForecast && (
                  <span className="text-xs text-white/70">
                    H: {formatTemp(todayForecast.maxTemp, unit)} / L: {formatTemp(todayForecast.minTemp, unit)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Condition Summary Paragraph */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-white/90 text-sm leading-relaxed">
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <span>Weather Summary</span>
            </p>
            <p className="text-xs sm:text-sm text-white/80">
              {condition.description}. Wind speeds around {Math.round(current.windSpeed)} km/h with humidity at {current.humidity}%.
            </p>
          </div>

        </div>

        {/* Bottom Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          {/* Wind Speed */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 text-white">
              <Wind className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">Wind</p>
              <p className="text-sm font-bold text-white">{Math.round(current.windSpeed)} km/h</p>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 text-white">
              <Droplets className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">Humidity</p>
              <p className="text-sm font-bold text-white">{current.humidity}%</p>
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 text-white">
              <Sun className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">UV Index</p>
              <p className="text-sm font-bold text-white">
                {current.uvIndex.toFixed(1)} <span className="text-[10px] font-normal text-white/80">({current.uvIndex > 5 ? 'High' : 'Moderate'})</span>
              </p>
            </div>
          </div>

          {/* Pressure */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 text-white">
              <Gauge className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <p className="text-[11px] text-white/70 font-medium uppercase tracking-wider">Pressure</p>
              <p className="text-sm font-bold text-white">{Math.round(current.pressure)} hPa</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
