import {
  GeoLocationResult,
  WeatherData,
  CurrentWeatherData,
  DailyForecastItem,
  HourlyForecastItem,
} from '../types';
import { formatDayLabel } from './weatherUtils';

/**
 * Searches city using Open-Meteo Geocoding API
 */
export async function searchCities(cityName: string): Promise<GeoLocationResult[]> {
  const trimmed = cityName.trim();
  if (!trimmed) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=8&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to connect to location search service. Please check your network.');
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    return [];
  }

  return data.results.map((item: any) => ({
    id: item.id,
    name: item.name,
    latitude: item.latitude,
    longitude: item.longitude,
    country: item.country || '',
    country_code: item.country_code || '',
    admin1: item.admin1 || '',
    timezone: item.timezone || 'auto',
    population: item.population || 0,
  }));
}

/**
 * Fetches current and 7-day weather forecast from Open-Meteo Forecast API
 */
export async function fetchWeatherData(location: GeoLocationResult): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&hourly=temperature_2m,weather_code,precipitation_probability&timezone=auto&current_weather=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to retrieve weather forecast data. Please try again.');
  }

  const raw = await response.json();

  // Extract current weather
  const cur = raw.current || {};
  const curWeatherObj = raw.current_weather || {};

  const current: CurrentWeatherData = {
    temperature: cur.temperature_2m ?? curWeatherObj.temperature ?? 0,
    feelsLike: cur.apparent_temperature ?? cur.temperature_2m ?? curWeatherObj.temperature ?? 0,
    windSpeed: cur.wind_speed_10m ?? curWeatherObj.windspeed ?? 0,
    windDirection: cur.wind_direction_10m ?? curWeatherObj.winddirection ?? 0,
    weatherCode: cur.weather_code ?? curWeatherObj.weathercode ?? 0,
    isDay: cur.is_day !== undefined ? cur.is_day === 1 : true,
    time: cur.time || new Date().toISOString(),
    humidity: cur.relative_humidity_2m ?? 50,
    uvIndex: cur.uv_index ?? 0,
    pressure: cur.surface_pressure ?? 1013,
    precipitation: cur.precipitation ?? 0,
  };

  // Extract 7-day forecast
  const dailyRaw = raw.daily || {};
  const dates: string[] = dailyRaw.time || [];

  const daily: DailyForecastItem[] = dates.map((dateStr, idx) => {
    const dayMeta = formatDayLabel(dateStr, idx);
    const sunriseIso = dailyRaw.sunrise ? dailyRaw.sunrise[idx] : '';
    const sunsetIso = dailyRaw.sunset ? dailyRaw.sunset[idx] : '';

    const formatTimeOnly = (iso: string) => {
      if (!iso) return '--:--';
      try {
        const parts = iso.split('T');
        return parts[1] || iso;
      } catch {
        return iso;
      }
    };

    return {
      date: dateStr,
      dayName: dayMeta.shortDay,
      weatherCode: dailyRaw.weather_code ? dailyRaw.weather_code[idx] : 0,
      maxTemp: dailyRaw.temperature_2m_max ? dailyRaw.temperature_2m_max[idx] : 0,
      minTemp: dailyRaw.temperature_2m_min ? dailyRaw.temperature_2m_min[idx] : 0,
      precipitationSum: dailyRaw.precipitation_sum ? dailyRaw.precipitation_sum[idx] : 0,
      precipProbMax: dailyRaw.precipitation_probability_max ? dailyRaw.precipitation_probability_max[idx] : 0,
      uvIndexMax: dailyRaw.uv_index_max ? dailyRaw.uv_index_max[idx] : 0,
      windSpeedMax: dailyRaw.wind_speed_10m_max ? dailyRaw.wind_speed_10m_max[idx] : 0,
      sunrise: formatTimeOnly(sunriseIso),
      sunset: formatTimeOnly(sunsetIso),
    };
  });

  // Extract next 24-hour hourly items
  const hourlyRaw = raw.hourly || {};
  const hourlyTimes: string[] = hourlyRaw.time || [];
  const nowHourIndex = Math.max(
    0,
    hourlyTimes.findIndex((t) => new Date(t) >= new Date())
  );

  const next24 = hourlyTimes.slice(nowHourIndex, nowHourIndex + 24);

  const hourly: HourlyForecastItem[] = next24.map((tStr, offset) => {
    const idx = nowHourIndex + offset;
    const d = new Date(tStr);
    const hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = (hours % 12 || 12) + ' ' + ampm;

    return {
      time: tStr,
      formattedTime: offset === 0 ? 'Now' : formattedHour,
      temperature: hourlyRaw.temperature_2m ? hourlyRaw.temperature_2m[idx] : 0,
      weatherCode: hourlyRaw.weather_code ? hourlyRaw.weather_code[idx] : 0,
      precipProb: hourlyRaw.precipitation_probability ? hourlyRaw.precipitation_probability[idx] : 0,
    };
  });

  return {
    location,
    current,
    daily,
    hourly,
  };
}

/**
 * Reverse geocodes latitude and longitude to a city name
 */
export async function reverseGeocodeLocation(lat: number, lon: number): Promise<GeoLocationResult> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        id: Math.round(lat * 1000 + lon),
        name: city,
        latitude: lat,
        longitude: lon,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding failed, using coordinate fallback', err);
  }

  return {
    id: Math.round(lat * 1000 + lon),
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
    country: '',
    admin1: '',
  };
}
