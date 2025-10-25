# AI Agent Instructions for Trihp

This guide provides essential context for AI agents working with the Trihp codebase.

## Project Architecture

### Frontend (Expo App)
- Built with Expo + React Native using file-based routing
- Main app code in `/app` directory with nested route structure
- Key components in `/components` with reusable UI elements
- State management in `/store` directory

### Backend (NestJS)
- NestJS-based API with modular architecture in `trihp-backend-system`
- Core modules in `src/core/` handle auth, pricing, and user management
- Features in `src/features/` include ride-request and communication services
- Uses PostgreSQL for persistence and Redis for caching

## Key Integration Points

1. **Ride Request Flow**
   - Frontend: `api/rideRequestAPI.js` contains API integration
   - Backend: `src/features/ride-request/` handles matching and pricing
   - See `PRICING_INTEGRATION.md` for pricing calculation details

2. **Authentication**
   - JWT-based auth implemented in `src/core/auth/`
   - Protected routes use auth guards from `src/shared/guards/`

## Development Workflow

### Frontend
```bash
npm install        # Install dependencies
npx expo start     # Start development server
```

### Backend
```bash
# Windows
.\setup.ps1       # First-time setup
npm run start:dev # Development mode

# Linux/macOS
./setup.sh
npm run start:dev
```

## Project-Specific Patterns

1. **API Integration**
   - All API calls centralized in `api/` directory
   - Use `services.js` for shared API configuration

2. **Component Structure**
   - Reusable components in `components/`
   - Modal components separated in `components/Modals/`
   - Screen-specific components stay with their routes

3. **Environment Configuration**
   - Frontend: Uses `app.json` for Expo config
   - Backend: Configuration in `src/infrastructure/config/`

## Common Operations

1. **Adding New Routes**
   - Create new file in `app/` using file-based routing convention
   - For protected routes, place under `app/(auth)/`

2. **Backend Module Addition**
   - Create module in appropriate directory (`core/` or `features/`)
   - Follow NestJS module structure with controller, service, and DTOs
   - Register in relevant parent module