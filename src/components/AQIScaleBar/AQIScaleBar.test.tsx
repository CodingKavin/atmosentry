import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AQIScaleBar } from './AQIScaleBar';

const ALL_LABELS = ['Good', 'Moderate', 'Sensitive', 'Unhealthy', 'Very High', 'Hazardous'];

// --- happy path ---

describe('AQIScaleBar', () => {
  it('renders all 6 tier labels', () => {
    render(<AQIScaleBar aqiValue={25} />);
    for (const label of ALL_LABELS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('has an accessible aria-label naming the current level', () => {
    render(<AQIScaleBar aqiValue={25} />);
    expect(screen.getByRole('img', { name: /current level: Good/i })).toBeInTheDocument();
  });

// --- active tier selection ---

  it('highlights Good for AQI 0', () => {
    render(<AQIScaleBar aqiValue={0} />);
    expect(screen.getByRole('img', { name: /current level: Good/i })).toBeInTheDocument();
  });

  it('highlights Good at the upper boundary (AQI 50)', () => {
    render(<AQIScaleBar aqiValue={50} />);
    expect(screen.getByRole('img', { name: /current level: Good/i })).toBeInTheDocument();
  });

  it('highlights Moderate at AQI 51', () => {
    render(<AQIScaleBar aqiValue={51} />);
    expect(screen.getByRole('img', { name: /current level: Moderate/i })).toBeInTheDocument();
  });

  it('highlights Moderate at the upper boundary (AQI 100)', () => {
    render(<AQIScaleBar aqiValue={100} />);
    expect(screen.getByRole('img', { name: /current level: Moderate/i })).toBeInTheDocument();
  });

  it('highlights Sensitive at AQI 101', () => {
    render(<AQIScaleBar aqiValue={101} />);
    expect(screen.getByRole('img', { name: /current level: Sensitive/i })).toBeInTheDocument();
  });

  it('highlights Unhealthy at AQI 151', () => {
    render(<AQIScaleBar aqiValue={151} />);
    expect(screen.getByRole('img', { name: /current level: Unhealthy/i })).toBeInTheDocument();
  });

  it('highlights Very High at AQI 201', () => {
    render(<AQIScaleBar aqiValue={201} />);
    expect(screen.getByRole('img', { name: /current level: Very High/i })).toBeInTheDocument();
  });

  it('highlights Hazardous at AQI 301', () => {
    render(<AQIScaleBar aqiValue={301} />);
    expect(screen.getByRole('img', { name: /current level: Hazardous/i })).toBeInTheDocument();
  });

  it('highlights Hazardous for very large AQI values', () => {
    render(<AQIScaleBar aqiValue={999} />);
    expect(screen.getByRole('img', { name: /current level: Hazardous/i })).toBeInTheDocument();
  });

// --- edge cases ---

  // TODO: add your edge cases below
});
