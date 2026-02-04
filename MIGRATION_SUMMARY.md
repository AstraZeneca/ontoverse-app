# Migration Summary: NestJS + React to Next.js

This document summarizes the migration from a separate NestJS backend and React frontend to a unified Next.js application.

## Migration Overview

The project has been successfully refactored to use Next.js as a single framework for both frontend and backend functionality.

## Key Changes

### 1. Project Structure

**Before:**
```
odsp-ontoverse/
├── backend/          # NestJS application
│   └── src/
└── frontend/          # React application
    └── src/
```

**After:**
```
odsp-ontoverse/
├── app/              # Next.js app directory
│   ├── api/         # API routes (replaces NestJS controllers)
│   ├── layout.tsx    # Root layout
│   └── page.tsx     # Home page
├── components/      # React components (from frontend/src/components)
├── lib/             # Shared utilities
│   ├── neo4j/       # Neo4j database utilities (from backend)
│   ├── papers/      # Paper models (from backend)
│   ├── utils/       # Utility functions
│   └── state/       # State management
├── model/           # Data models (from frontend/src/model)
└── public/           # Static assets
```

### 2. Backend Migration

#### NestJS Controllers → Next.js API Routes

**Before (NestJS):**
- `backend/src/app.controller.ts` → `GET /api/papers`

**After (Next.js):**
- `app/api/papers/route.ts` → `GET /api/papers`

#### Neo4j Service

**Before:**
- `backend/src/papers/papers.service.ts` with dependency injection

**After:**
- `lib/neo4j/neo4j-driver.ts` with direct functions
- `lib/neo4j/neo4j-config.ts` for configuration

### 3. Frontend Migration

#### React App → Next.js App Router

**Before:**
- `frontend/src/App.tsx` with React Router
- `frontend/src/index.tsx` as entry point

**After:**
- `app/page.tsx` as the main page
- `app/layout.tsx` for root layout
- No React Router needed (Next.js handles routing)

#### Component Imports

All relative imports have been updated to use the `@/` alias:
- `../model/` → `@/model/`
- `../utils/` → `@/lib/utils/`
- `../state/` → `@/lib/state/`
- `../config` → `@/lib/config`

### 4. Configuration Changes

#### Environment Variables

**Before:**
- Frontend: `window._env_.REACT_APP_API_URL`
- Backend: `process.env.DB_*`

**After:**
- Next.js: `process.env.DB_*` (server-side)
- Next.js: `process.env.NEXT_PUBLIC_*` (client-side)

#### API Endpoints

**Before:**
- Frontend fetches from `${API_URI}/api/papers` (external URL)

**After:**
- Frontend fetches from `/api/papers` (relative URL, same origin)

### 5. Dependencies

#### Merged Dependencies

The `package.json` now combines:
- Backend dependencies: `neo4j-driver`, `compression`
- Frontend dependencies: `@mui/material`, `d3`, `react-virtuoso`, `zustand`
- Next.js: `next`, `react`, `react-dom`

#### Removed Dependencies

- `@nestjs/*` packages (replaced by Next.js API routes)
- `react-router-dom` (Next.js handles routing)
- `react-scripts` (replaced by Next.js build system)

### 6. TypeScript Configuration

Updated `tsconfig.json` for Next.js:
- Added `"moduleResolution": "bundler"`
- Added path alias `"@/*": ["./*"]`
- Updated `jsx` to `"preserve"` for Next.js

### 7. Build & Deployment

**Before:**
- Two separate builds: `backend/dist/` and `frontend/build/`
- Two separate Dockerfiles

**After:**
- Single build: `next build`
- Single Dockerfile (to be updated)

## Files to Update

### Still Needed:

1. **Dockerfile** - Update to use Next.js build
2. **Environment Variables** - Update deployment scripts
3. **Testing** - Update test configurations

## Testing the Migration

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` with Neo4j credentials:
   ```env
   DB_SCHEME=neo4j
   DB_HOST=localhost
   DB_PORT=7687
   DB_USERNAME=neo4j
   DB_PASSWORD=your-password
   DB_DATABASE=neo4j
   NEXT_PUBLIC_CONFIG_ID=MEDIUM
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Test the API:
   ```bash
   curl http://localhost:3000/api/papers
   ```

## Notes

- The original `backend/` and `frontend/` directories are preserved for reference
- All imports have been updated to use the `@/` alias
- The API route structure matches the original NestJS controller
- Client-side components are marked with `'use client'` directive

## Next Steps

1. Update Dockerfiles for Next.js
2. Test all functionality
3. Update CI/CD pipelines
4. Remove old `backend/` and `frontend/` directories after verification

