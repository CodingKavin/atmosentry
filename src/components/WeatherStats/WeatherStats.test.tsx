import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherStats, WeatherStatsSkeleton } from './WeatherStats';

const fixture = {
  time: '2025-01-15T12:00',
  temperature_2m: 8.4,
  relative_humidity_2m: 78,
  wind_speed_10m: 12.5,
};

describe('WeatherStats', () => {
  it('renders temperature with °C unit', () => {
    render(<WeatherStats data={fixture} />);
    expect(screen.getByText('8.4°C')).toBeInTheDocument();
  });

  it('renders humidity with % unit', () => {
    render(<WeatherStats data={fixture} />);
    expect(screen.getByText('78%')).toBeInTheDocument();
  });

  it('renders wind speed with km/h unit', () => {
    render(<WeatherStats data={fixture} />);
    expect(screen.getByText('12.5 km/h')).toBeInTheDocument();
  });

  it('renders all three metric labels', () => {
    render(<WeatherStats data={fixture} />);
    expect(screen.getByText('Temp')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('Wind')).toBeInTheDocument();
  });
});

describe('WeatherStatsSkeleton', () => {
  it('renders 3 placeholder tiles', () => {
    const { container } = render(<WeatherStatsSkeleton />);
    expect(container.firstChild?.childNodes).toHaveLength(3);
  });
});
