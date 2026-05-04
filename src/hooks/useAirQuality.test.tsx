import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { server } from '../test/server';
import { GEO_URL, AQ_URL } from '../test/handlers';
import { useAirQuality } from './useAirQuality';

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe('useAirQuality', () => {
  it('a) 200 OK — resolves with structured data', async () => {
    const { result } = renderHook(() => useAirQuality('London'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.city).toBe('London');
    expect(result.current.data?.country).toBe('United Kingdom');
    expect(result.current.data?.current.us_aqi).toBe(42);
  });

  it('b) 404 — empty geocode results throw "not found"', async () => {
    server.use(http.get(GEO_URL, () => HttpResponse.json({ results: [] })));
    const { result } = renderHook(() => useAirQuality('Atlantis'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(/not found/i);
  });

  it('c) 429 rate limit — surfaces error from geocoding service', async () => {
    server.use(http.get(GEO_URL, () => new HttpResponse(null, { status: 429 })));
    const { result } = renderHook(() => useAirQuality('London'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('d) 500 server error on AQ endpoint — surfaces error', async () => {
    server.use(http.get(AQ_URL, () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useAirQuality('London'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('e) Network failure — surfaces error', async () => {
    server.use(http.get(GEO_URL, () => HttpResponse.error()));
    const { result } = renderHook(() => useAirQuality('London'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('stays idle when city is null', () => {
    const { result } = renderHook(() => useAirQuality(null), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });
});
