import { ParsedFocalLength } from '../types/lens';

/**
 * Parse focal length string from API into structured format
 * Handles formats like: "14", "14mm", "24-70", "24–70mm", "10-20mm"
 */
export function parseFocalLength(focalString?: string): ParsedFocalLength | null {
  if (!focalString) return null;

  // Remove common suffixes and normalize
  const normalized = focalString
    .toLowerCase()
    .replace(/mm/g, '')
    .replace(/\s+/g, '')
    .trim();

  // Check for range (zoom) - handle both hyphen and en-dash
  const rangeMatch = normalized.match(/^(\d+(?:\.\d+)?)[–\-](\d+(?:\.\d+)?)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    if (!isNaN(min) && !isNaN(max) && min < max) {
      return {
        type: 'zoom',
        min,
        max,
      };
    }
  }

  // Check for single value (prime)
  const singleMatch = normalized.match(/^(\d+(?:\.\d+)?)$/);
  if (singleMatch) {
    const focal = parseFloat(singleMatch[1]);
    if (!isNaN(focal) && focal > 0) {
      return {
        type: 'prime',
        min: focal,
      };
    }
  }

  return null;
}

/**
 * Format focal length for display
 */
export function formatFocalLength(parsed: ParsedFocalLength): string {
  if (parsed.type === 'prime') {
    return `${parsed.min}mm`;
  }
  return `${parsed.min}-${parsed.max}mm`;
}

/**
 * Validate and clamp focal length within zoom range
 */
export function clampFocalLength(value: number, parsed: ParsedFocalLength): number {
  const min = parsed.min;
  const max = parsed.max || parsed.min;
  return Math.max(min, Math.min(max, value));
} 