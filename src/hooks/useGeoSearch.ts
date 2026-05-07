import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { GeoResult } from '../types/geo';

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';

async function searchCities(query: string): Promise<GeoResult[]> {
  const res = await axios.get<{ results?: GeoResult[] }>(GEO_API, {
    params: { name: query, count: 10, language: 'en', format: 'json' },
  });
  const results = res.data.results ?? [];
  const lowerQuery = query.toLowerCase();
  return results.filter(r => r.name.toLowerCase().includes(lowerQuery));
}

export function useGeoSearch(query: string | null) {
  return useQuery<GeoResult[], Error>({
    queryKey: ['geoSearch', query],
    queryFn: () => searchCities(query!),
    enabled: !!query && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
