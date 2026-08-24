import { Wind, Cloud, Droplets, Sun, CircleAlert, Pin, PinOff, Info } from 'lucide-react';
import { cn } from '../utils/cn';
import { WeatherStats } from './WeatherStats/WeatherStats';
import { AQIScaleBar } from './AQIScaleBar/AQIScaleBar';
import { Tooltip } from './Tooltip/Tooltip';
import { Typography } from './Typography/Typography';
import type { EnvironmentalData } from '../hooks/useEnvironmentalData';

type AqiLevel = 'good' | 'mod' | 'bad';

function aqiLevel(v: number): AqiLevel {
  if (v <= 50) return 'good';
  if (v <= 100) return 'mod';
  return 'bad';
}

function aqiLabel(v: number): string {
  if (v <= 50) return 'Good';
  if (v <= 100) return 'Moderate';
  if (v <= 150) return 'Unhealthy (Sensitive)';
  if (v <= 200) return 'Unhealthy';
  if (v <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

const levelText: Record<AqiLevel, string> = {
  good: 'text-aqi-good ring-aqi-good',
  mod:  'text-aqi-mod  ring-aqi-mod',
  bad:  'text-aqi-bad  ring-aqi-bad',
};

const levelBg: Record<AqiLevel, string> = {
  good: 'bg-aqi-good/10',
  mod:  'bg-aqi-mod/10',
  bad:  'bg-aqi-bad/10',
};

interface AirQualityCardProps {
  data: EnvironmentalData;
  updatedAt: number;
  onPin?: () => void;
  isPinned?: boolean;
}

export function AirQualityCard({ data, updatedAt, onPin, isPinned = false }: AirQualityCardProps) {
  const { city, country, current, weather } = data;
  const level = aqiLevel(current.us_aqi);

  const aqiMetrics = [
    { Icon: Wind,     label: 'PM2.5', tooltip: 'Fine particles 2.5µm or smaller. The most harmful to lung health.',          value: current.pm2_5,            unit: 'µg/m³' },
    { Icon: Cloud,    label: 'PM10',  tooltip: 'Coarse particles 10µm or smaller. Includes dust, pollen and mould.',          value: current.pm10,             unit: 'µg/m³' },
    { Icon: Droplets, label: 'NO₂',   tooltip: 'Nitrogen dioxide from vehicle exhaust and combustion.',                       value: current.nitrogen_dioxide, unit: 'µg/m³' },
    { Icon: Sun,      label: 'O₃',    tooltip: 'Ground-level ozone formed when sunlight reacts with other pollutants.',       value: current.ozone,            unit: 'µg/m³' },
  ];

  return (
    <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl rounded-2xl bg-slate-800 ring-1 ring-slate-700 p-6 md:p-8 space-y-5 md:space-y-6">

      {/* Pin / Unpin */}
      {onPin && (
        <button
          onClick={onPin}
          title={isPinned ? 'Unpin city' : 'Pin city for comparison'}
          className="absolute top-4 right-4 rounded-full p-1.5 bg-slate-700/60 text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-colors ring-1 ring-slate-600/60"
        >
          {isPinned
            ? <PinOff className="size-3.5 md:size-4" />
            : <Pin    className="size-3.5 md:size-4" />
          }
        </button>
      )}

      {/* City / country header */}
      <div>
        <Typography variant="cardTitle" as="h2" className="font-semibold text-slate-100 pr-10">{city}</Typography>
        <Typography variant="cardSub"   as="p"  className="text-slate-400 mt-0.5">{country}</Typography>
      </div>

      {/* AQI row: status label (left) + numeric badge (right) */}
      <div className="flex items-center justify-between gap-3">
        <div className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium',
          levelBg[level],
          levelText[level],
        )}>
          <CircleAlert className="size-3.5 md:size-4 shrink-0" />
          <Typography variant="badge">{aqiLabel(current.us_aqi)}</Typography>
        </div>
        <div className={cn('rounded-xl px-3 py-1.5 ring-1 text-right shrink-0', levelText[level], levelBg[level])}>
          <div className="flex items-center justify-end gap-1">
            <Typography variant="badgeHdr" className="font-medium uppercase tracking-wide">US AQI</Typography>
            <Tooltip text="Air Quality Index. A 0 to 500 scale showing how clean or polluted the air is and what health effects may apply.">
              <Info className="size-3.5 md:size-4 cursor-default text-white/70 hover:text-white transition-colors" />
            </Tooltip>
          </div>
          <Typography variant="metricLg" as="p" className="font-bold leading-tight">{current.us_aqi}</Typography>
        </div>
      </div>

      <AQIScaleBar aqiValue={current.us_aqi} />

      {/* Pollutant metrics grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {aqiMetrics.map(({ Icon, label, tooltip, value, unit }) => (
          <div key={label} className="rounded-xl bg-slate-900/60 p-3 md:p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Icon className="size-3.5 md:size-4 shrink-0" />
              <Typography variant="metricLabel">{label}</Typography>
              <Tooltip text={tooltip}>
                <Info className="size-3.5 md:size-4 cursor-default text-sky-500 hover:text-sky-300 transition-colors" />
              </Tooltip>
            </div>
            <p>
              <Typography variant="metricMd" className="font-semibold text-slate-100">{value.toFixed(1)}</Typography>
              <Typography variant="metricUnit" className="text-slate-500 ml-1">{unit}</Typography>
            </p>
          </div>
        ))}
      </div>

      {/* Weather section */}
      {weather && (
        <>
          <div className="border-t border-slate-700/60" />
          <WeatherStats data={weather} />
        </>
      )}

      <Typography variant="caption" as="p" className="text-slate-500 text-right">
        Updated {new Date(updatedAt).toLocaleTimeString()}
      </Typography>
    </div>
  );
}
