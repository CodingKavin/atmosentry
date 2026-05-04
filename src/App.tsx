import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Pin, PinOff } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { AirQualityCard } from './components/AirQualityCard';
import { AQISkeleton } from './components/AQISkeleton';
import { ComparisonGrid } from './components/ComparisonGrid';
import { AppErrorBoundary } from './components/ErrorBoundary';
import { Logo } from './components/Logo';
import { useAirQuality } from './hooks/useAirQuality';
import { useDebounce } from './hooks/useDebounce';
import { getPinnedCities, togglePin, addToHistory } from './utils/storage';
import { cn } from './utils/cn';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

function AirQualityApp() {
  const [inputValue, setInputValue] = useState('');
  const [pinnedCities, setPinnedCities] = useState<string[]>(() => getPinnedCities());

  const debouncedCity = useDebounce(inputValue.trim(), 300);
  const activeCity = debouncedCity.length >= 2 ? debouncedCity : null;
  const { data, isLoading, isError, error } = useAirQuality(activeCity);

  useEffect(() => {
    if (data) addToHistory(data.city);
  }, [data]);

  function handlePin(city: string) {
    setPinnedCities(togglePin(city));
  }

  const isPinned = data
    ? pinnedCities.some(c => c.toLowerCase() === data.city.toLowerCase())
    : false;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center px-4 pt-12 pb-20 gap-8">
      <header className="flex items-center gap-3">
        <Logo size={40} />
        <div>
          <h1 className="text-2xl font-bold text-sky-400 tracking-tight leading-none">
            AtmoSentry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time air quality</p>
        </div>
      </header>

      <SearchBar value={inputValue} onChange={setInputValue} isLoading={isLoading} />

      <AppErrorBoundary>
        {isLoading && <AQISkeleton />}

        {isError && !isLoading && (
          <div className="w-full max-w-md rounded-xl bg-red-950/50 ring-1 ring-red-800 px-4 py-3 text-sm text-red-400">
            {error.message}
          </div>
        )}

        {data && !isLoading && (
          <div className="w-full max-w-md space-y-3">
            <AirQualityCard data={data} />
            <button
              onClick={() => handlePin(data.city)}
              className={cn(
                'w-full rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2',
                isPinned
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30 hover:bg-sky-500/20',
              )}
            >
              {isPinned
                ? <><PinOff className="size-3.5" /> Unpin city</>
                : <><Pin className="size-3.5" /> Pin for comparison</>
              }
            </button>
          </div>
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
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AirQualityApp />
    </QueryClientProvider>
  );
}
