import { useEnvironmentalData } from '../hooks/useEnvironmentalData';
import { AirQualityCard } from './AirQualityCard';
import { AQISkeleton } from './AQISkeleton';
import type { GeoResult } from '../types/geo';

function PinnedCard({ location, onUnpin }: { location: GeoResult; onUnpin: () => void }) {
  const { data, isLoading, isError, error, dataUpdatedAt } = useEnvironmentalData(location);

  return (
    <div className="w-full lg:flex-1 lg:min-w-72">
      {isLoading && <AQISkeleton />}

      {isError && (
        <div className="w-full rounded-xl bg-red-950/50 ring-1 ring-red-800 px-4 py-3 text-sm text-red-400">
          {error?.message ?? 'Failed to load data'}
        </div>
      )}

      {data && !isLoading && (
        <AirQualityCard data={data} updatedAt={dataUpdatedAt} onPin={onUnpin} isPinned={true} />
      )}
    </div>
  );
}

interface ComparisonGridProps {
  locations: GeoResult[];
  onUnpin: (location: GeoResult) => void;
}

export function ComparisonGrid({ locations, onUnpin }: ComparisonGridProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-wrap w-full items-center lg:items-start">
      {locations.map(location => (
        <PinnedCard
          key={`${location.latitude}-${location.longitude}`}
          location={location}
          onUnpin={() => onUnpin(location)}
        />
      ))}
    </div>
  );
}
