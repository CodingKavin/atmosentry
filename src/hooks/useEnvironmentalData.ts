import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { AirQualityData } from './useAirQuality';

export interface WeatherCurrent {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
}

export interface EnvironmentalData extends AirQualityData {
  weather?: WeatherCurrent;
}

const GEO_API     = 'https://geocoding-api.open-meteo.com/v1/search';
const AQ_API      = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

function handleAxiosError(serviceMsg: string) {
  return (err: unknown): never => {
    if (axios.isAxiosError(err)) {
      const s = err.response?.status;
      if (s === 429) throw new Error('Rate limited — please try again later');
      if (s && s >= 500) throw new Error(serviceMsg);
    }
    throw err;
  };
}

async function geocodeCity(city: string): Promise<GeoResult> {
  const res = await axios
    .get<{ results?: GeoResult[] }>(GEO_API, {
      params: { name: city, count: 1, language: 'en', format: 'json' },
    })
    .catch(handleAxiosError('Geocoding service error'));
  const loc = res.data.results?.[0];
  if (!loc) throw new Error(`City "${city}" not found`);
  return loc;
}

async function fetchAQByCoords(lat: number, lon: number): Promise<AirQualityData['current']> {
  const res = await axios
    .get<{ current: AirQualityData['current'] }>(AQ_API, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
      },
    })
    .catch(handleAxiosError('Air quality service error'));
  return res.data.current;
}

async function tryFetchWeather(lat: number, lon: number): Promise<WeatherCurrent | undefined> {
  try {
    const res = await axios.get<{ current: WeatherCurrent }>(WEATHER_API, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
      },
    });
    return res.data.current;
  } catch {
    return undefined;
  }
}

async function fetchEnvironmentalData(city: string): Promise<EnvironmentalData> {
  const loc = await geocodeCity(city);
  const [aq, weather] = await Promise.all([
    fetchAQByCoords(loc.latitude, loc.longitude),
    tryFetchWeather(loc.latitude, loc.longitude),
  ]);
  return {
    city: loc.name,
    country: loc.country,
    latitude: loc.latitude,
    longitude: loc.longitude,
    current: aq,
    weather,
  };
}

export function useEnvironmentalData(city: string | null) {
  return useQuery<EnvironmentalData, Error>({
    queryKey: ['environmental', city],
    queryFn: () => fetchEnvironmentalData(city!),
    enabled: !!city,
    staleTime: 60 * 60 * 1000,
  });
}
