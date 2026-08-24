import { cn } from '../../utils/cn';
import type { ElementType, ReactNode } from 'react';

/**
 * All responsive text size steps live here.
 * To rescale the whole dashboard, edit the class strings below.
 */

export type TypographyVariant =
  | 'appTitle'    // AtmoSentry header
  | 'appSub'      // "Real-time air quality & weather"
  | 'cardTitle'   // City name
  | 'cardSub'     // Country
  | 'metricLg'    // AQI number (hero)
  | 'metricMd'    // Pollutant values
  | 'metricSm'    // Weather values
  | 'metricLabel' // PM2.5, Temp, etc.
  | 'metricUnit'  // µg/m³, km/h
  | 'badge'       // Good / Moderate / Unhealthy
  | 'badgeHdr'    // US AQI label
  | 'scaleLbl'    // AQI scale bar tier labels
  | 'caption';    // Timestamps, small text

const scale: Record<TypographyVariant, string> = {
  appTitle:    'text-2xl  md:text-3xl',
  appSub:      'text-xs   md:text-sm',
  cardTitle:   'text-xl   md:text-2xl  lg:text-3xl',
  cardSub:     'text-sm   md:text-base',
  metricLg:    'text-2xl  md:text-3xl  lg:text-4xl',
  metricMd:    'text-lg   md:text-xl   lg:text-2xl',
  metricSm:    'text-sm   md:text-base',
  metricLabel: 'text-xs   md:text-sm',
  metricUnit:  'text-xs   md:text-sm',
  badge:       'text-sm   md:text-base',
  badgeHdr:    'text-xs   md:text-sm',
  scaleLbl:    'text-[10px] md:text-xs',
  caption:     'text-xs   md:text-sm',
};

interface TypographyProps {
  variant: TypographyVariant;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export function Typography({ variant, as: Tag = 'span', className, children }: TypographyProps) {
  return <Tag className={cn(scale[variant], className)}>{children}</Tag>;
}
