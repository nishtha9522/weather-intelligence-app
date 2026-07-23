import {
  WeatherConditionInfo,
  CurrentWeatherData,
  DailyForecastItem,
  PlanningTip,
  TemperatureUnit,
} from '../types';

/**
 * Convert Celsius temperature to Fahrenheit if needed
 */
export function formatTemp(tempC: number, unit: TemperatureUnit, showDegree: boolean = true): string {
  if (tempC === undefined || tempC === null || isNaN(tempC)) return '--';
  const val = unit === 'F' ? Math.round((tempC * 9) / 5 + 32) : Math.round(tempC);
  return showDegree ? `${val}°${unit}` : `${val}°`;
}

export function convertValue(tempC: number, unit: TemperatureUnit): number {
  if (tempC === undefined || tempC === null || isNaN(tempC)) return 0;
  return unit === 'F' ? Math.round((tempC * 9) / 5 + 32) : Math.round(tempC);
}

/**
 * Maps WMO Weather Interpretation Codes (0-99) to labels, icons, and theme gradients
 */
export function getWeatherConditionInfo(code: number, isDay: boolean = true): WeatherConditionInfo {
  // Clear Sky
  if (code === 0) {
    return isDay
      ? {
          label: 'Clear Sky',
          description: 'Bright and clear sunny skies',
          iconName: 'Sun',
          gradient: 'from-amber-400 via-sky-400 to-blue-600',
          bgOverlay: 'bg-gradient-to-br from-amber-500/10 via-sky-500/10 to-blue-500/10',
          accentColor: 'text-amber-500',
          cardBg: 'bg-amber-500/10 dark:bg-amber-950/30 border-amber-500/20',
        }
      : {
          label: 'Clear Night',
          description: 'Clear, starry night sky',
          iconName: 'Moon',
          gradient: 'from-slate-900 via-indigo-950 to-blue-950',
          bgOverlay: 'bg-gradient-to-br from-indigo-900/20 via-slate-900/20 to-blue-900/20',
          accentColor: 'text-indigo-400',
          cardBg: 'bg-indigo-950/40 dark:bg-indigo-950/40 border-indigo-500/20',
        };
  }

  // Mainly clear, partly cloudy, overcast (1, 2, 3)
  if (code === 1 || code === 2) {
    return {
      label: 'Partly Cloudy',
      description: 'Sun with scattered floating clouds',
      iconName: isDay ? 'SunCloud' : 'MoonCloud',
      gradient: 'from-sky-400 via-blue-500 to-indigo-600',
      bgOverlay: 'bg-gradient-to-br from-sky-400/10 via-blue-500/10 to-indigo-500/10',
      accentColor: 'text-sky-400',
      cardBg: 'bg-sky-500/10 dark:bg-sky-950/30 border-sky-500/20',
    };
  }
  if (code === 3) {
    return {
      label: 'Overcast',
      description: 'Thick gray cloud coverage',
      iconName: 'Cloud',
      gradient: 'from-slate-500 via-slate-600 to-zinc-700',
      bgOverlay: 'bg-gradient-to-br from-slate-500/10 via-slate-600/10 to-zinc-600/10',
      accentColor: 'text-slate-400',
      cardBg: 'bg-slate-500/10 dark:bg-slate-900/40 border-slate-500/20',
    };
  }

  // Fog (45, 48)
  if (code === 45 || code === 48) {
    return {
      label: 'Foggy',
      description: 'Reduced visibility due to fog',
      iconName: 'CloudFog',
      gradient: 'from-slate-400 via-teal-600 to-slate-700',
      bgOverlay: 'bg-gradient-to-br from-teal-500/10 via-slate-600/10 to-slate-700/10',
      accentColor: 'text-teal-400',
      cardBg: 'bg-teal-500/10 dark:bg-teal-950/30 border-teal-500/20',
    };
  }

  // Drizzle (51, 53, 55, 56, 57)
  if (code >= 51 && code <= 57) {
    return {
      label: 'Drizzle',
      description: 'Light misty rainfall drops',
      iconName: 'CloudDrizzle',
      gradient: 'from-blue-400 via-cyan-600 to-slate-700',
      bgOverlay: 'bg-gradient-to-br from-blue-400/10 via-cyan-600/10 to-slate-700/10',
      accentColor: 'text-cyan-400',
      cardBg: 'bg-cyan-500/10 dark:bg-cyan-950/30 border-cyan-500/20',
    };
  }

  // Rain (61, 63, 65, 66, 67, 80, 81, 82)
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      label: code >= 65 || code === 82 ? 'Heavy Rain' : 'Rainy',
      description: 'Continuous rainfall and wet roads',
      iconName: 'CloudRain',
      gradient: 'from-blue-600 via-indigo-700 to-slate-900',
      bgOverlay: 'bg-gradient-to-br from-blue-600/15 via-indigo-700/15 to-slate-900/15',
      accentColor: 'text-blue-400',
      cardBg: 'bg-blue-500/10 dark:bg-blue-950/40 border-blue-500/20',
    };
  }

  // Snow (71, 73, 75, 77, 85, 86)
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return {
      label: 'Snowy',
      description: 'Snowfall and chilly conditions',
      iconName: 'Snowflake',
      gradient: 'from-sky-300 via-blue-400 to-slate-600',
      bgOverlay: 'bg-gradient-to-br from-sky-200/15 via-blue-300/15 to-slate-500/15',
      accentColor: 'text-sky-300',
      cardBg: 'bg-sky-400/10 dark:bg-sky-950/30 border-sky-400/20',
    };
  }

  // Thunderstorm (95, 96, 99)
  if (code >= 95) {
    return {
      label: 'Thunderstorm',
      description: 'Lightning, thunder, and heavy downpours',
      iconName: 'CloudLightning',
      gradient: 'from-purple-900 via-indigo-900 to-slate-950',
      bgOverlay: 'bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-slate-950/20',
      accentColor: 'text-amber-400',
      cardBg: 'bg-purple-950/40 dark:bg-purple-950/40 border-purple-500/20',
    };
  }

  // Default fallback
  return {
    label: 'Mild Weather',
    description: 'Variable weather conditions',
    iconName: 'SunCloud',
    gradient: 'from-sky-500 via-blue-600 to-slate-800',
    bgOverlay: 'bg-gradient-to-br from-sky-500/10 via-blue-600/10 to-slate-800/10',
    accentColor: 'text-sky-400',
    cardBg: 'bg-sky-500/10 dark:bg-sky-950/30 border-sky-500/20',
  };
}

/**
 * Generates dynamic, contextual activity recommendations based on current weather and forecast metrics
 */
export function generatePlanningTips(
  current: CurrentWeatherData,
  daily: DailyForecastItem[]
): PlanningTip[] {
  const tips: PlanningTip[] = [];
  const temp = current.temperature;
  const code = current.weatherCode;
  const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
  const isSnowy = (code >= 71 && code <= 77) || code === 85 || code === 86;
  const isClear = code === 0 || code === 1;
  const uv = current.uvIndex;
  const wind = current.windSpeed;
  const todayForecast = daily[0];
  const maxPrecipProb = todayForecast ? todayForecast.precipProbMax : 0;

  // 1. OUTDOOR ACTIVITIES TIP
  if (isRainy || maxPrecipProb >= 60) {
    tips.push({
      id: 'outdoor-rain',
      category: 'outdoor',
      title: 'Indoor Activities Recommended',
      description: `High precipitation probability (${maxPrecipProb}%). Great day for visiting museums, reading, or cozy indoor workouts.`,
      iconName: 'Umbrella',
      type: 'warning',
    });
  } else if (isSnowy || temp <= 2) {
    tips.push({
      id: 'outdoor-snow',
      category: 'outdoor',
      title: 'Winter Sports & Cozy Outdoors',
      description: 'Crisp, chilly atmosphere! Perfect for ice skating, snow walks, or enjoying hot drinks indoors.',
      iconName: 'Snowflake',
      type: 'info',
    });
  } else if (temp >= 32) {
    tips.push({
      id: 'outdoor-hot',
      category: 'outdoor',
      title: 'Beat the Heat',
      description: 'Sultry heat outdoors. Opt for early morning or sunset walks, pool visits, or air-conditioned spots.',
      iconName: 'Sun',
      type: 'warning',
    });
  } else if (isClear && temp >= 16 && temp <= 28) {
    tips.push({
      id: 'outdoor-perfect',
      category: 'outdoor',
      title: 'Great Day for Outdoor Activities!',
      description: 'Ideal weather for jogging, cycling, picnics, or outdoor photography. Enjoy the fresh air!',
      iconName: 'Bike',
      type: 'positive',
    });
  } else {
    tips.push({
      id: 'outdoor-general',
      category: 'outdoor',
      title: 'Moderate Outdoor Conditions',
      description: 'Weather is stable. Good for brisk walks and outdoor errands with mild layering.',
      iconName: 'Footprints',
      type: 'neutral',
    });
  }

  // 2. CLOTHING & ATTIRE TIP
  if (temp < 10) {
    tips.push({
      id: 'clothing-cold',
      category: 'clothing',
      title: 'Wear Warm Layers & Coat',
      description: 'Bundle up with insulated jackets, scarf, gloves, and thermal innerwear to stay comfortable.',
      iconName: 'Shirt',
      type: 'info',
    });
  } else if (temp >= 10 && temp < 20) {
    tips.push({
      id: 'clothing-mild',
      category: 'clothing',
      title: 'Light Jacket or Sweater',
      description: 'Mild temperatures ahead. A light fleece, cardigan, or windbreaker will keep you comfy.',
      iconName: 'Jacket',
      type: 'neutral',
    });
  } else {
    tips.push({
      id: 'clothing-warm',
      category: 'clothing',
      title: 'Breathable & Light Attire',
      description: 'Warm conditions. Wear light cotton or moisture-wicking fabrics and sunglasses.',
      iconName: 'Glasses',
      type: 'positive',
    });
  }

  // 3. TRAVEL & COMMUTE TIP
  if (isRainy || maxPrecipProb >= 40) {
    tips.push({
      id: 'travel-rain',
      category: 'travel',
      title: 'Carry an Umbrella & Drive Cautiously',
      description: 'Expect wet roads and potential traffic delays. Keep waterproof gear or an umbrella handy!',
      iconName: 'Car',
      type: 'warning',
    });
  } else if (wind >= 30) {
    tips.push({
      id: 'travel-windy',
      category: 'travel',
      title: 'Breezy & Gusty Winds',
      description: `Wind speeds up to ${Math.round(wind)} km/h. Secure loose outdoor objects and hold on to light items.`,
      iconName: 'Wind',
      type: 'warning',
    });
  } else if (code === 45 || code === 48) {
    tips.push({
      id: 'travel-fog',
      category: 'travel',
      title: 'Low Fog Visibility',
      description: 'Drive with low-beam headlights and maintain safe braking distance on roads.',
      iconName: 'Eye',
      type: 'warning',
    });
  } else {
    tips.push({
      id: 'travel-clear',
      category: 'travel',
      title: 'Smooth Travel & Clear Commute',
      description: 'Good road conditions and clear visibility across transit routes.',
      iconName: 'Navigation',
      type: 'positive',
    });
  }

  // 4. HEALTH & UV PROTECTION TIP
  if (uv >= 6) {
    tips.push({
      id: 'health-uv',
      category: 'health',
      title: 'High UV Index – Protect Your Skin',
      description: `UV index is high (${uv.toFixed(1)}). Apply SPF 30+ sunscreen, wear a wide-brim hat, and seek shade during peak noon.`,
      iconName: 'ShieldAlert',
      type: 'warning',
    });
  } else if (temp >= 28) {
    tips.push({
      id: 'health-hydration',
      category: 'health',
      title: 'Stay Well Hydrated',
      description: 'High thermal index. Drink plenty of water throughout the day and avoid heavy sun exposure.',
      iconName: 'Droplets',
      type: 'info',
    });
  } else {
    tips.push({
      id: 'health-good',
      category: 'health',
      title: 'Optimal Fresh Air Quality',
      description: 'Pleasant environmental conditions. Great for taking deep breaths and getting daylight exposure.',
      iconName: 'HeartPulse',
      type: 'positive',
    });
  }

  return tips;
}

/**
 * Format raw date string YYYY-MM-DD into human readable format like 'Today', 'Thu, Jul 23', etc.
 */
export function formatDayLabel(dateStr: string, index: number): { shortDay: string; fullDate: string } {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayOfWeek = dayNames[d.getDay()];
    const month = monthNames[d.getMonth()];
    const dateNum = d.getDate();

    if (index === 0) {
      return { shortDay: 'Today', fullDate: `${dayOfWeek}, ${month} ${dateNum}` };
    }
    return { shortDay: dayOfWeek, fullDate: `${month} ${dateNum}` };
  } catch {
    return { shortDay: index === 0 ? 'Today' : 'Day ' + (index + 1), fullDate: dateStr };
  }
}
