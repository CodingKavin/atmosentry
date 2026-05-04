import { Thermometer, Droplets, Wind } from 'lucide-react';
import type { WeatherCurrent } from '../../hooks/useEnvironmentalData';

interface WeatherStatsProps {
  data: WeatherCurrent;
}

export function WeatherStats({ data }: WeatherStatsProps) {
  const metrics = [
    { Icon: Thermometer, label: 'Temp',    value: `${data.temperature_2m.toFixed(1)}°C` },
    { Icon: Droplets,   label: 'Humidity', value: `${data.relative_humidity_2m}%` },
    { Icon: Wind,       label: 'Wind',     value: `${data.wind_speed_10m.toFixed(1)} km/h` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map(({ Icon, label, value }) => (
        <div key={label} className="rounded-xl bg-slate-900/60 p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Icon className="size-3.5" />
            <span className="text-xs">{label}</span>
          </div>
          <p className="text-sm font-semibold text-slate-100">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function WeatherStatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="rounded-xl bg-slate-900/60 p-3 space-y-2">
          <div className="h-3 w-12 rounded bg-slate-700/60" />
          <div className="h-4 w-14 rounded bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
