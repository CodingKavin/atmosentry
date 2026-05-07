import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { server } from '../test/server';
import { GEO_URL } from '../test/handlers';
import { useGeoSearch } from './useGeoSearch';

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe('useGeoSearch', () => {
  it('a) returns results whose name contains the query (case-insensitive)', async () => {
    server.use(
      http.get(GEO_URL, () =>
        HttpResponse.json({
          results: [
            { id: 1, name: 'London',      admin1: 'England',       latitude: 51.5074, longitude: -0.1278,  country: 'United Kingdom' },
            { id: 2, name: 'Londonderry', admin1: 'New Hampshire', latitude: 42.8651, longitude: -71.3742, country: 'United States' },
            { id: 3, name: 'Izhevsk',     admin1: 'Udmurtia',      latitude: 56.8519, longitude: 53.2045,  country: 'Russia' },
          ],
        }),
      ),
    );
    const { result } = renderHook(() => useGeoSearch('lon'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data?.map(r => r.name)).toEqual(['London', 'Londonderry']);
  });

  it('b) filters out API results that do not contain the query substring', async () => {
    server.use(
      http.get(GEO_URL, () =>
        HttpResponse.json({
          results: [
            { id: 3, name: 'Izhevsk', latitude: 56.8519, longitude: 53.2045, country: 'Russia' },
          ],
        }),
      ),
    );
    const { result } = renderHook(() => useGeoSearch('ijk'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(0);
  });

  it('c) null query — stays idle', () => {
    const { result } = renderHook(() => useGeoSearch(null), { wrapper: makeWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });

  it('d) single-character query — stays idle', () => {
    const { result } = renderHook(() => useGeoSearch('L'), { wrapper: makeWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('e) API returns no results — returns empty array', async () => {
    server.use(http.get(GEO_URL, () => HttpResponse.json({ results: [] })));
    const { result } = renderHook(() => useGeoSearch('xyz'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(0);
  });

  it('f) API returns missing results field — returns empty array', async () => {
    server.use(http.get(GEO_URL, () => HttpResponse.json({})));
    const { result } = renderHook(() => useGeoSearch('xyz'), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(0);
  });
});
