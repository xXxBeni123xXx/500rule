# 🌟 500-Rule Astrophotography Calculator

A professional, full-stack web application for calculating optimal exposure times for astrophotography using the 500-rule and 400-rule methods. Features intelligent camera-lens compatibility matching, comprehensive equipment database, and advanced search capabilities.

![500-Rule Calculator](https://img.shields.io/badge/Version-2.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

## ✨ Features

### 🎯 Core Functionality
- **500/400 Rule Calculations**: Precise exposure time calculations to prevent star trails
- **Smart Camera-Lens Matching**: Automatic compatibility detection based on mount types
- **Dual Interface**: Guided selection with equipment picker OR manual parameter input
- **Real-time Calculations**: Instant updates as you change parameters
- **Trail Risk Assessment**: Visual indicators for star trail probability

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
- **150+ Camera Bodies**: Canon, Sony, Nikon, Fujifilm, Olympus, Panasonic, Leica, Pentax
- **200+ Lenses**: First-party and third-party (Sigma, Tamron, Tokina, Zeiss, Laowa, Rokinon, Viltrox)
- **Fixed Lens Cameras**: X100 series, Leica Q2 with built-in lens specifications
- **Mount Compatibility**: Automatic lens filtering based on camera mount

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm**
- **RapidAPI Key** (optional, app works with fallback data)

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

3. **Set up environment variables** (optional)
   ```bash
   cp env.example .env.local
   # Edit .env.local with your RapidAPI key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

Note: The frontend dev server proxies `/api` requests to the backend to avoid CORS during development.

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
GET /api/cameras?brand=Canon
```
Get all available cameras, optionally filtered by brand.

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
Get unique brands for cameras and lenses. Returns `{ cameras, lenses, all }`.

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
npm run dev          # Start both frontend and backend (backend with nodemon)
npm run dev:frontend # Frontend only (Vite)
npm run dev:backend  # Backend only (Nodemon)
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
5. **Open pull request`

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