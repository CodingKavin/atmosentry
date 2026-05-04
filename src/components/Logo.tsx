import { useId } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className }: LogoProps) {
  const uid = useId().replace(/:/g, '');
  const gid = `asg-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="AtmoSentry"
      className={className}
    >
      <defs>
        <linearGradient id={gid} x1="3" y1="3" x2="45" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="48" height="48" rx="10" fill="#0f172a" />
      {/* Gradient border */}
      <rect width="48" height="48" rx="10"
        stroke={`url(#${gid})`} strokeWidth="1" strokeOpacity="0.3" />

      {/* "A" — (4,37)→apex(15.5,11)→(27,37), crossbar at y=27.5 */}
      <path
        d="M4 37 L15.5 11 L27 37"
        stroke={`url(#${gid})`}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="8.5" y1="27.5" x2="22.5" y2="27.5"
        stroke={`url(#${gid})`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* "S" — upper bowl → crossover → lower bowl, terminus joins A's base at (27,37) */}
      <path
        d="M43 18.5
           C43 13 27.5 13 27 19.5
           C27 25.5 43 29.5 43 32
           C43 37.5 27.5 38 27 37"
        stroke={`url(#${gid})`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
