import { useEnvironmentalData } from '../hooks/useEnvironmentalData';
import { AirQualityCard } from './AirQualityCard';
import { AQISkeleton } from './AQISkeleton';

function PinnedCard({ city, onUnpin }: { city: string; onUnpin: () => void }) {
  const { data, isLoading, isError, error } = useEnvironmentalData(city);

  return (
    <div className="flex-1 min-w-72">
      {isLoading && <AQISkeleton />}

      {isError && (
        <div className="w-full rounded-xl bg-red-950/50 ring-1 ring-red-800 px-4 py-3 text-sm text-red-400">
          {error?.message ?? 'Failed to load data'}
        </div>
      )}

      {data && !isLoading && (
        <AirQualityCard data={data} onPin={onUnpin} isPinned={true} />
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
