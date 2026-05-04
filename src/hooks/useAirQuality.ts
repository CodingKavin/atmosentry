import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface AirQualityData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  current: {
    time: string;
    european_aqi: number;
    us_aqi: number;
    pm10: number;
    pm2_5: number;
    carbon_monoxide: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    ozone: number;
  };
}

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

async function fetchAirQuality(city: string): Promise<AirQualityData> {
  const geo = await axios
    .get<{ results?: GeoResult[] }>(
      'https://geocoding-api.open-meteo.com/v1/search',
      { params: { name: city, count: 1, language: 'en', format: 'json' } },
    )
    .catch((err: unknown) => {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 429) throw new Error('Rate limited — please try again later');
        if (status && status >= 500) throw new Error('Geocoding service error');
      }
      throw err;
    });

  const loc = geo.data.results?.[0];
  if (!loc) throw new Error(`City "${city}" not found`);

  const aq = await axios
    .get<{ current: AirQualityData['current'] }>(
      'https://air-quality-api.open-meteo.com/v1/air-quality',
      {
        params: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          current: 'european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone',
        },
      },
    )
    .catch((err: unknown) => {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 429) throw new Error('Rate limited — please try again later');
        if (status && status >= 500) throw new Error('Air quality service error');
      }
      throw err;
    });

  return {
    city: loc.name,
    country: loc.country,
    latitude: loc.latitude,
    longitude: loc.longitude,
    current: aq.data.current,
  };
}

export function useAirQuality(city: string | null) {
  return useQuery<AirQualityData, Error>({
    queryKey: ['airQuality', city],
    queryFn: () => fetchAirQuality(city!),
    enabled: !!city,
    staleTime: 60 * 60 * 1000,
  });
}
