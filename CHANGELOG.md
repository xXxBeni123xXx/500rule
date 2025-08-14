# Changelog

All notable changes to the 500-Rule Astrophotography Calculator project.

## [2.1.0] - 2024-01-15

### 🎯 Fixed
- **CI/CD Pipeline**: Fixed all CI issues including:
  - Added missing `jsdom` dependency for testing environment
  - Fixed TypeScript configuration to include `vitest.config.ts`
  - Resolved all TypeScript `any` type warnings with proper type definitions
  - Fixed ESLint regex escape character issue
  - All tests now passing successfully (22 tests)

### 🌟 New Features

#### Advanced Astrophotography Rules
- **NPF Rule Calculator**: More accurate for modern high-resolution sensors
  - Accounts for aperture, pixel pitch, and declination
  - Formula: `NPF = (35 × aperture + 30 × pixel pitch) ÷ focal length`
  - Includes declination correction for celestial pole proximity
- **Simplified Rule (300-Rule)**: Quick field calculations for conservative exposures
- **Pixel Pitch Calculator**: Automatically calculates pixel pitch from sensor dimensions and megapixels
- **ISO Recommendations**: Intelligent ISO suggestions based on:
  - Sky brightness conditions (dark/suburban/urban)
  - Aperture settings
  - Shutter speed
  - Returns nearest common ISO values

#### External API Integrations
- **Weather API Integration**: Real-time weather conditions for astrophotography
  - Cloud cover percentage
  - Visibility in kilometers
  - Humidity levels
  - Wind speed
  - Temperature
  - Sunrise/sunset times
- **Moon Phase Calculator**: Built-in moon phase calculation
  - Current phase name
  - Illumination percentage
  - Phase value for precise tracking
- **Aurora Forecast**: NOAA space weather integration
  - KP index (0-9 scale)
  - Visibility predictions
  - Minimum latitude for aurora visibility
- **Equipment Suggestions**: Aggregates data from multiple sources
  - Flickr EXIF data analysis (requires API key)
  - Unsplash photography metadata
  - Popular camera/lens combination recommendations

#### UI Components
- **AstroConditions Component**: Comprehensive conditions dashboard
  - Overall conditions score (0-100%)
  - Weather card with detailed metrics
  - Moon phase visualization
  - Aurora forecast display
  - Smart recommendations based on conditions
  - Location-based services with geolocation support
- **SessionExport Component**: Export functionality for session planning
  - Text file export with complete session details
  - JSON data export for programmatic use
  - Calendar event (.ics) generation
  - Native share functionality with clipboard fallback

### 🔧 Technical Improvements

#### Backend Enhancements
- **New API Endpoints**:
  - `/api/weather` - Weather conditions with lat/lon parameters
  - `/api/moon-phase` - Moon phase calculation with optional date
  - `/api/aurora-forecast` - Real-time aurora predictions
  - `/api/equipment-suggestions` - Equipment recommendations from aggregated data
- **External API Service**: Modular service architecture for external integrations
  - Flickr API integration for EXIF data
  - Unsplash API for photography metadata
  - OpenWeather API for weather conditions
  - NOAA API for space weather

#### Code Quality
- **Type Safety**: Eliminated all TypeScript `any` types
- **Test Coverage**: Comprehensive test suite for all calculation functions
- **Linting**: Fixed all ESLint issues and warnings
- **Generic Hooks**: Improved `useApi` hook with proper TypeScript generics

### 📦 Dependencies
- Added `jsdom` for testing environment
- All existing dependencies remain compatible

### 🔐 Environment Variables
New optional environment variables for external APIs:
- `FLICKR_API_KEY` - For Flickr EXIF data access
- `UNSPLASH_ACCESS_KEY` - For Unsplash photo metadata
- `OPENWEATHER_API_KEY` - For weather conditions

### 🚀 Performance
- Backend caching system remains intact
- Parallel API calls using `Promise.allSettled` for resilience
- Graceful degradation when external APIs unavailable

### 📝 Documentation
- Updated `env.example` with new API keys
- Comprehensive JSDoc comments for new functions
- Type definitions for all new interfaces

## Future Recommendations

### High Priority
1. **User Authentication System**: Save equipment profiles and session history
2. **Dark Sky Location Database**: Integration with light pollution maps
3. **Advanced Planning Tools**: Multi-night session planning with weather forecasts
4. **Mobile App**: React Native version for field use

### Medium Priority
1. **Community Features**: Share session plans and photos
2. **Equipment Reviews**: User-submitted reviews and ratings
3. **Tutorial System**: Interactive guides for beginners
4. **Notification System**: Alerts for optimal conditions

### Low Priority
1. **AR Features**: Augmented reality star map overlay
2. **AI Recommendations**: Machine learning for personalized suggestions
3. **Social Integration**: Instagram/Flickr photo sharing
4. **Marketplace**: Buy/sell used equipment

## Testing Instructions

```bash
# Run all tests
npm test

# Run linter
npm run lint

# Run type checking
npm run typecheck

# Start development server
npm run dev
```

## Migration Notes
- No breaking changes
- All new features are opt-in
- External API keys are optional (features degrade gracefully)

---

*Clear skies and sharp stars!* 🌌✨