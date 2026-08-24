import { cn } from '../../utils/cn';
import { Typography } from '../Typography/Typography';

interface AQIScaleBarProps {
  aqiValue: number;
}

type TierColor = 'good' | 'mod' | 'usg' | 'bad' | 'vbad' | 'haz';

const TIERS: { max: number; label: string; color: TierColor }[] = [
  { max: 50,       label: 'Good',      color: 'good' },
  { max: 100,      label: 'Moderate',  color: 'mod'  },
  { max: 150,      label: 'Sensitive', color: 'usg'  },
  { max: 200,      label: 'Unhealthy', color: 'bad'  },
  { max: 300,      label: 'Very High', color: 'vbad' },
  { max: Infinity, label: 'Hazardous', color: 'haz'  },
];

const activeStyles: Record<TierColor, string> = {
  good: 'text-aqi-good ring-1 ring-aqi-good bg-aqi-good/10',
  mod:  'text-aqi-mod  ring-1 ring-aqi-mod  bg-aqi-mod/10',
  usg:  'text-aqi-usg  ring-1 ring-aqi-usg  bg-aqi-usg/10',
  bad:  'text-aqi-bad  ring-1 ring-aqi-bad  bg-aqi-bad/10',
  vbad: 'text-aqi-vbad ring-1 ring-aqi-vbad bg-aqi-vbad/10',
  haz:  'text-aqi-haz  ring-1 ring-aqi-haz  bg-aqi-haz/10',
};

const dotColor: Record<TierColor, string> = {
  good: 'bg-aqi-good',
  mod:  'bg-aqi-mod',
  usg:  'bg-aqi-usg',
  bad:  'bg-aqi-bad',
  vbad: 'bg-aqi-vbad',
  haz:  'bg-aqi-haz',
};

function activeIndex(value: number): number {
  return TIERS.findIndex((t) => value <= t.max);
}

export function AQIScaleBar({ aqiValue }: AQIScaleBarProps) {
  const active = activeIndex(aqiValue);

  return (
    <div className="flex gap-1" role="img" aria-label={`AQI scale — current level: ${TIERS[active]?.label ?? 'Hazardous'}`}>
      {TIERS.map(({ label, color }, i) => {
        const isActive = i === active;
        return (
          <div
            key={label}
            className={cn(
              'flex-1 rounded-lg px-1 py-1.5 flex flex-col items-center gap-1',
              isActive ? activeStyles[color] : 'opacity-40',
            )}
          >
            <div className={cn('size-2 md:size-2.5 rounded-full', dotColor[color])} />
            <Typography
              variant="scaleLbl"
              className={cn('leading-tight text-center', isActive ? 'font-semibold' : 'text-slate-400')}
            >
              {label}
            </Typography>
          </div>
        );
      })}
    </div>
  );
}
