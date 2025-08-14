# 🌟 500-Rule Astrophotography Calculator

A professional, full-stack web application for calculating optimal exposure times for astrophotography using multiple calculation methods including the 500-rule, NPF rule, and more. Features intelligent camera-lens compatibility matching, comprehensive equipment database, location-based weather conditions, and smart equipment suggestions.

![500-Rule Calculator](https://img.shields.io/badge/Version-2.4.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

## ✨ Features

### 🎯 Core Functionality
- **Multiple Calculation Methods**: 
  - Traditional 500/400/300/200 rules
  - NPF Rule for modern high-resolution sensors
  - Simplified 300-rule for quick field calculations
- **Smart Camera-Lens Matching**: Automatic compatibility detection based on mount types
- **Dual Interface**: Guided selection with equipment picker OR manual parameter input
- **Real-time Calculations**: Instant updates as you change parameters
- **Trail Risk Assessment**: Visual indicators for star trail probability
- **ISO Recommendations**: Smart ISO suggestions based on conditions

### 🔍 Advanced Search
- **Intelligent Filtering**: Search by brand, model, focal length, aperture
- **Substring Matching**: Find "12-24mm" when searching "12mm"
- **Number Recognition**: Search "Sony A6000" works with numbers
- **Aperture Search**: Find lenses by "f2.8" or "2.8"
- **Multi-word Support**: Full phrase matching with relevance scoring

### 📱 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Optimized for night use with astrophotographers
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Tooltips**: Hover explanations for rules and risk assessment
- **Tab Navigation**: Switch between guided and manual modes

### 🗄️ Comprehensive Database
- **265+ Equipment Items**: Expanded database with astrophotography-specific gear
- **122 Camera Bodies**: Canon, Sony, Nikon, Fujifilm, Olympus, Panasonic, Leica, Pentax, ZWO, QHYCCD, Hasselblad, OM System
- **143 Lenses**: First-party and third-party (Sigma Art, Tamron, Tokina, Zeiss, Laowa, Rokinon, Viltrox, Irix, Venus Optics)
- **Astro-Modified Cameras**: Canon Ra, 60Da and dedicated astronomy cameras
- **Fixed Lens Cameras**: X100 series, Leica Q2 with built-in lens specifications
- **Mount Compatibility**: Automatic lens filtering based on camera mount

### 🌍 Location & Weather Features (v2.2.0)
- **Location Picker**: 
  - Current GPS location detection
  - Search by city/landmark name
  - Manual coordinate input
  - Popular dark sky locations
- **Weather Conditions**: Real-time astronomy conditions
- **Moon Phase Tracking**: Current moon phase and illumination
- **Aurora Forecast**: KP index and visibility predictions

### 💡 Smart Features (v2.4.0)
- **AI-Powered Recommendations**: 
  - OpenAI integration for intelligent tips based on your exact setup
  - Context-aware suggestions considering camera, lens, location, and conditions
  - Equipment upgrade recommendations
  - Session planning assistance
- **Enhanced Location Features**:
  - Google Maps integration with pinpoint selection
  - Dark sky locations sorted by proximity
  - Interactive dark sky map overlay
- **Improved PWA Support**:
  - Offline functionality with smart caching
  - Install as native app on mobile/desktop
  - Background sync for API data
- **Settings Management**:
  - User API key configuration
  - Override system API keys
  - Dark mode and cache controls
- **Session Export**: Export your session plan as text, JSON, or calendar event
- **Pro Tips**: Context-aware tips and best practices

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm**
- **API Keys** (optional, app works without them but with limited features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xXxBeni123xXx/500rule.git
   cd 500rule
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional but recommended)
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys (see API Setup section below)
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🔑 API Setup Guide

The app works without API keys but you'll get enhanced features with them. Here's how to set up each one:

### 1. OpenWeatherMap API (Weather Conditions)
**Features**: Real-time weather, visibility, humidity, cloud cover

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to `.env.local`:
   ```
   OPENWEATHER_API_KEY=your_key_here
   ```

### 2. Google Maps API (Location Features)
**Features**: Interactive maps, place search, dark sky locations

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Add to `.env.local`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```

### 3. RapidAPI (Camera Database)
**Features**: Extended camera/lens database

1. Go to [RapidAPI](https://rapidapi.com/)
2. Subscribe to a camera database API
3. Get your API key
4. Add to `.env.local`:
   ```
   RAPIDAPI_KEY=your_key_here
   VITE_RAPIDAPI_KEY=your_key_here
   ```

### 4. Flickr API (Equipment Data)
**Features**: Real-world equipment usage statistics

1. Go to [Flickr API](https://www.flickr.com/services/api/)
2. Create an app
3. Get your API key
4. Add to `.env.local`:
   ```
   FLICKR_API_KEY=your_key_here
   ```

### 5. Unsplash API (Photo Metadata)
**Features**: Photography metadata analysis

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create an application
3. Get your access key
4. Add to `.env.local`:
   ```
   UNSPLASH_ACCESS_KEY=your_key_here
   ```

### Complete `.env.local` Example:
```env
# Frontend API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Backend Configuration
PORT=3001
RAPIDAPI_KEY=your_rapidapi_key_here

# External APIs
OPENWEATHER_API_KEY=your_openweather_key_here
FLICKR_API_KEY=your_flickr_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_key_here

# Security
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/
├── components/           # Reusable UI components
├── services/            # API communication layer
│   └── api.ts          # Backend API client
├── types/              # TypeScript type definitions
│   ├── camera.ts       # Camera interface definitions
│   └── lens.ts         # Lens interface definitions
├── utils/              # Utility functions
│   ├── astro.ts        # Astrophotography calculations
│   └── focal.ts        # Focal length parsing
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

### Backend (Node.js + Express)
```
backend/
├── data/               # Organized data files
│   ├── cameras.js      # Camera database
│   ├── lenses.js       # Lens database
│   └── mountCompatibility.js # Mount compatibility mapping
└── server.js           # Express server with API endpoints
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, ES6 modules
- **UI/UX**: Framer Motion, Lucide React icons
- **Data**: RapidAPI integration with robust fallback
- **Styling**: Modern glassmorphism design with dark theme

## 🔧 API Reference

### Backend Endpoints

#### Health Check
```http
GET /api/health
```
Returns server status and database counts.

#### Camera Operations
```http
GET /api/cameras
```
Get all available cameras.

#### Lens Operations
```http
GET /api/lenses?camera_id={id}
GET /api/lenses?brand={brand}
GET /api/lenses?mount={mount}
```
Get compatible lenses with optional filtering.

#### Compatibility Check
```http
GET /api/compatibility/{cameraId}
```
Get detailed compatibility information for a specific camera.

#### Brand Listing
```http
GET /api/brands
```
Get list of all available camera brands.

### Response Format
```json
{
  "success": true,
  "data": [...],
  "count": 150,
  "cached_at": "2024-01-15T10:30:00Z"
}
```

## 🧮 Astrophotography Calculations

### The 500 Rule
```
Max Shutter Speed (seconds) = Rule Constant ÷ (Focal Length × Crop Factor)
```

- **500 Rule**: Conservative approach, minimizes star trails
- **400 Rule**: Shorter exposures, better for longer focal lengths

### Examples
- **Full Frame + 50mm**: 500 ÷ (50 × 1.0) = 10 seconds
- **APS-C + 85mm**: 500 ÷ (85 × 1.5) = 3.9 seconds
- **Micro 4/3 + 25mm**: 500 ÷ (25 × 2.0) = 10 seconds

### Trail Risk Assessment
- **Low Risk**: Exposure time allows sharp star points
- **Medium Risk**: Slight elongation possible but acceptable
- **High Risk**: Visible star trails likely, use shorter exposure or star tracker

## 🎨 User Interface

### Guided Mode
1. **Select Camera**: Choose from comprehensive database
2. **Pick Lens**: Automatically filtered compatible lenses
3. **Adjust Settings**: Focal length slider for zoom lenses
4. **View Results**: Instant calculation with risk assessment

### Manual Mode
1. **Input Crop Factor**: Direct numeric input (0.1 - 10.0)
2. **Set Focal Length**: Manual focal length entry (1 - 2000mm)
3. **Choose Rule**: 500 or 400 rule selection
4. **See Calculation**: Real-time results display

### Advanced Features
- **Search Everything**: Intelligent search across brands, models, specifications
- **Fixed Lens Support**: Special handling for X100 series, Leica Q2
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## 🗃️ Database

### Camera Coverage
- **Canon**: R-series, EOS DSLRs (5D, 6D, 1D, 7D, Rebel series)
- **Sony**: α7 series, α9, APS-C (α6000 series, FX30)
- **Nikon**: Z-series, D-series DSLRs
- **Fujifilm**: X-series, GFX medium format, X100 fixed lens
- **Others**: Olympus, Panasonic, Leica, Pentax

### Lens Coverage
- **First-party**: Canon RF/EF, Sony FE/E, Nikon Z/F, Fujifilm X
- **Third-party**: Sigma Art, Tamron, Tokina, Zeiss, Laowa
- **Specialty**: Rokinon/Samyang, Viltrox, manual focus lenses
- **Mount Types**: All major mounts with compatibility mapping

## 🔄 Development

### Available Scripts
```bash
npm run dev          # Start both frontend and backend
npm run dev:frontend # Frontend only (Vite)
npm run dev:backend  # Backend only (Node.js)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint checking
```

### Code Structure Guidelines
- **Modular Design**: Separated data files for maintainability
- **Type Safety**: Full TypeScript coverage
- **Clean Architecture**: Clear separation of concerns
- **Performance**: Optimized rendering and API calls
- **Error Handling**: Graceful degradation and user feedback

### Adding New Equipment
1. **Cameras**: Add to `backend/data/cameras.js`
2. **Lenses**: Add to `backend/data/lenses.js`
3. **Mounts**: Update `backend/data/mountCompatibility.js`
4. **Restart**: Server automatically picks up changes

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open pull request**

### Equipment Contributions Welcome!
- Missing camera models
- New lens releases
- Third-party equipment
- Mount adapters and compatibility updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **RapidAPI Camera Database** for equipment specifications
- **Astrophotography Community** for 500-rule guidance
- **Open Source Libraries** that make this project possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/xXxBeni123xXx/500rule/issues)
- **Discussions**: [GitHub Discussions](https://github.com/xXxBeni123xXx/500rule/discussions)
- **Email**: Create an issue for support requests

---

**Made with ❤️ for the astrophotography community**

*Clear skies and sharp stars!* 🌌✨ 