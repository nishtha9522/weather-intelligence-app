export type TemperatureUnit = 'C' | 'F';

export interface GeoLocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string; // State / Region
  timezone?: string;
  population?: number;
}

export interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
  humidity: number;
  uvIndex: number;
  pressure: number;
  precipitation: number;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  dayName: string; // 'Today', 'Mon', 'Tue', etc.
  weatherCode: number;
  maxTemp: number;
  minTemp: number;
  precipitationSum: number;
  precipProbMax: number;
  uvIndexMax: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecastItem {
  time: string;
  formattedTime: string; // '12 PM', '1 PM'
  temperature: number;
  weatherCode: number;
  precipProb: number;
}

export interface WeatherData {
  location: GeoLocationResult;
  current: CurrentWeatherData;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
}

export interface PlanningTip {
  id: string;
  category: 'outdoor' | 'clothing' | 'travel' | 'health';
  title: string;
  description: string;
  iconName: string;
  type: 'positive' | 'warning' | 'info' | 'neutral';
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string;
  gradient: string;
  bgOverlay: string;
  accentColor: string;
  cardBg: string;
}
