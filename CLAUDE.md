# AtmoSentry — Developer Reference

## General Principles

- **Naming:** Prefer descriptive variable names over abbreviations (e.g., `airQualityIndex` vs `aqi`).
- **Types:** Centralize shared interfaces in `src/types/`.
- **Logic:** No `useEffect` for data fetching; use TanStack Query.
- **Styling:** Mobile-first, BEM conceptual hierarchy, Tailwind v4 utilities only.

## Architecture

### Tech Stack

- **React 19** + TypeScript 6
- **Vite 8** + **Tailwind v4** (via `@tailwindcss/vite`, no config file)
- **TanStack Query v5** — all async state; no `useEffect` data fetching
- **Axios** — HTTP client with per-service error normalisation
- **MSW v2** — API mocking in tests
- **Vitest 4** + **@testing-library/react**

---

## Component Design — BEM + Tailwind v4

We apply **BEM conceptual hierarchy** through React component boundaries and Tailwind v4 utilities.
We do **not** write BEM CSS class names (`.block__element--modifier`) — Tailwind utilities are the single source of styling truth.

| BEM Role     | How We Express It                                   |
| ------------ | --------------------------------------------------- |
| **Block**    | React component (`WeatherStats`, `AirQualityCard`)  |
| **Element**  | Structural child div, semantically placed in JSX    |
| **Modifier** | Conditional class via `cn()` from typed lookup maps |

Modifier maps are typed and exhaustive:

```tsx
const levelText: Record<AqiLevel, string> = {
  good: "text-aqi-good ring-aqi-good",
  mod: "text-aqi-mod  ring-aqi-mod",
  bad: "text-aqi-bad  ring-aqi-bad",
};
```

### Mobile-First (Required)

All layouts start single-column and expand with `md:` breakpoints:

```tsx
// ✅ mobile-first
<div className="flex flex-col md:flex-row gap-4" />

// ❌ desktop-first — never do this
<div className="flex flex-row md:flex-col gap-4" />
```

---

## Data Fetching

### Hook Hierarchy

```
useEnvironmentalData(city)     ← primary hook (AQI + Weather in parallel)
  geocodeCity()                ← sequential, required — throws on failure
  fetchAQByCoords()            ← parallel, required — throws on failure
  tryFetchWeather()            ← parallel, optional — NEVER throws, degrades to undefined

useAirQuality(city)            ← legacy AQI-only hook (kept for backward compat)
```

**Key invariant:** `useEnvironmentalData` resolves if the city is valid and AQI succeeds.
Weather failure is silently swallowed — the UI renders in AQI-only mode.

### Public APIs (No Keys Required)

| API         | Base URL                                                |
| ----------- | ------------------------------------------------------- |
| Geocoding   | `https://geocoding-api.open-meteo.com/v1/search`        |
| Air Quality | `https://air-quality-api.open-meteo.com/v1/air-quality` |
| Weather     | `https://api.open-meteo.com/v1/forecast`                |

---

## Testing

### Colocation Rule (Enforced)

Every test file lives in the **same directory** as the source file it tests. No exceptions.

```
src/
  hooks/
    useAirQuality.ts
    useAirQuality.test.tsx            ✅ colocated
    useEnvironmentalData.ts
    useEnvironmentalData.test.tsx     ✅ colocated
  components/
    WeatherStats/
      WeatherStats.tsx
      WeatherStats.test.tsx           ✅ colocated
  test/
    handlers.ts    ← shared MSW infrastructure (not a unit test)
    server.ts      ← MSW server singleton
    setup.ts       ← jest-dom + server lifecycle
```

### MSW Handler Exports (`src/test/handlers.ts`)

| Export        | Purpose                                         |
| ------------- | ----------------------------------------------- |
| `GEO_URL`     | Geocoding endpoint URL constant                 |
| `AQ_URL`      | Air quality endpoint URL constant               |
| `WEATHER_URL` | Weather forecast endpoint URL constant          |
| `mockGeo`     | Geocoding response fixture                      |
| `mockAq`      | Air quality response fixture                    |
| `mockWeather` | Weather response fixture                        |
| `handlers`    | Default MSW handler array (all three endpoints) |

Override per-test with `server.use(http.get(URL, () => ...))`.
Handlers reset automatically via `afterEach(() => server.resetHandlers())` in `setup.ts`.

---

## File Structure

```
src/
  components/
    AirQualityCard.tsx        ← City overview card (AQI + optional weather)
    AQISkeleton.tsx           ← Full card skeleton (AQI rows + weather rows)
    ComparisonGrid.tsx        ← Pinned city comparison layout
    ErrorBoundary.tsx         ← App-level error boundary (react-error-boundary)
    Logo.tsx                  ← AS gradient SVG mark
    SearchBar.tsx             ← Debounced city search input
    WeatherStats/
      WeatherStats.tsx        ← 3-metric weather widget + WeatherStatsSkeleton
      WeatherStats.test.tsx   ← colocated
  hooks/
    useAirQuality.ts          ← Legacy AQI-only hook
    useAirQuality.test.tsx    ← colocated
    useDebounce.ts
    useEnvironmentalData.ts   ← Unified AQI + weather hook
    useEnvironmentalData.test.tsx ← colocated
  test/
    handlers.ts               ← MSW handlers + response fixtures
    server.ts                 ← MSW server singleton
    setup.ts                  ← jest-dom + server lifecycle
  utils/
    cn.ts                     ← clsx + tailwind-merge helper
    storage.ts                ← Pinned city localStorage (1 h TTL)
  index.css                   ← Tailwind v4 entry + AQI colour tokens
```
