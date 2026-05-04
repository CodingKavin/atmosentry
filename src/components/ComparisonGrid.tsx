import { PinOff } from 'lucide-react';
import { useAirQuality } from '../hooks/useAirQuality';
import { AirQualityCard } from './AirQualityCard';
import { AQISkeleton } from './AQISkeleton';

function PinnedCard({ city, onUnpin }: { city: string; onUnpin: () => void }) {
  const { data, isLoading, isError, error } = useAirQuality(city);

  return (
    <div className="relative flex-1 min-w-72">
      {isLoading && <AQISkeleton />}

      {isError && (
        <div className="w-full rounded-xl bg-red-950/50 ring-1 ring-red-800 px-4 py-3 text-sm text-red-400">
          {error?.message ?? 'Failed to load data'}
        </div>
      )}

      {data && !isLoading && (
        <div className="relative">
          <AirQualityCard data={data} />
          <button
            onClick={onUnpin}
            title={`Unpin ${city}`}
            className="absolute -top-2 -right-2 rounded-full bg-slate-700 p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-600 transition-colors ring-1 ring-slate-600"
          >
            <PinOff className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

interface ComparisonGridProps {
  cities: string[];
  onUnpin: (city: string) => void;
}

export function ComparisonGrid({ cities, onUnpin }: ComparisonGridProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 flex-wrap w-full">
      {cities.map(city => (
        <PinnedCard key={city} city={city} onUnpin={() => onUnpin(city)} />
      ))}
    </div>
  );
}
