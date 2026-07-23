import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { ForecastCards } from './components/ForecastCards';
import { PlanningRecommendations } from './components/PlanningRecommendations';
import { HourlyForecastView } from './components/HourlyForecastView';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { ErrorBanner } from './components/ErrorBanner';

import { GeoLocationResult, WeatherData, TemperatureUnit } from './types';
import { fetchWeatherData, reverseGeocodeLocation } from './utils/api';
import { generatePlanningTips } from './utils/weatherUtils';
import { Loader2, CloudSun, RefreshCw } from 'lucide-react';

const POPULAR_CITIES: GeoLocationResult[] = [
  {
    id: 1264527,
    name: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    country: 'India',
    country_code: 'IN',
    admin1: 'Tamil Nadu',
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
  },
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
  },
];

export default function App() {
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<GeoLocationResult>(POPULAR_CITIES[0]); // Chennai default
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync dark mode class on <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch Weather Data function
  const loadWeather = useCallback(async (location: GeoLocationResult, isRefresh = false) => {
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
      setError(`City not found. Please try another search.`);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(
        err.message ||
          'Unable to connect to weather service. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load or city change
  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // Handle City Select from SearchBar or Chips
  const handleSelectCity = (city: GeoLocationResult) => {
    setSelectedCity(city);
  };

  // Handle Geolocation Button ("Use My Location")
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocodeLocation(latitude, longitude);
          setSelectedCity(loc);
        } catch {
          setSelectedCity({
            id: Math.round(latitude * 1000 + longitude),
            name: 'Your Location',
            latitude,
            longitude,
            country: '',
          });
        }
      },
      (geoErr) => {
        console.warn('Geolocation error:', geoErr);
        setIsLoading(false);
        setError('Location permission was denied or unavailable. Please search for your city name.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Derive Planning Tips
  const planningTips = useMemo(() => {
    if (!weatherData) return [];
    return generatePlanningTips(weatherData.current, weatherData.daily);
  }, [weatherData]);

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Navigation Bar */}
      <Navbar
        unit={unit}
        onToggleUnit={setUnit}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onRefresh={() => loadWeather(selectedCity, true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Search Bar Section */}
        <SearchBar
          onSelectCity={handleSelectCity}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLoading={isLoading && !weatherData}
          popularCities={POPULAR_CITIES}
        />

        {/* Error Alert Display */}
        {error && (
          <ErrorBanner
            errorMessage={error}
            onRetry={() => loadWeather(selectedCity)}
            onSelectPopularCity={handleSelectCity}
            popularCities={POPULAR_CITIES}
          />
        )}

        {/* Loading Skeleton / Spinner State */}
        {isLoading && !weatherData && (
          <div
            id="initial-loading-state"
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="p-4 rounded-3xl bg-sky-100 dark:bg-sky-950/80 text-sky-500 animate-pulse">
              <CloudSun className="w-12 h-12" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                Fetching weather intelligence...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Connecting to Open-Meteo Geocoding & Forecast APIs
              </p>
            </div>
            <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
          </div>
        )}

        {/* Main Weather Content View */}
        {weatherData && (
          <div id="weather-content-layout" className="space-y-8">
            
            {/* 1. Hero Current Weather Card */}
            <CurrentWeatherCard weather={weatherData} unit={unit} />

            {/* 2. Planning Recommendations Section */}
            <PlanningRecommendations tips={planningTips} />

            {/* 3. 7-Day Forecast Cards */}
            <ForecastCards daily={weatherData.daily} unit={unit} />

            {/* 4. 24-Hour Hourly Outlook */}
            <HourlyForecastView hourly={weatherData.hourly} unit={unit} />

            {/* 5. Detailed Environmental Metrics Grid */}
            <WeatherMetricsGrid weather={weatherData} unit={unit} />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 mt-12 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-medium">
            Weather Intelligence Web Application — Powered by Open-Meteo APIs
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Real-time weather metrics, 7-day forecasts, and contextual activity planning tips.
          </p>
        </div>
      </footer>
    </div>
  );
}
