import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { server } from '../test/server';
import { GEO_URL, AQ_URL, WEATHER_URL } from '../test/handlers';
import { useEnvironmentalData } from './useEnvironmentalData';

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe('useEnvironmentalData', () => {
  it('a) 200 OK — resolves with AQI and weather', async () => {
    const { result } = renderHook(() => useEnvironmentalData('London'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.city).toBe('London');
    expect(result.current.data?.country).toBe('United Kingdom');
    expect(result.current.data?.current.us_aqi).toBe(42);
    expect(result.current.data?.weather?.temperature_2m).toBe(8.4);
    expect(result.current.data?.weather?.relative_humidity_2m).toBe(78);
    expect(result.current.data?.weather?.wind_speed_10m).toBe(12.5);
  });

  it('b) Weather API fails — resolves with weather: undefined (graceful degradation)', async () => {
    server.use(http.get(WEATHER_URL, () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useEnvironmentalData('London'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.city).toBe('London');
    expect(result.current.data?.current.us_aqi).toBe(42);
    expect(result.current.data?.weather).toBeUndefined();
  });

  it('c) AQ API fails (500) — surfaces error', async () => {
    server.use(http.get(AQ_URL, () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useEnvironmentalData('London'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(/air quality/i);
  });

  it('d) City not found — surfaces "not found" error', async () => {
    server.use(http.get(GEO_URL, () => HttpResponse.json({ results: [] })));
    const { result } = renderHook(() => useEnvironmentalData('Atlantis'), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(/not found/i);
  });

  it('e) null city — stays idle', () => {
    const { result } = renderHook(() => useEnvironmentalData(null), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });
});
