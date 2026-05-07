import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchBar } from './components/SearchBar';
import { AirQualityCard } from './components/AirQualityCard';
import { AQISkeleton } from './components/AQISkeleton';
import { ComparisonGrid } from './components/ComparisonGrid';
import { AppErrorBoundary } from './components/ErrorBoundary';
import { Logo } from './components/Logo';
import { useEnvironmentalData } from './hooks/useEnvironmentalData';
import { useGeoSearch } from './hooks/useGeoSearch';
import { useDebounce } from './hooks/useDebounce';
import { getPinnedLocations, togglePin, addToHistory } from './utils/storage';
import type { GeoResult } from './types/geo';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

function AirQualityApp() {
  const [inputValue, setInputValue] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<GeoResult | null>(null);
  const [pinnedLocations, setPinnedLocations] = useState<GeoResult[]>(() => getPinnedLocations());

  const debouncedQuery = useDebounce(inputValue.trim(), 300);
  // Only search while user is actively typing (not after a selection)
  const searchQuery = !selectedLocation && debouncedQuery.length >= 2 ? debouncedQuery : null;

  const { data: searchResults, isFetching: isSearching } = useGeoSearch(searchQuery);
  const { data, isLoading, isError, error, dataUpdatedAt } = useEnvironmentalData(selectedLocation);

  useEffect(() => {
    if (data) addToHistory(data.city);
  }, [data]);

  function handleSelect(location: GeoResult) {
    setSelectedLocation(location);
    setInputValue(location.name);
  }

  function handleInputChange(value: string) {
    setInputValue(value);
    if (selectedLocation) setSelectedLocation(null);
  }

  function handlePin(location: GeoResult) {
    setPinnedLocations(togglePin(location));
  }

  const pinnedKey = (loc: GeoResult) => `${loc.latitude},${loc.longitude}`;
  const isPinned = selectedLocation
    ? pinnedLocations.some(l => pinnedKey(l) === pinnedKey(selectedLocation))
    : false;

  const hasContent = isLoading || isError || !!data;

  // Pass results only while actively searching (not after a selection)
  const dropdownResults = searchQuery ? searchResults : undefined;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <div className={
        hasContent
          ? 'flex flex-col items-center gap-6 w-full px-4 pt-12 pb-6'
          : 'flex flex-col items-center gap-6 w-full px-4 flex-1 justify-center min-h-[80vh]'
      }>
        <header className="flex items-center gap-3">
          <Logo size={40} />
          <div>
            <h1 className="text-2xl font-bold text-sky-400 tracking-tight leading-none">
              AtmoSentry
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time air quality & weather</p>
          </div>
        </header>

        <SearchBar
          value={inputValue}
          onChange={handleInputChange}
          onSelect={handleSelect}
          results={dropdownResults}
          isSearching={isSearching}
          isLoading={isLoading}
        />
      </div>

      <div className="flex flex-col items-center gap-8 px-4 pb-20">
        <AppErrorBoundary>
          {isLoading && <AQISkeleton />}

          {isError && !isLoading && (
            <div className="w-full max-w-md rounded-xl bg-red-950/50 ring-1 ring-red-800 px-4 py-3 text-sm text-red-400">
              {error.message}
            </div>
          )}

          {data && !isLoading && (
            <AirQualityCard
              data={data}
              updatedAt={dataUpdatedAt}
              onPin={() => selectedLocation && handlePin(selectedLocation)}
              isPinned={isPinned}
            />
          )}
        </AppErrorBoundary>

        {pinnedLocations.length > 0 && (
          <section className="w-full max-w-5xl space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">
              Comparison — {pinnedLocations.length} {pinnedLocations.length === 1 ? 'city' : 'cities'}
            </h2>
            <ComparisonGrid locations={pinnedLocations} onUnpin={handlePin} />
          </section>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AirQualityApp />
    </QueryClientProvider>
  );
}
