# AtmosEntry: AI Coding Guidelines

## Tech Stack

- React (Vite)
- Tailwind CSS
- TanStack Query (Data Fetching)
- Lucide React (Icons)
- clsx + tailwind-merge (Utility classes)

## Coding Standards

- Use functional components and Arrow functions.
- Use the `cn()` helper from `@/lib/utils` for all conditional classes.
- Prefer descriptive variable names over short ones (e.g., `airQualityIndex` vs `aqi`).
- All data fetching must use TanStack Query hooks.

## Component Structure

- Components should be modular and kept in `src/components`.
- Types should be kept in `src/types`.
- All reused hooks should be in `src/hooks`.
