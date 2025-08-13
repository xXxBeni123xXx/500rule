# API Documentation

The 500-Rule Calculator provides a RESTful API for accessing camera and lens data, compatibility information, and calculations.

## Base URL
```
http://localhost:3001/api
```

## Authentication
No authentication required for the local development server.

## Response Format
All endpoints return JSON responses in the following format:

### Success Response
```json
{
  "success": true,
  "data": [...],
  "count": 150,
  "cached_at": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

## Endpoints

### Health Check

#### `GET /api/health`
Returns server status and database information.

**Response:**
```json
{
  "status": "ok",
  "cameras": 99,
  "lenses": 184,
  "cache_age": 45,
  "last_updated": "2024-01-15T10:30:00.000Z"
}
```

**Fields:**
- `status`: Server status ("ok")
- `cameras`: Number of cameras in database
- `lenses`: Number of lenses in database  
- `cache_age`: Minutes since last cache update
- `last_updated`: ISO timestamp of last cache update

---

### Cameras

#### `GET /api/cameras`
Retrieves all available cameras with full specifications.

**Query Parameters:**
- `brand` (string): Filter cameras by brand (e.g., `brand=Canon`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sony-a7-iv",
      "brand": "Sony",
      "name": "α7 IV",
      "mount": "Sony E",
      "sensor_format": "Full Frame",
      "crop_factor": 1.0,
      "megapixels": 33,
      "price_range": "Professional"
    }
  ],
  "count": 99,
  "cached_at": "2024-01-15T10:30:00.000Z"
}
```

**Camera Object Fields:**
- `id`: Unique identifier (string)
- `brand`: Manufacturer name (string)
- `name`: Camera model name (string)
- `mount`: Lens mount type (string)
- `sensor_format`: Sensor size category (string)
- `crop_factor`: Crop factor multiplier (number)
- `megapixels`: Sensor resolution (number)
- `price_range`: Target market segment (string)

**Possible Values:**
- `sensor_format`: "Full Frame", "APS-C", "Micro Four Thirds", "Medium Format"
- `price_range`: "Entry", "Enthusiast", "Professional"
- `mount`: See [Mount Types](#mount-types) section

---

### Lenses

#### `GET /api/lenses`
Retrieves all available lenses. Supports optional filtering.

**Query Parameters:**
- `camera_id` (string): Filter by compatible camera ID
- `brand` (string): Filter by lens manufacturer
- `mount` (string): Filter by mount type

**Examples:**
```http
GET /api/lenses
GET /api/lenses?camera_id=sony-a7-iv
GET /api/lenses?brand=Canon
GET /api/lenses?mount=Sony%20E
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sony-fe-24-70-f28-gm",
      "brand": "Sony",
      "name": "FE 24-70mm f/2.8 GM",
      "mount": "Sony E",
      "focal_length": "24-70",
      "max_aperture": "f/2.8",
      "type": "zoom",
      "category": "standard",
      "is_stabilized": true,
      "weight": 886
    }
  ],
  "count": 184,
  "cached_at": "2024-01-15T10:30:00.000Z"
}
```

**Lens Object Fields:**
- `id`: Unique identifier (string)
- `brand`: Manufacturer name (string)
- `name`: Full lens name with specifications (string)
- `mount`: Compatible mount type (string)
- `focal_length`: Focal length or range in mm (string)
- `max_aperture`: Widest aperture (string)
- `type`: Lens construction type (string)
- `category`: Use case category (string)
- `is_stabilized`: Has image stabilization (boolean)
- `weight`: Weight in grams (number)

**Possible Values:**
- `type`: "prime", "zoom", "adapter"
- `category`: "wide-angle", "standard", "telephoto", "portrait", "macro", "adapter"

---

### Brands

#### `GET /api/brands`
Returns unique brands for cameras and lenses.

**Response:**
```json
{
  "success": true,
  "data": {
    "cameras": ["Canon", "Fujifilm", "Leica", "Nikon", "Olympus", "Panasonic", "Pentax", "Sony"],
    "lenses": ["Canon", "Fujifilm", "Leica", "Nikon", "Panasonic", "Sigma", "Sony", "Tamron", "Tokina", "Viltrox", "Zeiss", "Rokinon", "Samyang", "Laowa"],
    "all": ["Canon", "Fujifilm", "Laowa", "Leica", "Nikon", "Olympus", "Panasonic", "Pentax", "Rokinon", "Samyang", "Sigma", "Sony", "Tamron", "Tokina", "Viltrox", "Zeiss"]
  },
  "count": 16
}
```

---

### Compatibility

#### `GET /api/compatibility/{cameraId}`
Get detailed compatibility information for a specific camera.

**Path Parameters:**
- `cameraId`: Unique camera identifier

**Example:**
```http
GET /api/compatibility/sony-a7-iv
```

**Response:**
```json
{
  "success": true,
  "camera": {
    "id": "sony-a7-iv",
    "brand": "Sony",
    "name": "α7 IV",
    "mount": "Sony E",
    "sensor_format": "Full Frame",
    "crop_factor": 1.0,
    "megapixels": 33,
    "price_range": "Professional"
  },
  "compatible_lenses": [
    {
      "id": "sony-fe-24-70-f28-gm",
      "brand": "Sony",
      "name": "FE 24-70mm f/2.8 GM",
      "mount": "Sony E",
      "focal_length": "24-70",
      "max_aperture": "f/2.8",
      "type": "zoom",
      "category": "standard",
      "is_stabilized": true,
      "weight": 886
    }
  ],
  "count": 1,
  "mount_info": {
    "mount": "Sony E",
    "compatible_mounts": ["Sony E", "Sony FE"]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Camera not found"
}
```

---

## Mount Types

The following mount types are supported:

### Canon
- `Canon RF`: Canon mirrorless full-frame/APS-C
- `Canon EF`: Canon DSLR full-frame/APS-C

### Sony
- `Sony E`: Sony mirrorless (covers both FE and E lenses)

### Nikon  
- `Nikon Z`: Nikon mirrorless
- `Nikon F`: Nikon DSLR

### Fujifilm
- `Fujifilm X`: Fujifilm APS-C mirrorless
- `Fujifilm G`: Fujifilm medium format

### Others
- `Micro Four Thirds`: Olympus/Panasonic
- `Leica L`: Leica SL system
- `Pentax K`: Pentax DSLR
- `Fixed Lens (23mm f/2)`: Fujifilm X100 series
- `Fixed Lens (28mm f/1.7)`: Leica Q2

---

## Error Codes

### HTTP Status Codes
- `200`: Success
- `404`: Resource not found
- `500`: Internal server error

### Common Errors
- `"Camera not found"`: Invalid camera ID in compatibility endpoint
- `"API Error: [details]"`: RapidAPI service issues
- `"Network Error"`: Connection problems

---

## Rate Limiting
No rate limiting on local development server. Production deployments should implement appropriate rate limiting.

---

## Data Freshness
- **Cache Duration**: 24 hours
- **Auto-refresh**: Cache automatically refreshes when expired
- **Fallback**: Uses local database if API unavailable
- **Status**: Check `/api/health` for cache age

---

## Development Notes

### Adding Equipment
To add new cameras or lenses, edit the data files:
- **Cameras**: `backend/data/cameras.js`
- **Lenses**: `backend/data/lenses.js`  
- **Mounts**: `backend/data/mountCompatibility.js`

### API Integration
The backend integrates with RapidAPI Camera Database but falls back to local data if unavailable. This ensures reliability while providing fresh data when possible.

### Search Implementation
The frontend implements advanced search on the client side after fetching all data. This provides instant results without additional API calls. 