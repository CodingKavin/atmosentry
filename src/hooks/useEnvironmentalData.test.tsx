import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { server } from '../test/server';
import { AQ_URL, WEATHER_URL } from '../test/handlers';
import { useEnvironmentalData } from './useEnvironmentalData';
import type { GeoResult } from '../types/geo';

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

const londonUK: GeoResult = {
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5074,
  longitude: -0.1278,
};

const londonCA: GeoResult = {
  name: 'London',
  country: 'Canada',
  latitude: 42.9837,
  longitude: -81.2497,
};

describe('useEnvironmentalData', () => {
  it('a) resolves with AQI and weather for a selected location', async () => {
    const { result } = renderHook(() => useEnvironmentalData(londonUK), {
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

  it('b) uses exact coordinates and metadata from the selected GeoResult', async () => {
    const { result } = renderHook(() => useEnvironmentalData(londonCA), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.city).toBe('London');
    expect(result.current.data?.country).toBe('Canada');
    expect(result.current.data?.latitude).toBe(42.9837);
    expect(result.current.data?.longitude).toBe(-81.2497);
  });

  it('c) Weather API fails — resolves with weather: undefined (graceful degradation)', async () => {
    server.use(http.get(WEATHER_URL, () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useEnvironmentalData(londonUK), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.city).toBe('London');
    expect(result.current.data?.current.us_aqi).toBe(42);
    expect(result.current.data?.weather).toBeUndefined();
  });

  it('d) AQ API fails (500) — surfaces error', async () => {
    server.use(http.get(AQ_URL, () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useEnvironmentalData(londonUK), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(/air quality/i);
  });

  it('e) null location — stays idle', () => {
    const { result } = renderHook(() => useEnvironmentalData(null), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(result.current.data).toBeUndefined();
  });
});
