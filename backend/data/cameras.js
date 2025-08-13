// Camera database with comprehensive collection
export const CAMERA_DATABASE = [
  // Canon Full Frame
  { id: 'canon-r5', brand: 'Canon', name: 'EOS R5', mount: 'Canon RF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 45, price_range: 'Professional' },
  { id: 'canon-r6-ii', brand: 'Canon', name: 'EOS R6 Mark II', mount: 'Canon RF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Professional' },
  { id: 'canon-r8', brand: 'Canon', name: 'EOS R8', mount: 'Canon RF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'canon-rp', brand: 'Canon', name: 'EOS RP', mount: 'Canon RF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 26, price_range: 'Entry' },
  { id: 'canon-5d-iv', brand: 'Canon', name: 'EOS 5D Mark IV', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 30, price_range: 'Professional' },
  { id: 'canon-6d-ii', brand: 'Canon', name: 'EOS 6D Mark II', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 26, price_range: 'Enthusiast' },
  { id: 'canon-1dx-iii', brand: 'Canon', name: 'EOS-1D X Mark III', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 20, price_range: 'Professional' },
  { id: 'canon-1dx-ii', brand: 'Canon', name: 'EOS-1D X Mark II', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 20, price_range: 'Professional' },
  { id: 'canon-5ds-r', brand: 'Canon', name: 'EOS 5DS R', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 50, price_range: 'Professional' },
  { id: 'canon-5ds', brand: 'Canon', name: 'EOS 5DS', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 50, price_range: 'Professional' },
  { id: 'canon-5d-iii', brand: 'Canon', name: 'EOS 5D Mark III', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 22, price_range: 'Professional' },
  { id: 'canon-5d-ii', brand: 'Canon', name: 'EOS 5D Mark II', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 21, price_range: 'Professional' },
  { id: 'canon-6d', brand: 'Canon', name: 'EOS 6D', mount: 'Canon EF', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 20, price_range: 'Enthusiast' },
  
  // Canon APS-C
  { id: 'canon-r7', brand: 'Canon', name: 'EOS R7', mount: 'Canon RF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 33, price_range: 'Enthusiast' },
  { id: 'canon-r10', brand: 'Canon', name: 'EOS R10', mount: 'Canon RF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'canon-90d', brand: 'Canon', name: 'EOS 90D', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 33, price_range: 'Enthusiast' },
  { id: 'canon-80d', brand: 'Canon', name: 'EOS 80D', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'canon-t8i', brand: 'Canon', name: 'EOS Rebel T8i', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24, price_range: 'Entry' },
  { id: 'canon-t7i', brand: 'Canon', name: 'EOS Rebel T7i', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24, price_range: 'Entry' },
  { id: 'canon-sl3', brand: 'Canon', name: 'EOS Rebel SL3', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24, price_range: 'Entry' },
  { id: 'canon-t6i', brand: 'Canon', name: 'EOS Rebel T6i', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24, price_range: 'Entry' },
  { id: 'canon-t6', brand: 'Canon', name: 'EOS Rebel T6', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 18, price_range: 'Entry' },
  { id: 'canon-t7', brand: 'Canon', name: 'EOS Rebel T7', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24, price_range: 'Entry' },
  { id: 'canon-77d', brand: 'Canon', name: 'EOS 77D', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'canon-70d', brand: 'Canon', name: 'EOS 70D', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 20, price_range: 'Enthusiast' },
  { id: 'canon-60d', brand: 'Canon', name: 'EOS 60D', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 18, price_range: 'Enthusiast' },
  { id: 'canon-7d-ii', brand: 'Canon', name: 'EOS 7D Mark II', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 20, price_range: 'Professional' },
  { id: 'canon-7d', brand: 'Canon', name: 'EOS 7D', mount: 'Canon EF', sensor_format: 'APS-C', crop_factor: 1.6, megapixels: 18, price_range: 'Professional' },
  
  // Nikon Full Frame
  { id: 'nikon-z9', brand: 'Nikon', name: 'Z9', mount: 'Nikon Z', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 46, price_range: 'Professional' },
  { id: 'nikon-z8', brand: 'Nikon', name: 'Z8', mount: 'Nikon Z', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 46, price_range: 'Professional' },
  { id: 'nikon-z7-ii', brand: 'Nikon', name: 'Z7 II', mount: 'Nikon Z', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 46, price_range: 'Professional' },
  { id: 'nikon-z6-ii', brand: 'Nikon', name: 'Z6 II', mount: 'Nikon Z', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Professional' },
  { id: 'nikon-z5', brand: 'Nikon', name: 'Z5', mount: 'Nikon Z', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'nikon-d850', brand: 'Nikon', name: 'D850', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 46, price_range: 'Professional' },
  { id: 'nikon-d780', brand: 'Nikon', name: 'D780', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Professional' },
  { id: 'nikon-d750', brand: 'Nikon', name: 'D750', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'nikon-d810', brand: 'Nikon', name: 'D810', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 36, price_range: 'Professional' },
  { id: 'nikon-d800', brand: 'Nikon', name: 'D800', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 36, price_range: 'Professional' },
  { id: 'nikon-d610', brand: 'Nikon', name: 'D610', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'nikon-d600', brand: 'Nikon', name: 'D600', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'nikon-d4s', brand: 'Nikon', name: 'D4S', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 16, price_range: 'Professional' },
  { id: 'nikon-df', brand: 'Nikon', name: 'Df', mount: 'Nikon F', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 16, price_range: 'Professional' },
  
  // Nikon APS-C
  { id: 'nikon-z50', brand: 'Nikon', name: 'Z50', mount: 'Nikon Z', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 21, price_range: 'Enthusiast' },
  { id: 'nikon-z30', brand: 'Nikon', name: 'Z30', mount: 'Nikon Z', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 21, price_range: 'Entry' },
  { id: 'nikon-d7500', brand: 'Nikon', name: 'D7500', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 21, price_range: 'Enthusiast' },
  { id: 'nikon-d5600', brand: 'Nikon', name: 'D5600', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  { id: 'nikon-d5500', brand: 'Nikon', name: 'D5500', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  { id: 'nikon-d5300', brand: 'Nikon', name: 'D5300', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  { id: 'nikon-d3500', brand: 'Nikon', name: 'D3500', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  { id: 'nikon-d3400', brand: 'Nikon', name: 'D3400', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  { id: 'nikon-d7200', brand: 'Nikon', name: 'D7200', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'nikon-d7100', brand: 'Nikon', name: 'D7100', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'nikon-d500', brand: 'Nikon', name: 'D500', mount: 'Nikon F', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 21, price_range: 'Professional' },
  
  // Sony Full Frame
  { id: 'sony-a7r-v', brand: 'Sony', name: 'α7R V', mount: 'Sony E', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 61, price_range: 'Professional' },
  { id: 'sony-a7r-iv', brand: 'Sony', name: 'α7R IV', mount: 'Sony E', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 61, price_range: 'Professional' },
  { id: 'sony-a7-iv', brand: 'Sony', name: 'α7 IV', mount: 'Sony E', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 33, price_range: 'Professional' },
  { id: 'sony-a7-iii', brand: 'Sony', name: 'α7 III', mount: 'Sony E', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Professional' },
  { id: 'sony-a7c-ii', brand: 'Sony', name: 'α7C II', mount: 'Sony E', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 33, price_range: 'Enthusiast' },
  { id: 'sony-a7c', brand: 'Sony', name: 'α7C', mount: 'Sony E', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'sony-a9-ii', brand: 'Sony', name: 'α9 II', mount: 'Sony E', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 24, price_range: 'Professional' },
  
  // Sony APS-C
  { id: 'sony-fx30', brand: 'Sony', name: 'FX30', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Professional' },
  { id: 'sony-a6700', brand: 'Sony', name: 'α6700', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Enthusiast' },
  { id: 'sony-a6600', brand: 'Sony', name: 'α6600', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'sony-a6500', brand: 'Sony', name: 'α6500', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'sony-a6400', brand: 'Sony', name: 'α6400', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'sony-a6300', brand: 'Sony', name: 'α6300', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'sony-a6000', brand: 'Sony', name: 'α6000', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  { id: 'sony-a6100', brand: 'Sony', name: 'α6100', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  { id: 'sony-a5100', brand: 'Sony', name: 'α5100', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  { id: 'sony-a5000', brand: 'Sony', name: 'α5000', mount: 'Sony E', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 20, price_range: 'Entry' },
  
  // Fujifilm APS-C
  { id: 'fuji-xt5', brand: 'Fujifilm', name: 'X-T5', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 40, price_range: 'Professional' },
  { id: 'fuji-xh2s', brand: 'Fujifilm', name: 'X-H2S', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Professional' },
  { id: 'fuji-xh2', brand: 'Fujifilm', name: 'X-H2', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 40, price_range: 'Professional' },
  { id: 'fuji-xt4', brand: 'Fujifilm', name: 'X-T4', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Professional' },
  { id: 'fuji-xt3', brand: 'Fujifilm', name: 'X-T3', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Professional' },
  { id: 'fuji-xt30-ii', brand: 'Fujifilm', name: 'X-T30 II', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Enthusiast' },
  { id: 'fuji-xt30', brand: 'Fujifilm', name: 'X-T30', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Enthusiast' },
  { id: 'fuji-xs20', brand: 'Fujifilm', name: 'X-S20', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Enthusiast' },
  { id: 'fuji-xs10', brand: 'Fujifilm', name: 'X-S10', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Enthusiast' },
  { id: 'fuji-xe4', brand: 'Fujifilm', name: 'X-E4', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Enthusiast' },
  { id: 'fuji-xe3', brand: 'Fujifilm', name: 'X-E3', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Enthusiast' },
  { id: 'fuji-xa7', brand: 'Fujifilm', name: 'X-A7', mount: 'Fujifilm X', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Entry' },
  
  // Fujifilm X100 Series (Fixed Lens - 23mm f/2)
  { id: 'fuji-x100vi', brand: 'Fujifilm', name: 'X100VI', mount: 'Fixed Lens (23mm f/2)', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 40, price_range: 'Professional' },
  { id: 'fuji-x100v', brand: 'Fujifilm', name: 'X100V', mount: 'Fixed Lens (23mm f/2)', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Professional' },
  { id: 'fuji-x100f', brand: 'Fujifilm', name: 'X100F', mount: 'Fixed Lens (23mm f/2)', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Professional' },
  { id: 'fuji-x100t', brand: 'Fujifilm', name: 'X100T', mount: 'Fixed Lens (23mm f/2)', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 16, price_range: 'Professional' },
  
  // Micro Four Thirds
  { id: 'olympus-em1x', brand: 'Olympus', name: 'OM-D E-M1X', mount: 'Micro Four Thirds', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 20, price_range: 'Professional' },
  { id: 'olympus-em1-iii', brand: 'Olympus', name: 'OM-D E-M1 Mark III', mount: 'Micro Four Thirds', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 20, price_range: 'Professional' },
  { id: 'olympus-em5-iii', brand: 'Olympus', name: 'OM-D E-M5 Mark III', mount: 'Micro Four Thirds', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 20, price_range: 'Enthusiast' },
  { id: 'panasonic-gh6', brand: 'Panasonic', name: 'LUMIX GH6', mount: 'Micro Four Thirds', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 25, price_range: 'Professional' },
  { id: 'panasonic-gh5s', brand: 'Panasonic', name: 'LUMIX GH5S', mount: 'Micro Four Thirds', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 10, price_range: 'Professional' },
  { id: 'panasonic-g9', brand: 'Panasonic', name: 'LUMIX G9', mount: 'Micro Four Thirds', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 20, price_range: 'Enthusiast' },
  { id: 'panasonic-gx9', brand: 'Panasonic', name: 'LUMIX GX9', mount: 'Micro Four Thirds', sensor_format: 'Micro Four Thirds', crop_factor: 2.0, megapixels: 20, price_range: 'Enthusiast' },
  
  // Medium Format
  { id: 'fuji-gfx100s', brand: 'Fujifilm', name: 'GFX100S', mount: 'Fujifilm G', sensor_format: 'Medium Format', crop_factor: 0.79, megapixels: 102, price_range: 'Professional' },
  { id: 'fuji-gfx50s-ii', brand: 'Fujifilm', name: 'GFX50S II', mount: 'Fujifilm G', sensor_format: 'Medium Format', crop_factor: 0.79, megapixels: 51, price_range: 'Professional' },
  
  // Pentax
  { id: 'pentax-k3-iii', brand: 'Pentax', name: 'K-3 Mark III', mount: 'Pentax K', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 26, price_range: 'Professional' },
  { id: 'pentax-kp', brand: 'Pentax', name: 'KP', mount: 'Pentax K', sensor_format: 'APS-C', crop_factor: 1.5, megapixels: 24, price_range: 'Enthusiast' },
  
  // Leica
  { id: 'leica-q2', brand: 'Leica', name: 'Q2', mount: 'Fixed Lens (28mm f/1.7)', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 47, price_range: 'Professional' },
  { id: 'leica-sl2', brand: 'Leica', name: 'SL2', mount: 'Leica L', sensor_format: 'Full Frame', crop_factor: 1.0, megapixels: 47, price_range: 'Professional' },
]; 