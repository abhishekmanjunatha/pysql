# SQLista Project Instructions

## Project Overview
SQLista is an interactive SQL practice tool for Data Engineers, powered by DuckDB-WASM. It runs entirely in the browser and provides real engineering scenarios.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Database:** DuckDB-WASM
- **Editor:** Monaco Editor
- **Styling:** Tailwind CSS
- **Layout:** React Resizable Panels

## Key Features
- **Challenges Mode:** Guided SQL problems with validation.
- **Playground Mode:** Free exploration of an employee dataset.
- **Schema Browser:** Interactive list of available tables and columns.
- **Theme Support:** Light and Dark mode.

## Development Guidelines
- **State Management:** Local state in `App.tsx`.
- **Data:** Mock data located in `src/lib/`.
- **Styling:** Use Tailwind CSS utility classes. Support dark mode using the `dark:` prefix.
- **Components:** Keep the UI modular. `App.tsx` currently handles the main layout.

## Project Structure
- `src/App.tsx`: Main application component containing layout and logic.
- `src/lib/`: Contains helper functions and data (challenges, schema, duckdb init).
- `public/`: Static assets and service workers for DuckDB-WASM.
