import axios from 'axios';
import { LensApiResponse, Lens } from '../types/lens';
import { Camera } from '../types/camera';
import { logger } from '../utils/logger';

const api = axios.create({
  baseURL: 'https://camera-database.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
    'x-rapidapi-host': 'camera-database.p.rapidapi.com',
  },
});

export type FetchLensesParams = {
  brand?: string;
  aperture_ring?: boolean;
  autofocus?: boolean;
  page?: number;
  page_size?: number;
};

// Fallback lens data for when API is unavailable
const FALLBACK_LENSES: Lens[] = [
  { id: 1, brand: 'canon', name: 'EF 16-35mm f/2.8L III USM', focal_length: '16-35', maximum_aperture: 'f/2.8', lens_mount: 'Canon EF' },
  { id: 2, brand: 'canon', name: 'EF 24-70mm f/2.8L II USM', focal_length: '24-70', maximum_aperture: 'f/2.8', lens_mount: 'Canon EF' },
  { id: 3, brand: 'canon', name: 'EF 70-200mm f/2.8L IS III USM', focal_length: '70-200', maximum_aperture: 'f/2.8', lens_mount: 'Canon EF' },
  { id: 4, brand: 'canon', name: 'EF 50mm f/1.8 STM', focal_length: '50', maximum_aperture: 'f/1.8', lens_mount: 'Canon EF' },
  { id: 5, brand: 'canon', name: 'EF 85mm f/1.8 USM', focal_length: '85', maximum_aperture: 'f/1.8', lens_mount: 'Canon EF' },
  
  { id: 6, brand: 'nikon', name: 'AF-S NIKKOR 14-24mm f/2.8G ED', focal_length: '14-24', maximum_aperture: 'f/2.8', lens_mount: 'Nikon F' },
  { id: 7, brand: 'nikon', name: 'AF-S NIKKOR 24-70mm f/2.8E ED VR', focal_length: '24-70', maximum_aperture: 'f/2.8', lens_mount: 'Nikon F' },
  { id: 8, brand: 'nikon', name: 'AF-S NIKKOR 70-200mm f/2.8E FL ED VR', focal_length: '70-200', maximum_aperture: 'f/2.8', lens_mount: 'Nikon F' },
  { id: 9, brand: 'nikon', name: 'AF-S NIKKOR 50mm f/1.8G', focal_length: '50', maximum_aperture: 'f/1.8', lens_mount: 'Nikon F' },
  { id: 10, brand: 'nikon', name: 'AF-S NIKKOR 85mm f/1.8G', focal_length: '85', maximum_aperture: 'f/1.8', lens_mount: 'Nikon F' },
  
  { id: 11, brand: 'sony', name: 'FE 16-35mm f/2.8 GM', focal_length: '16-35', maximum_aperture: 'f/2.8', lens_mount: 'Sony E' },
  { id: 12, brand: 'sony', name: 'FE 24-70mm f/2.8 GM', focal_length: '24-70', maximum_aperture: 'f/2.8', lens_mount: 'Sony E' },
  { id: 13, brand: 'sony', name: 'FE 70-200mm f/2.8 GM OSS', focal_length: '70-200', maximum_aperture: 'f/2.8', lens_mount: 'Sony E' },
  { id: 14, brand: 'sony', name: 'FE 50mm f/1.8', focal_length: '50', maximum_aperture: 'f/1.8', lens_mount: 'Sony E' },
  { id: 15, brand: 'sony', name: 'FE 85mm f/1.8', focal_length: '85', maximum_aperture: 'f/1.8', lens_mount: 'Sony E' },
  
  { id: 16, brand: 'fujifilm', name: 'XF 10-24mm f/4 R OIS', focal_length: '10-24', maximum_aperture: 'f/4', lens_mount: 'Fujifilm X' },
  { id: 17, brand: 'fujifilm', name: 'XF 16-55mm f/2.8 R LM WR', focal_length: '16-55', maximum_aperture: 'f/2.8', lens_mount: 'Fujifilm X' },
  { id: 18, brand: 'fujifilm', name: 'XF 50-140mm f/2.8 R LM OIS WR', focal_length: '50-140', maximum_aperture: 'f/2.8', lens_mount: 'Fujifilm X' },
  { id: 19, brand: 'fujifilm', name: 'XF 35mm f/1.4 R', focal_length: '35', maximum_aperture: 'f/1.4', lens_mount: 'Fujifilm X' },
  { id: 20, brand: 'fujifilm', name: 'XF 56mm f/1.2 R', focal_length: '56', maximum_aperture: 'f/1.2', lens_mount: 'Fujifilm X' },
];

/**
 * Fetch lenses from the API with fallback to sample data
 */
export async function fetchLenses(params: FetchLensesParams = {}): Promise<LensApiResponse> {
  try {
    const defaultParams = {
      page: 1,
      page_size: 50,
    };

    const response = await api.get('/lenses', {
      params: { ...defaultParams, ...params },
    });

    return response.data;
  } catch (error) {
    logger.warn('API unavailable, using fallback lens data:', error);
    
    // Filter fallback data by brand if specified
    let filteredLenses = FALLBACK_LENSES;
    if (params.brand) {
      filteredLenses = FALLBACK_LENSES.filter(lens => 
        lens.brand?.toLowerCase() === params.brand?.toLowerCase()
      );
    }

    return {
      items: filteredLenses,
      page: 1,
      page_size: filteredLenses.length,
      max_page: 1
    };
  }
}

/**
 * Fetch cameras from the API (if endpoint exists)
 * This will attempt to fetch cameras; if it fails, we'll fall back to manual format selection
 */
export async function fetchCameras(params: { brand?: string; page?: number; page_size?: number } = {}): Promise<{ items: Camera[]; page: number; page_size: number; max_page: number } | null> {
  try {
    const defaultParams = {
      page: 1,
      page_size: 50,
    };

    const response = await api.get('/cameras', {
      params: { ...defaultParams, ...params },
    });

    return response.data;
  } catch (error) {
    // If cameras endpoint doesn't exist, return null
    logger.warn('Cameras endpoint not available, falling back to manual format selection');
    return null;
  }
}

/**
 * Get unique brands from lens data
 */
export function getUniqueBrands(lenses: Lens[]): string[] {
  const brands = new Set<string>();
  
  lenses.forEach(lens => {
    if (lens.brand) {
      brands.add(lens.brand);
    }
  });

  return Array.from(brands).sort();
}

/**
 * Check if API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return !!import.meta.env.VITE_RAPIDAPI_KEY;
} 