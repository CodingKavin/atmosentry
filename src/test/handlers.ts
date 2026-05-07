import { http, HttpResponse } from 'msw';

export const GEO_URL     = 'https://geocoding-api.open-meteo.com/v1/search';
export const AQ_URL      = 'https://air-quality-api.open-meteo.com/v1/air-quality';
export const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

export const mockGeo = {
  results: [{
    id: 2643743,
    name: 'London',
    admin1: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
  }],
};

export const mockGeoMultiple = {
  results: [
    {
      id: 2643743,
      name: 'London',
      admin1: 'England',
      latitude: 51.5074,
      longitude: -0.1278,
      country: 'United Kingdom',
    },
    {
      id: 6058560,
      name: 'London',
      admin1: 'Ontario',
      latitude: 42.9837,
      longitude: -81.2497,
      country: 'Canada',
    },
    {
      id: 5089178,
      name: 'Londonderry',
      admin1: 'New Hampshire',
      latitude: 42.8651,
      longitude: -71.3742,
      country: 'United States',
    },
  ],
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
