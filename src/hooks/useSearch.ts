import { useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

export function useSearch() {
  const { state } = useAppContext();

  // Memoized camera filtering
  const filteredCameras = useMemo(() => {
    if (!state.cameraSearchTerm) return state.allCameras;
    
    const searchLower = state.cameraSearchTerm.toLowerCase().trim();
    
    return state.allCameras.filter(camera => {
      // Create comprehensive searchable text
      const searchableText = [
        camera.brand,
        camera.name,
        camera.sensor_format,
        `${camera.brand} ${camera.name}`,
        camera.id.replace(/-/g, ' '), // Convert IDs like "sony-a6000" to "sony a6000"
      ].join(' ').toLowerCase();
      
      // Extract numbers from search term for special handling
      const searchNumbers = searchLower.match(/\d+/g) || [];
      const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
      
      // Check direct substring match (fastest)
      if (searchableText.includes(searchLower)) return true;
      
      // Check if all words are found
      const allWordsFound = searchWords.every(word => searchableText.includes(word));
      
      // Special handling for model numbers (e.g., "a6000", "6000")
      const modelNumberMatches = searchNumbers.some(num => {
        return searchableText.includes(num) || 
               searchableText.includes(`a${num}`) || 
               searchableText.includes(`α${num}`);
      });
      
      return allWordsFound || modelNumberMatches;
    });
  }, [state.allCameras, state.cameraSearchTerm]);

  // Memoized lens filtering
  const filteredLenses = useMemo(() => {
    if (!state.lensSearchTerm) return state.allCompatibleLenses;
    
    const searchLower = state.lensSearchTerm.toLowerCase().trim();
    
    return state.allCompatibleLenses.filter(lens => {
      // Create comprehensive searchable text
      const searchableText = [
        lens.brand,
        lens.name,
        lens.focal_length,
        lens.max_aperture,
        lens.category,
        `${lens.brand} ${lens.name}`,
        lens.id.replace(/-/g, ' '),
      ].join(' ').toLowerCase();
      
      // Extract numbers from search (for focal length matching)
      const searchNumbers = searchLower.match(/\d+/g) || [];
      const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
      
      // Check direct substring match
      if (searchableText.includes(searchLower)) return true;
      
      // Check if all words are found
      const allWordsFound = searchWords.every(word => searchableText.includes(word));
      
      // Special focal length matching (e.g., "12mm" should match "12-24mm")
      const focalLengthMatches = searchNumbers.some(num => {
        const numStr = num.toString();
        // Check if the number appears in focal length ranges
        return lens.focal_length?.includes(numStr) ||
               lens.focal_length?.includes(`${numStr}-`) ||
               lens.focal_length?.includes(`-${numStr}`) ||
               searchableText.includes(`${numStr}mm`);
      });
      
      // Aperture matching (e.g., "f2.8", "2.8")
      const apertureMatches = searchWords.some(word => {
        if (word.startsWith('f')) {
          const aperture = word.substring(1);
          return lens.max_aperture?.includes(aperture);
        }
        if (word.match(/^\d+(\.\d+)?$/)) {
          return lens.max_aperture?.includes(`f/${word}`) || lens.max_aperture?.includes(`f${word}`);
        }
        return false;
      });
      
      return allWordsFound || focalLengthMatches || apertureMatches;
    });
  }, [state.allCompatibleLenses, state.lensSearchTerm]);

  return {
    filteredCameras,
    filteredLenses,
  };
}