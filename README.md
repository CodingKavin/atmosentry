# AtmosEntry

A lightweight, real-time Air Quality Index (AQI) tracking application. Built with React and TypeScript to provide instant environmental insights for cities worldwide.

## Features

- **Global Search:** Find air quality data for any major city.
- **Real-time Metrics:** View AQI levels, PM2.5, PM10, and other key pollutants.
- **Responsive Design:** Clean, data-oriented visualization optimized for all devices.

## Tech Stack & Methodology

- **AI Orchestration & Agentic Workflow:**
  - Developed using **Claude Code** (Anthropic CLI) as an autonomous pair-programmer.
  - Implemented a `CLAUDE.md` context-steering file to enforce strict coding standards, naming conventions, and architectural consistency across AI-generated sessions.
- **Security & Infrastructure:**
  - **Dockerized Dev Container:** Isolated the development environment within a specialized sandbox to manage AI file-system permissions securely.
  - **WSL2 Integration:** Leveraged a Linux-backend bridge for high-performance file syncing and containerized dependency management.
- **Frontend Architecture:**
  - **Core:** React 19 + TypeScript + Vite.
  - **State & Data Fetching:** **TanStack Query (v5)** for efficient server-state management, caching, and loading states.
  - **Styling & UI:**
    - **Tailwind CSS** for utility-first design.
    - **clsx & tailwind-merge:** Implemented a custom `cn` helper utility to manage dynamic class merging and resolve CSS specificity conflicts.
  - **Iconography:** Lucide React for accessible, vector-based visual cues.

## Getting Started

1. Clone the repo: `git clone https://github.com/CodingKavin/atmosentry.git`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
