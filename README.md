# SQL Pipeline Plumber

An interactive SQL practice tool for Data Engineers, powered by DuckDB-WASM.

## Features
- **Browser-based OLAP:** Runs entirely in your browser using DuckDB-WASM.
- **Real Engineering Scenarios:** Fix broken pipelines, clean dirty data, and optimize queries.
- **Interactive Editor:** Monaco Editor with SQL syntax highlighting.
- **Playground Mode:** Explore a sample employee dataset with an interactive schema browser.
- **Custom Data:** Upload your own CSV files to analyze in the playground.
- **Dark Mode:** Toggle between light and dark themes for comfortable coding.
- **Resizable Layout:** Customize your workspace with adjustable panels.

## Getting Started
1. Install dependencies: 
   ```bash
   npm install
   ```
2. Start the dev server: 
   ```bash
   npm run dev
   ```
3. Open http://localhost:5173 

## Deployment
This project is configured for GitHub Pages.
1. Push to the `main` branch.
2. The GitHub Action will automatically build and deploy to `gh-pages`.
3. Ensure `Settings > Pages` in your repo is set to deploy from the `gh-pages` branch.

## Tech Stack
- React + TypeScript + Vite
- DuckDB-WASM
- Monaco Editor
- Tailwind CSS
- React Resizable Panels
