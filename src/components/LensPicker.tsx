import { useState, useMemo } from 'react';
import type { Lens } from '../types/lens';
import { parseFocalLength, formatFocalLength } from '../utils/focal';
import { parseAperture } from '../utils/astro';

type LensPickerProps = {
  lenses: Lens[];
  selectedLens: Lens | null;
  onLensChange: (lens: Lens | null) => void;
  loading?: boolean;
};

export const LensPicker: React.FC<LensPickerProps> = ({
  lenses,
  selectedLens,
  onLensChange,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLenses = useMemo(() => {
    if (!searchTerm) return lenses;
    
    const term = searchTerm.toLowerCase();
    return lenses.filter(lens => 
      lens.name?.toLowerCase().includes(term) ||
      lens.focal_length?.toLowerCase().includes(term) ||
      lens.maximum_aperture?.toLowerCase().includes(term)
    );
  }, [lenses, searchTerm]);

  const getLensDisplayName = (lens: Lens): string => {
    const parts = [] as string[];
    
    if (lens.name) {
      parts.push(lens.name);
    }
    
    if (lens.focal_length) {
      const parsed = parseFocalLength(lens.focal_length);
      if (parsed) {
        parts.push(formatFocalLength(parsed));
      } else {
        parts.push(lens.focal_length);
      }
    }
    
    if (lens.maximum_aperture) {
      const aperture = parseAperture(lens.maximum_aperture);
      if (aperture) {
        parts.push(`f/${aperture}`);
      } else {
        parts.push(lens.maximum_aperture);
      }
    }
    
    return parts.join(' ') || `Lens ${lens.id}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select Lens
        </label>
        
        <input
          type="text"
          placeholder="Search lenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
        
        <select
          value={selectedLens?.id || ''}
          onChange={(e) => {
            const lens = lenses.find(l => l.id.toString() === e.target.value) || null;
            onLensChange(lens);
          }}
          className="select-field"
          disabled={loading}
          size={8}
        >
          <option value="">Choose a lens...</option>
          {filteredLenses.map((lens) => (
            <option key={lens.id} value={lens.id}>
              {getLensDisplayName(lens)}
            </option>
          ))}
        </select>
        
        {loading && (
          <p className="text-sm text-gray-500">Loading lenses...</p>
        )}
        
        {!loading && filteredLenses.length === 0 && lenses.length > 0 && (
          <p className="text-sm text-gray-500">No lenses match your search.</p>
        )}
      </div>

      {selectedLens && (
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <h4 className="font-medium text-gray-900">Selected Lens</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Name:</strong> {selectedLens.name || 'N/A'}</p>
            <p><strong>Focal Length:</strong> {selectedLens.focal_length || 'N/A'}</p>
            <p><strong>Max Aperture:</strong> {selectedLens.maximum_aperture || 'N/A'}</p>
            {selectedLens.lens_mount && (
              <p><strong>Mount:</strong> {selectedLens.lens_mount}</p>
            )}
            {selectedLens.image_stabilization && (
              <p><strong>Image Stabilization:</strong> {selectedLens.image_stabilization}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 