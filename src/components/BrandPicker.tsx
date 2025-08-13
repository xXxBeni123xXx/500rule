type BrandPickerProps = {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  loading?: boolean;
};

export const BrandPicker: React.FC<BrandPickerProps> = ({
  brands,
  selectedBrand,
  onBrandChange,
  loading = false
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Brand
      </label>
      <select
        value={selectedBrand}
        onChange={(e) => onBrandChange(e.target.value)}
        className="select-field"
        disabled={loading}
      >
        <option value="">Choose a brand...</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand.charAt(0).toUpperCase() + brand.slice(1)}
          </option>
        ))}
      </select>
      {loading && (
        <p className="text-sm text-gray-500">Loading brands...</p>
      )}
    </div>
  );
}; 