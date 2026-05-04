import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchBar } from './components/SearchBar';
import { AirQualityCard } from './components/AirQualityCard';
import { AQISkeleton } from './components/AQISkeleton';
import { ComparisonGrid } from './components/ComparisonGrid';
import { AppErrorBoundary } from './components/ErrorBoundary';
import { Logo } from './components/Logo';
import { useEnvironmentalData } from './hooks/useEnvironmentalData';
import { useDebounce } from './hooks/useDebounce';
import { getPinnedCities, togglePin, addToHistory } from './utils/storage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

function AirQualityApp() {
  const [inputValue, setInputValue] = useState('');
  const [pinnedCities, setPinnedCities] = useState<string[]>(() => getPinnedCities());

  const debouncedCity = useDebounce(inputValue.trim(), 300);
  const activeCity = debouncedCity.length >= 2 ? debouncedCity : null;
  const { data, isLoading, isError, error } = useEnvironmentalData(activeCity);

  useEffect(() => {
    if (data) addToHistory(data.city);
  }, [data]);

  function handlePin(city: string) {
    setPinnedCities(togglePin(city));
  }

  const isPinned = data
    ? pinnedCities.some(c => c.toLowerCase() === data.city.toLowerCase())
    : false;

  const hasContent = isLoading || isError || !!data;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Hero zone: vertically centered on empty state, compact at top once results appear */}
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

        <SearchBar value={inputValue} onChange={setInputValue} isLoading={isLoading} />
      </div>

      {/* Content zone */}
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
              onPin={() => handlePin(data.city)}
              isPinned={isPinned}
            />
          )}
        </AppErrorBoundary>

        {pinnedCities.length > 0 && (
          <section className="w-full max-w-5xl space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">
              Comparison — {pinnedCities.length} {pinnedCities.length === 1 ? 'city' : 'cities'}
            </h2>
            <ComparisonGrid cities={pinnedCities} onUnpin={handlePin} />
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
