export type Lens = {
  id: number;
  brand?: string;
  name?: string;
  lens_mount?: string;
  focal_length?: string;       // raw string from API
  maximum_aperture?: string;
  max_format_size?: string;
  image_stabilization?: string;
  weight?: string;
  zoom_lock?: boolean;
  aperture_ring?: boolean;
  autofocus?: boolean;
  // ...other fields that may come from the API
};

export type LensApiResponse = {
  items: Lens[];
  page: number;
  page_size: number;
  max_page: number;
};

export type ParsedFocalLength = {
  type: 'prime' | 'zoom';
  min: number;
  max?: number;
}; 