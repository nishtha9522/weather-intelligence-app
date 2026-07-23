import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  Sparkles,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Sun':
      return <Sun className={`${className} text-amber-400 animate-pulse`} />;
    case 'Moon':
      return <Moon className={`${className} text-indigo-300`} />;
    case 'SunCloud':
      return <CloudSun className={`${className} text-amber-400`} />;
    case 'MoonCloud':
      return <CloudMoon className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog className={`${className} text-teal-300`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={`${className} text-cyan-400`} />;
    case 'CloudRain':
      return <CloudRain className={`${className} text-blue-400`} />;
    case 'Snowflake':
      return <Snowflake className={`${className} text-sky-200 animate-spin-slow`} />;
    case 'CloudLightning':
      return <CloudLightning className={`${className} text-amber-300 animate-bounce`} />;
    default:
      return <Sparkles className={`${className} text-sky-400`} />;
  }
};
