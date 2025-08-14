# Changelog

All notable changes to the 500-Rule Astrophotography Calculator project.

## [2.4.0] - 2024-01-16

### 🚀 Major Features

#### AI Integration
- **OpenAI Integration**: Smart tips and recommendations powered by GPT
- **Context-Aware Suggestions**: AI analyzes your exact camera, lens, location, and conditions
- **Equipment Recommendations**: Intelligent upgrade suggestions based on your needs
- **Session Planning**: AI-powered photography session planning
- **Image Analysis**: Future support for analyzing your astrophotography images

#### Enhanced Location System
- **Google Maps Integration**: Full map with pinpoint selection capability
- **Dark Sky Map**: Interactive overlay showing light pollution levels
- **Location Sorting**: Dark sky locations automatically sorted by proximity
- **Expanded Database**: 24+ dark sky locations worldwide
- **Future Date/Time**: Plan sessions with specific date/time selection

#### Equipment Database Expansion
- **265+ Total Items**: Massive expansion from 209 to 265 pieces of equipment
- **122 Cameras**: Added ZWO, QHYCCD astronomy cameras, latest mirrorless models
- **143 Lenses**: Added Sigma Art, Irix, Venus Optics, and more astro-specific glass
- **Astro-Modified**: Canon Ra, 60Da, and dedicated astronomy cameras included

#### PWA & Offline Support
- **Enhanced Service Worker**: Smart caching strategies for offline use
- **Install as App**: Full PWA support for mobile and desktop installation
- **Background Sync**: API data syncs when connection restored
- **Offline Mode**: Core functionality works without internet

#### Settings & Security
- **API Key Management**: Users can add their own API keys
- **Secure Storage**: API keys stored locally, never sent to servers
- **Override Options**: Override system API keys with personal ones
- **Configuration Status**: Visual indicators for API availability

### 🎯 Improvements & Fixes

#### UI Enhancements
- **Version Display**: Simplified to show only version number
- **App Icon**: Custom astrophotography-themed icon
- **Browser Tab**: Updated title and description
- **Dynamic Updates**: Formula and aperture update automatically
- **Mobile Optimization**: Improved responsive design

#### Smart Tips System
- **AI-Powered Tips**: OpenAI generates tips specific to your setup
- **Dynamic Recommendations**: Tips change based on all parameters
- **Best Practices**: Context-aware shooting strategies
- **Quick Reference**: Handy reference for settings

#### Bug Fixes
- **WebSocket Errors**: Fixed connection issues
- **Service Worker**: Fixed chrome-extension request errors
- **PWA Manifest**: Updated with proper icons
- **Dark Sky Map**: Re-enabled with Google Maps support
- **Astrophotography Conditions**: Fixed functionality issues
- **Icon Loading**: Resolved manifest icon loading issues

### 🔧 Technical Improvements
- **Cleaner Code**: Removed unnecessary components
- **Better Error Handling**: Improved service worker error handling
- **Performance**: Optimized location calculations

## [2.3.0] - 2024-01-16

### 🎯 Major Improvements

#### Dynamic Formula Display
- **Live Formula Updates**: Formula display changes based on selected calculation method
- **NPF Formula**: Shows full NPF calculation with pixel pitch
- **Simplified Formula**: Shows 300-rule calculation
- **Auto-Aperture**: Aperture automatically updates when changing lenses

#### Enhanced Settings Panel
- **API Key Management**: 
  - User can override built-in API keys
  - Visual status indicators for each API
  - Secure key storage in localStorage
  - Hide/show toggle for sensitive data
- **General Settings**:
  - Dark mode toggle
  - Auto-location detection toggle
  - Cache control settings

#### Location Features Enhanced
- **Sorted Dark Sky Locations**: Popular locations now sorted by distance from user
- **Distance Display**: Shows distance in km for each dark sky location
- **Date/Time Picker**: Select future dates/times for condition forecasts (up to 7 days)
- **Better Location Search**: Improved OpenStreetMap integration

#### Progressive Web App (PWA)
- **Offline Support**: App works without internet connection
- **Installable**: Can be installed on desktop and mobile devices
- **Service Worker**: Caches resources for offline use
- **App Manifest**: Full PWA compliance with icons and metadata

#### Mobile Optimizations
- **Responsive Design**: Better layout on small screens
- **Touch Targets**: Minimum 44px touch targets for accessibility
- **Viewport Settings**: Optimized for mobile browsers
- **Grid Stacking**: Columns stack on mobile devices

### 🔧 Technical Improvements
- **Version Display**: Shows v2.3.0 in UI header
- **API Integration**: Built-in API keys for immediate functionality
- **Error Handling**: Better API failure management
- **Performance**: Optimized calculations and rendering

### 🐛 Bug Fixes
- Fixed formula display not updating with rule changes
- Fixed aperture not updating when lens changes
- Fixed location sorting issues
- Improved mobile viewport settings

## [2.2.0] - 2024-01-16

### 🎯 New Features

#### Enhanced Exposure Rules
- **Multiple Rule Types**: Added support for Simple (500/400/300/200), NPF, and Simplified rules
- **NPF Rule Calculator**: Most accurate for modern high-resolution sensors
  - Accounts for aperture, pixel pitch, and declination
  - Automatic pixel pitch calculation from sensor specs
- **Rule Type Selector**: Easy switching between calculation methods
- **200 and 300 Rules**: Added for telephoto and conservative calculations

#### Location Features
- **Simple Location Picker**: No Google Maps dependency required
  - Current GPS location detection
  - Search by city/landmark using OpenStreetMap
  - Manual coordinate input
  - Popular dark sky locations preset
- **Dark Sky Map** (with Google Maps API):
  - Interactive map with best observation locations
  - Light pollution overlay
  - Distance calculations from user location

#### Smart Equipment Suggestions
- **Context-Aware Recommendations**:
  - Camera upgrade suggestions based on current setup
  - Lens recommendations for astrophotography
  - Essential accessories (star trackers, filters, etc.)
  - Price and rating information
- **Pro Tips**: Contextual advice for better results

#### UI/UX Improvements
- **Version Display**: Shows current version in header
- **Better Organization**: Improved layout with feature sections
- **Enhanced Tooltips**: More detailed explanations for all rules
- **Responsive Grid**: Better mobile and tablet experience

### 🔧 Technical Improvements
- **Modular Components**: Separated location and suggestion features
- **TypeScript Enhancements**: Better type safety throughout
- **API Flexibility**: Works without Google Maps API
- **Performance**: Optimized calculations and rendering

### 📝 Documentation
- **Comprehensive API Setup Guide**: Step-by-step for all APIs
- **Updated README**: Complete feature list and setup instructions
- **Version Tracking**: Proper semantic versioning

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