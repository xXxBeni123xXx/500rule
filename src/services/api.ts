import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface Camera {
  id: string;
  brand: string;
  name: string;
  mount: string;
  sensor_format: string;
  crop_factor: number;
  megapixels?: number;
  price_range?: string;
}

export interface Lens {
  id: string;
  brand: string;
  name: string;
  mount: string;
  focal_length: string;
  max_aperture: string;
  type: 'prime' | 'zoom';
  category: 'wide-angle' | 'standard' | 'telephoto' | 'portrait';
  is_stabilized?: boolean;
  weight?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  cached_at?: string;
  error?: string;
}

export interface CompatibilityResponse {
  success: boolean;
  camera: Camera;
  compatible_lenses: Lens[];
  count: number;
  error?: string;
}

// Fetch all cameras or filter by brand
export async function fetchCameras(brand?: string): Promise<Camera[]> {
  try {
    const params = brand ? { brand } : {};
    const response = await api.get<ApiResponse<Camera[]>>('/cameras', { params });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch cameras');
  } catch (error) {
    console.error('Error fetching cameras:', error);
    throw error;
  }
}

// Fetch compatible lenses for a specific camera
export async function fetchCompatibleLenses(cameraId: string): Promise<Lens[]> {
  try {
    const response = await api.get<ApiResponse<Lens[]>>('/lenses', {
      params: { camera_id: cameraId }
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch lenses');
  } catch (error) {
    console.error('Error fetching lenses:', error);
    throw error;
  }
}

// Get detailed compatibility information
export async function getCompatibilityInfo(cameraId: string): Promise<CompatibilityResponse> {
  try {
    const response = await api.get<CompatibilityResponse>(`/compatibility/${cameraId}`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.error || 'Failed to fetch compatibility info');
  } catch (error) {
    console.error('Error fetching compatibility:', error);
    throw error;
  }
}

// Fetch available brands
export async function fetchBrands(): Promise<{ cameras: string[]; lenses: string[]; all: string[] }> {
  try {
    const response = await api.get<ApiResponse<{ cameras: string[]; lenses: string[]; all: string[] }>>('/brands');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to fetch brands');
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
}

// Health check
interface HealthResponse {
  status: string;
  message: string;
  database?: {
    cameras: number;
    lenses: number;
  };
}

export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
} 