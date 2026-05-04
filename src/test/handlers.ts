import { http, HttpResponse } from 'msw';

export const GEO_URL     = 'https://geocoding-api.open-meteo.com/v1/search';
export const AQ_URL      = 'https://air-quality-api.open-meteo.com/v1/air-quality';
export const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export const mockGeo = {
  results: [{
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
  }],
};

export const mockAq = {
  current: {
    time: '2025-01-15T12:00',
    european_aqi: 25,
    us_aqi: 42,
    pm10: 18.2,
    pm2_5: 9.1,
    carbon_monoxide: 210.5,
    nitrogen_dioxide: 28.3,
    sulphur_dioxide: 3.1,
    ozone: 71.2,
  },
};

export const mockWeather = {
  current: {
    time: '2025-01-15T12:00',
    temperature_2m: 8.4,
    relative_humidity_2m: 78,
    wind_speed_10m: 12.5,
  },
};

export const handlers = [
  http.get(GEO_URL,     () => HttpResponse.json(mockGeo)),
  http.get(AQ_URL,      () => HttpResponse.json(mockAq)),
  http.get(WEATHER_URL, () => HttpResponse.json(mockWeather)),
];
