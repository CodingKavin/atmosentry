const HISTORY_KEY = 'as:history';
const PINS_KEY    = 'as:pins';
const TTL_MS      = 60 * 60 * 1000; // 1 hour

interface Stamped<T> {
  value: T;
  ts: number;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stamped<T>;
    if (Date.now() - parsed.ts > TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ value, ts: Date.now() } satisfies Stamped<T>));
  } catch {
    // quota exceeded or unavailable — fail silently
  }
}

export function getSearchHistory(): string[] {
  return read<string[]>(HISTORY_KEY) ?? [];
}

export function addToHistory(city: string): void {
  const prev = getSearchHistory();
  const next = [city, ...prev.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 10);
  write(HISTORY_KEY, next);
}

export function getPinnedCities(): string[] {
  return read<string[]>(PINS_KEY) ?? [];
}

export function togglePin(city: string): string[] {
  const prev = getPinnedCities();
  const exists = prev.some(c => c.toLowerCase() === city.toLowerCase());
  const next = exists
    ? prev.filter(c => c.toLowerCase() !== city.toLowerCase())
    : [...prev, city];
  write(PINS_KEY, next);
  return next;
}
