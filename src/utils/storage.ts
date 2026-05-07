import type { GeoResult } from '../types/geo';

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

function locationKey(loc: GeoResult): string {
  return `${loc.latitude},${loc.longitude}`;
}

export function getPinnedLocations(): GeoResult[] {
  return read<GeoResult[]>(PINS_KEY) ?? [];
}

export function togglePin(location: GeoResult): GeoResult[] {
  const prev = getPinnedLocations();
  const key = locationKey(location);
  const exists = prev.some(l => locationKey(l) === key);
  const next = exists
    ? prev.filter(l => locationKey(l) !== key)
    : [...prev, location];
  write(PINS_KEY, next);
  return next;
}
