import { Wind, Cloud, Droplets, Sun, CircleAlert, Pin, PinOff, Info } from 'lucide-react';
import { cn } from '../utils/cn';
import { WeatherStats } from './WeatherStats/WeatherStats';
import { AQIScaleBar } from './AQIScaleBar/AQIScaleBar';
import { Tooltip } from './Tooltip/Tooltip';
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
    <div className="relative w-full max-w-md rounded-2xl bg-slate-800 ring-1 ring-slate-700 p-6 space-y-5">

      {/* Pin / Unpin — anchored to top-right corner of the card */}
      {onPin && (
        <button
          onClick={onPin}
          title={isPinned ? 'Unpin city' : 'Pin city for comparison'}
          className="absolute top-4 right-4 rounded-full p-1.5 bg-slate-700/60 text-slate-400 hover:text-sky-400 hover:bg-slate-700 transition-colors ring-1 ring-slate-600/60"
        >
          {isPinned
            ? <PinOff className="size-3.5" />
            : <Pin className="size-3.5" />
          }
        </button>
      )}

      {/* City / country header — pr-10 reserves space for the pin button */}
      <div>
        <h2 className="text-xl font-semibold text-slate-100 pr-10">{city}</h2>
        <p className="text-sm text-slate-400">{country}</p>
      </div>

      {/* AQI row: status label (left) + numeric badge (right) */}
      <div className="flex items-center justify-between gap-3">
        <div className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
          levelBg[level],
          levelText[level],
        )}>
          <CircleAlert className="size-3.5" />
          {aqiLabel(current.us_aqi)}
        </div>
        <div className={cn('rounded-xl px-3 py-1.5 ring-1 text-right shrink-0', levelText[level], levelBg[level])}>
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs font-medium uppercase tracking-wide">US AQI</span>
            <Tooltip text="Air Quality Index. A 0 to 500 scale showing how clean or polluted the air is and what health effects may apply.">
              <Info className="size-3.5 cursor-default text-white/70 hover:text-white transition-colors" />
            </Tooltip>
          </div>
          <p className="text-2xl font-bold leading-tight">{current.us_aqi}</p>
        </div>
      </div>

      <AQIScaleBar aqiValue={current.us_aqi} />

      {/* AQI pollutant metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {aqiMetrics.map(({ Icon, label, tooltip, value, unit }) => (
          <div key={label} className="rounded-xl bg-slate-900/60 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Icon className="size-3.5" />
              <span className="text-xs">{label}</span>
              <Tooltip text={tooltip}>
                <Info className="size-3.5 cursor-default text-sky-500 hover:text-sky-300 transition-colors" />
              </Tooltip>
            </div>
            <p className="text-lg font-semibold text-slate-100">
              {value.toFixed(1)}
              <span className="text-xs text-slate-500 ml-1">{unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Weather section — only rendered when data is available */}
      {weather && (
        <>
          <div className="border-t border-slate-700/60" />
          <WeatherStats data={weather} />
        </>
      )}

      <p className="text-xs text-slate-500 text-right">
        Updated {new Date(updatedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}
