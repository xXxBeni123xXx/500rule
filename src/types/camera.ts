export type Camera = {
  id?: number | string;
  brand?: string;
  name?: string;
  sensor_format?: string;      // e.g., "Full Frame", "APS-C"
  crop_factor?: number;        // if the API provides it
  // ...other fields that may come from API
};

export type CameraFormat = {
  name: string;
  cropFactor: number;
};

export const CAMERA_FORMATS: CameraFormat[] = [
  { name: "Full Frame", cropFactor: 1.0 },
  { name: "APS-C (Canon)", cropFactor: 1.6 },
  { name: "APS-C (Nikon/Sony/etc.)", cropFactor: 1.5 },
  { name: "Micro Four Thirds", cropFactor: 2.0 },
  { name: "1\"", cropFactor: 2.7 },
  { name: "Medium Format", cropFactor: 0.79 },
]; 