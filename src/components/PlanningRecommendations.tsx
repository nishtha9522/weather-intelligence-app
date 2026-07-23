import React from 'react';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Bike,
  Shirt,
  Car,
  ShieldAlert,
  Umbrella,
  Sun,
  Footprints,
  Glasses,
  Wind,
  Eye,
  Navigation,
  Droplets,
  HeartPulse,
  Snowflake,
} from 'lucide-react';
import { PlanningTip } from '../types';

interface PlanningRecommendationsProps {
  tips: PlanningTip[];
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  // Render matching Lucide icon based on string iconName
  const renderIcon = (name: string) => {
    const props = { className: 'w-5 h-5 shrink-0' };
    switch (name) {
      case 'Umbrella':
        return <Umbrella {...props} />;
      case 'Snowflake':
        return <Snowflake {...props} />;
      case 'Sun':
        return <Sun {...props} />;
      case 'Bike':
        return <Bike {...props} />;
      case 'Footprints':
        return <Footprints {...props} />;
      case 'Shirt':
        return <Shirt {...props} />;
      case 'Glasses':
        return <Glasses {...props} />;
      case 'Car':
        return <Car {...props} />;
      case 'Wind':
        return <Wind {...props} />;
      case 'Eye':
        return <Eye {...props} />;
      case 'Navigation':
        return <Navigation {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'Droplets':
        return <Droplets {...props} />;
      case 'HeartPulse':
        return <HeartPulse {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const categoryTitles = {
    outdoor: 'Outdoor Activities',
    clothing: 'Clothing & Attire',
    travel: 'Travel & Commute',
    health: 'Health & UV Precautions',
  };

  return (
    <section id="planning-recommendations-section" className="space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Smart Activity Planning & Recommendations
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Contextual Tips
        </span>
      </div>

      {/* Grid of Tip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tips.map((tip) => {
          let styleClasses = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
          let badgeBg = 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
          let iconColor = 'text-sky-500';

          if (tip.type === 'positive') {
            styleClasses = 'bg-gradient-to-br from-emerald-500/5 via-white to-emerald-50/30 dark:from-emerald-950/20 dark:via-slate-800 dark:to-slate-800 border-emerald-200/80 dark:border-emerald-800/80';
            badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
            iconColor = 'text-emerald-600 dark:text-emerald-400';
          } else if (tip.type === 'warning') {
            styleClasses = 'bg-gradient-to-br from-amber-500/5 via-white to-amber-50/30 dark:from-amber-950/20 dark:via-slate-800 dark:to-slate-800 border-amber-200/80 dark:border-amber-800/80';
            badgeBg = 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300';
            iconColor = 'text-amber-600 dark:text-amber-400';
          } else if (tip.type === 'info') {
            styleClasses = 'bg-gradient-to-br from-sky-500/5 via-white to-sky-50/30 dark:from-sky-950/20 dark:via-slate-800 dark:to-slate-800 border-sky-200/80 dark:border-sky-800/80';
            badgeBg = 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300';
            iconColor = 'text-sky-600 dark:text-sky-400';
          }

          return (
            <div
              key={tip.id}
              id={`tip-card-${tip.id}`}
              className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between ${styleClasses}`}
            >
              <div>
                {/* Category Badge & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                    {categoryTitles[tip.category]}
                  </span>
                  <div className={`p-2 rounded-xl bg-white dark:bg-slate-700/80 shadow-sm ${iconColor}`}>
                    {renderIcon(tip.iconName)}
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                  {tip.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tip.description}
                </p>
              </div>

              {/* Status Indicator Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {tip.type === 'positive' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                {tip.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                {tip.type === 'info' && <Info className="w-3.5 h-3.5 text-sky-500" />}
                <span>{tip.type === 'warning' ? 'Take Precautions' : tip.type === 'positive' ? 'Optimal Condition' : 'Weather Guidance'}</span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
