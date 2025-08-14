// Comprehensive lens database
export const LENS_DATABASE = [
  // Canon RF Lenses
  { id: 'canon-rf-24-70-f28', brand: 'Canon', name: 'RF 24-70mm f/2.8L IS USM', mount: 'Canon RF', focal_length: '24-70', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: true, weight: 900 },
  { id: 'canon-rf-70-200-f28', brand: 'Canon', name: 'RF 70-200mm f/2.8L IS USM', mount: 'Canon RF', focal_length: '70-200', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1070 },
  { id: 'canon-rf-16-35-f28', brand: 'Canon', name: 'RF 16-35mm f/2.8L IS USM', mount: 'Canon RF', focal_length: '16-35', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: true, weight: 840 },
  { id: 'canon-rf-50-f12', brand: 'Canon', name: 'RF 50mm f/1.2L USM', mount: 'Canon RF', focal_length: '50', max_aperture: 'f/1.2', type: 'prime', category: 'standard', is_stabilized: false, weight: 950 },
  { id: 'canon-rf-85-f12', brand: 'Canon', name: 'RF 85mm f/1.2L USM', mount: 'Canon RF', focal_length: '85', max_aperture: 'f/1.2', type: 'prime', category: 'portrait', is_stabilized: false, weight: 1195 },
  { id: 'canon-rf-35-f18', brand: 'Canon', name: 'RF 35mm f/1.8 IS STM Macro', mount: 'Canon RF', focal_length: '35', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: true, weight: 305 },
  { id: 'canon-rf-50-f18', brand: 'Canon', name: 'RF 50mm f/1.8 STM', mount: 'Canon RF', focal_length: '50', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 160 },
  { id: 'canon-rf-24-105-f4', brand: 'Canon', name: 'RF 24-105mm f/4L IS USM', mount: 'Canon RF', focal_length: '24-105', max_aperture: 'f/4', type: 'zoom', category: 'standard', is_stabilized: true, weight: 700 },
  { id: 'canon-rf-100-500-f45-71', brand: 'Canon', name: 'RF 100-500mm f/4.5-7.1L IS USM', mount: 'Canon RF', focal_length: '100-500', max_aperture: 'f/4.5-7.1', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1370 },

  // Canon EF Lenses
  { id: 'canon-ef-24-70-f28-ii', brand: 'Canon', name: 'EF 24-70mm f/2.8L II USM', mount: 'Canon EF', focal_length: '24-70', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: false, weight: 805 },
  { id: 'canon-ef-70-200-f28-iii', brand: 'Canon', name: 'EF 70-200mm f/2.8L IS III USM', mount: 'Canon EF', focal_length: '70-200', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1480 },
  { id: 'canon-ef-16-35-f28-iii', brand: 'Canon', name: 'EF 16-35mm f/2.8L III USM', mount: 'Canon EF', focal_length: '16-35', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 790 },
  { id: 'canon-ef-50-f12', brand: 'Canon', name: 'EF 50mm f/1.2L USM', mount: 'Canon EF', focal_length: '50', max_aperture: 'f/1.2', type: 'prime', category: 'standard', is_stabilized: false, weight: 580 },
  { id: 'canon-ef-85-f12-ii', brand: 'Canon', name: 'EF 85mm f/1.2L II USM', mount: 'Canon EF', focal_length: '85', max_aperture: 'f/1.2', type: 'prime', category: 'portrait', is_stabilized: false, weight: 1025 },
  { id: 'canon-ef-50-f18-stm', brand: 'Canon', name: 'EF 50mm f/1.8 STM', mount: 'Canon EF', focal_length: '50', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 160 },
  { id: 'canon-ef-24-105-f4', brand: 'Canon', name: 'EF 24-105mm f/4L IS USM', mount: 'Canon EF', focal_length: '24-105', max_aperture: 'f/4', type: 'zoom', category: 'standard', is_stabilized: true, weight: 670 },
  { id: 'canon-ef-100-400-f45-56-ii', brand: 'Canon', name: 'EF 100-400mm f/4.5-5.6L IS II USM', mount: 'Canon EF', focal_length: '100-400', max_aperture: 'f/4.5-5.6', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1570 },

  // Sony E Mount Lenses
  { id: 'sony-fe-24-70-f28-gm', brand: 'Sony', name: 'FE 24-70mm f/2.8 GM', mount: 'Sony E', focal_length: '24-70', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: true, weight: 886 },
  { id: 'sony-fe-70-200-f28-gm-oss', brand: 'Sony', name: 'FE 70-200mm f/2.8 GM OSS', mount: 'Sony E', focal_length: '70-200', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1480 },
  { id: 'sony-fe-16-35-f28-gm', brand: 'Sony', name: 'FE 16-35mm f/2.8 GM', mount: 'Sony E', focal_length: '16-35', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 680 },
  { id: 'sony-fe-50-f12-gm', brand: 'Sony', name: 'FE 50mm f/1.2 GM', mount: 'Sony E', focal_length: '50', max_aperture: 'f/1.2', type: 'prime', category: 'standard', is_stabilized: false, weight: 778 },
  { id: 'sony-fe-85-f14-gm', brand: 'Sony', name: 'FE 85mm f/1.4 GM', mount: 'Sony E', focal_length: '85', max_aperture: 'f/1.4', type: 'prime', category: 'portrait', is_stabilized: false, weight: 820 },
  { id: 'sony-fe-35-f18', brand: 'Sony', name: 'FE 35mm f/1.8', mount: 'Sony E', focal_length: '35', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 280 },
  { id: 'sony-fe-50-f18', brand: 'Sony', name: 'FE 50mm f/1.8', mount: 'Sony E', focal_length: '50', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 186 },
  { id: 'sony-fe-24-105-f4-g-oss', brand: 'Sony', name: 'FE 24-105mm f/4 G OSS', mount: 'Sony E', focal_length: '24-105', max_aperture: 'f/4', type: 'zoom', category: 'standard', is_stabilized: true, weight: 663 },
  { id: 'sony-fe-100-400-f45-56-gm-oss', brand: 'Sony', name: 'FE 100-400mm f/4.5-5.6 GM OSS', mount: 'Sony E', focal_length: '100-400', max_aperture: 'f/4.5-5.6', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1395 },

  // APS-C Sony E Mount
  { id: 'sony-e-16-55-f28-g', brand: 'Sony', name: 'E 16-55mm f/2.8 G', mount: 'Sony E', focal_length: '16-55', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: true, weight: 494 },
  { id: 'sony-e-70-350-f45-63-g-oss', brand: 'Sony', name: 'E 70-350mm f/4.5-6.3 G OSS', mount: 'Sony E', focal_length: '70-350', max_aperture: 'f/4.5-6.3', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 625 },
  { id: 'sony-e-35-f18-oss', brand: 'Sony', name: 'E 35mm f/1.8 OSS', mount: 'Sony E', focal_length: '35', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: true, weight: 154 },
  { id: 'sony-e-50-f18-oss', brand: 'Sony', name: 'E 50mm f/1.8 OSS', mount: 'Sony E', focal_length: '50', max_aperture: 'f/1.8', type: 'prime', category: 'portrait', is_stabilized: true, weight: 202 },

  // Nikon Z Mount Lenses
  { id: 'nikon-z-24-70-f28-s', brand: 'Nikon', name: 'NIKKOR Z 24-70mm f/2.8 S', mount: 'Nikon Z', focal_length: '24-70', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: true, weight: 805 },
  { id: 'nikon-z-70-200-f28-vr-s', brand: 'Nikon', name: 'NIKKOR Z 70-200mm f/2.8 VR S', mount: 'Nikon Z', focal_length: '70-200', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1360 },
  { id: 'nikon-z-14-24-f28-s', brand: 'Nikon', name: 'NIKKOR Z 14-24mm f/2.8 S', mount: 'Nikon Z', focal_length: '14-24', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 650 },
  { id: 'nikon-z-50-f12-s', brand: 'Nikon', name: 'NIKKOR Z 50mm f/1.2 S', mount: 'Nikon Z', focal_length: '50', max_aperture: 'f/1.2', type: 'prime', category: 'standard', is_stabilized: false, weight: 1090 },
  { id: 'nikon-z-85-f18-s', brand: 'Nikon', name: 'NIKKOR Z 85mm f/1.8 S', mount: 'Nikon Z', focal_length: '85', max_aperture: 'f/1.8', type: 'prime', category: 'portrait', is_stabilized: false, weight: 470 },
  { id: 'nikon-z-35-f18-s', brand: 'Nikon', name: 'NIKKOR Z 35mm f/1.8 S', mount: 'Nikon Z', focal_length: '35', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 370 },
  { id: 'nikon-z-50-f18-s', brand: 'Nikon', name: 'NIKKOR Z 50mm f/1.8 S', mount: 'Nikon Z', focal_length: '50', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 415 },
  { id: 'nikon-z-24-120-f4-s', brand: 'Nikon', name: 'NIKKOR Z 24-120mm f/4 S', mount: 'Nikon Z', focal_length: '24-120', max_aperture: 'f/4', type: 'zoom', category: 'standard', is_stabilized: true, weight: 630 },

  // Nikon F Mount Lenses
  { id: 'nikon-af-s-24-70-f28', brand: 'Nikon', name: 'AF-S NIKKOR 24-70mm f/2.8E ED VR', mount: 'Nikon F', focal_length: '24-70', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: true, weight: 1070 },
  { id: 'nikon-af-s-70-200-f28', brand: 'Nikon', name: 'AF-S NIKKOR 70-200mm f/2.8E FL ED VR', mount: 'Nikon F', focal_length: '70-200', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1430 },
  { id: 'nikon-af-s-14-24-f28', brand: 'Nikon', name: 'AF-S NIKKOR 14-24mm f/2.8G ED', mount: 'Nikon F', focal_length: '14-24', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 970 },
  { id: 'nikon-af-s-50-f14', brand: 'Nikon', name: 'AF-S NIKKOR 50mm f/1.4G', mount: 'Nikon F', focal_length: '50', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 280 },
  { id: 'nikon-af-s-85-f14', brand: 'Nikon', name: 'AF-S NIKKOR 85mm f/1.4G', mount: 'Nikon F', focal_length: '85', max_aperture: 'f/1.4', type: 'prime', category: 'portrait', is_stabilized: false, weight: 595 },
  { id: 'nikon-af-s-35-f18', brand: 'Nikon', name: 'AF-S NIKKOR 35mm f/1.8G ED', mount: 'Nikon F', focal_length: '35', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 305 },
  { id: 'nikon-af-s-50-f18', brand: 'Nikon', name: 'AF-S NIKKOR 50mm f/1.8G', mount: 'Nikon F', focal_length: '50', max_aperture: 'f/1.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 185 },

  // Fujifilm X Mount Lenses
  { id: 'fuji-xf-16-55-f28-r-lm-wr', brand: 'Fujifilm', name: 'XF 16-55mm f/2.8 R LM WR', mount: 'Fujifilm X', focal_length: '16-55', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: true, weight: 655 },
  { id: 'fuji-xf-50-140-f28-r-lm-ois-wr', brand: 'Fujifilm', name: 'XF 50-140mm f/2.8 R LM OIS WR', mount: 'Fujifilm X', focal_length: '50-140', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 995 },
  { id: 'fuji-xf-8-16-f28-r-lm-wr', brand: 'Fujifilm', name: 'XF 8-16mm f/2.8 R LM WR', mount: 'Fujifilm X', focal_length: '8-16', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 805 },
  { id: 'fuji-xf-35-f14-r', brand: 'Fujifilm', name: 'XF 35mm f/1.4 R', mount: 'Fujifilm X', focal_length: '35', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 187 },
  { id: 'fuji-xf-56-f12-r', brand: 'Fujifilm', name: 'XF 56mm f/1.2 R', mount: 'Fujifilm X', focal_length: '56', max_aperture: 'f/1.2', type: 'prime', category: 'portrait', is_stabilized: false, weight: 405 },
  { id: 'fuji-xf-23-f14-r', brand: 'Fujifilm', name: 'XF 23mm f/1.4 R', mount: 'Fujifilm X', focal_length: '23', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 300 },
  { id: 'fuji-xf-18-55-f28-4-r-lm-ois', brand: 'Fujifilm', name: 'XF 18-55mm f/2.8-4 R LM OIS', mount: 'Fujifilm X', focal_length: '18-55', max_aperture: 'f/2.8-4', type: 'zoom', category: 'standard', is_stabilized: true, weight: 310 },
  { id: 'fuji-xf-55-200-f35-48-r-lm-ois', brand: 'Fujifilm', name: 'XF 55-200mm f/3.5-4.8 R LM OIS', mount: 'Fujifilm X', focal_length: '55-200', max_aperture: 'f/3.5-4.8', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 580 },

  // Micro Four Thirds Lenses
  { id: 'olympus-m-zuiko-12-40-f28-pro', brand: 'Olympus', name: 'M.Zuiko Digital ED 12-40mm f/2.8 PRO', mount: 'Micro Four Thirds', focal_length: '12-40', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: false, weight: 382 },
  { id: 'olympus-m-zuiko-40-150-f28-pro', brand: 'Olympus', name: 'M.Zuiko Digital ED 40-150mm f/2.8 PRO', mount: 'Micro Four Thirds', focal_length: '40-150', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: false, weight: 760 },
  { id: 'olympus-m-zuiko-7-14-f28-pro', brand: 'Olympus', name: 'M.Zuiko Digital ED 7-14mm f/2.8 PRO', mount: 'Micro Four Thirds', focal_length: '7-14', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 534 },
  { id: 'panasonic-lumix-g-25-f17', brand: 'Panasonic', name: 'LUMIX G 25mm f/1.7 ASPH', mount: 'Micro Four Thirds', focal_length: '25', max_aperture: 'f/1.7', type: 'prime', category: 'standard', is_stabilized: false, weight: 125 },
  { id: 'panasonic-lumix-g-42-5-f17', brand: 'Panasonic', name: 'LUMIX G 42.5mm f/1.7 ASPH POWER O.I.S.', mount: 'Micro Four Thirds', focal_length: '42.5', max_aperture: 'f/1.7', type: 'prime', category: 'portrait', is_stabilized: true, weight: 130 },

  // Third Party Lenses
  
  // Sigma Lenses
  { id: 'sigma-24-70-f28-dg-dn-art-e', brand: 'Sigma', name: '24-70mm f/2.8 DG DN Art', mount: 'Sony E', focal_length: '24-70', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: false, weight: 835 },
  { id: 'sigma-85-f14-dg-dn-art-e', brand: 'Sigma', name: '85mm f/1.4 DG DN Art', mount: 'Sony E', focal_length: '85', max_aperture: 'f/1.4', type: 'prime', category: 'portrait', is_stabilized: false, weight: 630 },
  { id: 'sigma-35-f14-dg-dn-art-e', brand: 'Sigma', name: '35mm f/1.4 DG DN Art', mount: 'Sony E', focal_length: '35', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 645 },
  { id: 'sigma-24-70-f28-dg-dn-art-rf', brand: 'Sigma', name: '24-70mm f/2.8 DG DN Art', mount: 'Canon RF', focal_length: '24-70', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: false, weight: 835 },
  { id: 'sigma-85-f14-dg-dn-art-rf', brand: 'Sigma', name: '85mm f/1.4 DG DN Art', mount: 'Canon RF', focal_length: '85', max_aperture: 'f/1.4', type: 'prime', category: 'portrait', is_stabilized: false, weight: 630 },
  { id: 'sigma-150-600-f5-63-dg-os-hsm-canon', brand: 'Sigma', name: '150-600mm f/5-6.3 DG OS HSM Contemporary', mount: 'Canon EF', focal_length: '150-600', max_aperture: 'f/5-6.3', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1930 },
  { id: 'sigma-150-600-f5-63-dg-os-hsm-nikon', brand: 'Sigma', name: '150-600mm f/5-6.3 DG OS HSM Contemporary', mount: 'Nikon F', focal_length: '150-600', max_aperture: 'f/5-6.3', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1930 },
  { id: 'sigma-18-35-f18-dc-hsm-art-canon', brand: 'Sigma', name: '18-35mm f/1.8 DC HSM Art', mount: 'Canon EF', focal_length: '18-35', max_aperture: 'f/1.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 810 },
  { id: 'sigma-18-35-f18-dc-hsm-art-nikon', brand: 'Sigma', name: '18-35mm f/1.8 DC HSM Art', mount: 'Nikon F', focal_length: '18-35', max_aperture: 'f/1.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 810 },

  // Tamron Lenses
  { id: 'tamron-28-75-f28-di-iii-rxd-e', brand: 'Tamron', name: '28-75mm f/2.8 Di III RXD', mount: 'Sony E', focal_length: '28-75', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: false, weight: 550 },
  { id: 'tamron-70-180-f28-di-iii-vxd-e', brand: 'Tamron', name: '70-180mm f/2.8 Di III VXD', mount: 'Sony E', focal_length: '70-180', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: false, weight: 815 },
  { id: 'tamron-17-28-f28-di-iii-rxd-e', brand: 'Tamron', name: '17-28mm f/2.8 Di III RXD', mount: 'Sony E', focal_length: '17-28', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 420 },
  { id: 'tamron-85-f18-di-iii-vxd-e', brand: 'Tamron', name: '85mm f/1.8 Di III VXD', mount: 'Sony E', focal_length: '85', max_aperture: 'f/1.8', type: 'prime', category: 'portrait', is_stabilized: false, weight: 285 },
  { id: 'tamron-20-f28-di-iii-osd-e', brand: 'Tamron', name: '20mm f/2.8 Di III OSD M1:2', mount: 'Sony E', focal_length: '20', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 220 },
  { id: 'tamron-24-f28-di-iii-osd-e', brand: 'Tamron', name: '24mm f/2.8 Di III OSD M1:2', mount: 'Sony E', focal_length: '24', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 215 },
  { id: 'tamron-35-f28-di-iii-osd-e', brand: 'Tamron', name: '35mm f/2.8 Di III OSD M1:2', mount: 'Sony E', focal_length: '35', max_aperture: 'f/2.8', type: 'prime', category: 'standard', is_stabilized: false, weight: 210 },
  { id: 'tamron-150-500-f5-67-di-iii-vc-vxd-e', brand: 'Tamron', name: '150-500mm f/5-6.7 Di III VC VXD', mount: 'Sony E', focal_length: '150-500', max_aperture: 'f/5-6.7', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1725 },
  { id: 'tamron-70-300-f45-63-di-iii-rxd-canon', brand: 'Tamron', name: '70-300mm f/4.5-6.3 Di III RXD', mount: 'Canon EF', focal_length: '70-300', max_aperture: 'f/4.5-6.3', type: 'zoom', category: 'telephoto', is_stabilized: false, weight: 545 },
  { id: 'tamron-70-300-f45-63-di-iii-rxd-nikon', brand: 'Tamron', name: '70-300mm f/4.5-6.3 Di III RXD', mount: 'Nikon F', focal_length: '70-300', max_aperture: 'f/4.5-6.3', type: 'zoom', category: 'telephoto', is_stabilized: false, weight: 545 },

  // Tokina Lenses
  { id: 'tokina-11-16-f28-at-x-pro-dx-canon', brand: 'Tokina', name: 'AT-X 11-16mm f/2.8 PRO DX', mount: 'Canon EF', focal_length: '11-16', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 560 },
  { id: 'tokina-11-16-f28-at-x-pro-dx-nikon', brand: 'Tokina', name: 'AT-X 11-16mm f/2.8 PRO DX', mount: 'Nikon F', focal_length: '11-16', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 560 },
  { id: 'tokina-100-f28-at-x-macro-pro-canon', brand: 'Tokina', name: 'AT-X M 100mm f/2.8 PRO D Macro', mount: 'Canon EF', focal_length: '100', max_aperture: 'f/2.8', type: 'prime', category: 'macro', is_stabilized: false, weight: 540 },
  { id: 'tokina-100-f28-at-x-macro-pro-nikon', brand: 'Tokina', name: 'AT-X M 100mm f/2.8 PRO D Macro', mount: 'Nikon F', focal_length: '100', max_aperture: 'f/2.8', type: 'prime', category: 'macro', is_stabilized: false, weight: 540 },

  // Zeiss Lenses
  { id: 'zeiss-batis-85-f18-e', brand: 'Zeiss', name: 'Batis 85mm f/1.8', mount: 'Sony E', focal_length: '85', max_aperture: 'f/1.8', type: 'prime', category: 'portrait', is_stabilized: true, weight: 475 },
  { id: 'zeiss-batis-25-f2-e', brand: 'Zeiss', name: 'Batis 25mm f/2', mount: 'Sony E', focal_length: '25', max_aperture: 'f/2', type: 'prime', category: 'wide-angle', is_stabilized: true, weight: 335 },
  { id: 'zeiss-planar-50-f14-ze', brand: 'Zeiss', name: 'Planar T* 50mm f/1.4 ZE', mount: 'Canon EF', focal_length: '50', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 320 },
  { id: 'zeiss-planar-50-f14-zf', brand: 'Zeiss', name: 'Planar T* 50mm f/1.4 ZF.2', mount: 'Nikon F', focal_length: '50', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 320 },

  // Laowa Lenses
  { id: 'laowa-15-f2-zero-d-e', brand: 'Laowa', name: '15mm f/2 FE Zero-D', mount: 'Sony E', focal_length: '15', max_aperture: 'f/2', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 500 },
  { id: 'laowa-12-f28-zero-d-e', brand: 'Laowa', name: '12mm f/2.8 Zero-D', mount: 'Sony E', focal_length: '12', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 609 },
  { id: 'laowa-100-f28-2x-macro-e', brand: 'Laowa', name: '100mm f/2.8 2x Ultra Macro APO', mount: 'Sony E', focal_length: '100', max_aperture: 'f/2.8', type: 'prime', category: 'macro', is_stabilized: false, weight: 638 },

  // Rokinon/Samyang Lenses
  { id: 'rokinon-14-f28-if-ed-canon', brand: 'Rokinon', name: '14mm f/2.8 IF ED UMC', mount: 'Canon EF', focal_length: '14', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 552 },
  { id: 'rokinon-14-f28-if-ed-nikon', brand: 'Rokinon', name: '14mm f/2.8 IF ED UMC', mount: 'Nikon F', focal_length: '14', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 552 },
  { id: 'rokinon-85-f14-as-if-umc-canon', brand: 'Rokinon', name: '85mm f/1.4 AS IF UMC', mount: 'Canon EF', focal_length: '85', max_aperture: 'f/1.4', type: 'prime', category: 'portrait', is_stabilized: false, weight: 540 },
  { id: 'rokinon-85-f14-as-if-umc-nikon', brand: 'Rokinon', name: '85mm f/1.4 AS IF UMC', mount: 'Nikon F', focal_length: '85', max_aperture: 'f/1.4', type: 'prime', category: 'portrait', is_stabilized: false, weight: 540 },
  { id: 'samyang-12-f2-ncs-cs-e', brand: 'Samyang', name: '12mm f/2.0 NCS CS', mount: 'Sony E', focal_length: '12', max_aperture: 'f/2', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 245 },
  { id: 'samyang-35-f14-as-umc-e', brand: 'Samyang', name: '35mm f/1.4 AS UMC', mount: 'Sony E', focal_length: '35', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 660 },

  // Viltrox Lenses
  { id: 'viltrox-23-f14-af-e', brand: 'Viltrox', name: '23mm f/1.4 AF', mount: 'Sony E', focal_length: '23', max_aperture: 'f/1.4', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 290 },
  { id: 'viltrox-33-f14-af-e', brand: 'Viltrox', name: '33mm f/1.4 AF', mount: 'Sony E', focal_length: '33', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 270 },
  { id: 'viltrox-56-f14-af-e', brand: 'Viltrox', name: '56mm f/1.4 AF', mount: 'Sony E', focal_length: '56', max_aperture: 'f/1.4', type: 'prime', category: 'portrait', is_stabilized: false, weight: 290 },
  { id: 'viltrox-85-f18-rf', brand: 'Viltrox', name: '85mm f/1.8 RF', mount: 'Canon RF', focal_length: '85', max_aperture: 'f/1.8', type: 'prime', category: 'portrait', is_stabilized: false, weight: 485 },
  { id: 'viltrox-23-f14-af-fuji', brand: 'Viltrox', name: '23mm f/1.4 AF', mount: 'Fujifilm X', focal_length: '23', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 290 },
  { id: 'viltrox-33-f14-af-fuji', brand: 'Viltrox', name: '33mm f/1.4 AF', mount: 'Fujifilm X', focal_length: '33', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 270 },
  { id: 'viltrox-56-f14-af-fuji', brand: 'Viltrox', name: '56mm f/1.4 AF', mount: 'Fujifilm X', focal_length: '56', max_aperture: 'f/1.4', type: 'prime', category: 'portrait', is_stabilized: false, weight: 290 },

  // Leica L Mount Lenses
  { id: 'leica-vario-elmarit-24-70-f28', brand: 'Leica', name: 'Vario-Elmarit-SL 24-70mm f/2.8 ASPH', mount: 'Leica L', focal_length: '24-70', max_aperture: 'f/2.8', type: 'zoom', category: 'standard', is_stabilized: true, weight: 835 },
  { id: 'leica-vario-elmarit-24-90-f28-4', brand: 'Leica', name: 'Vario-Elmarit-SL 24-90mm f/2.8-4 ASPH', mount: 'Leica L', focal_length: '24-90', max_aperture: 'f/2.8-4', type: 'zoom', category: 'standard', is_stabilized: true, weight: 710 },
  { id: 'leica-vario-elmarit-70-200-f28', brand: 'Leica', name: 'Vario-Elmarit-SL 70-200mm f/2.8 ASPH', mount: 'Leica L', focal_length: '70-200', max_aperture: 'f/2.8', type: 'zoom', category: 'telephoto', is_stabilized: true, weight: 1345 },
  { id: 'leica-summicron-28-f2', brand: 'Leica', name: 'Summicron-SL 28mm f/2 ASPH', mount: 'Leica L', focal_length: '28', max_aperture: 'f/2', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 450 },
  { id: 'leica-summicron-35-f2', brand: 'Leica', name: 'Summicron-SL 35mm f/2 ASPH', mount: 'Leica L', focal_length: '35', max_aperture: 'f/2', type: 'prime', category: 'standard', is_stabilized: false, weight: 455 },
  { id: 'leica-summicron-50-f2', brand: 'Leica', name: 'Summicron-SL 50mm f/2 ASPH', mount: 'Leica L', focal_length: '50', max_aperture: 'f/2', type: 'prime', category: 'standard', is_stabilized: false, weight: 540 },
  { id: 'leica-summicron-75-f2', brand: 'Leica', name: 'Summicron-SL 75mm f/2 ASPH', mount: 'Leica L', focal_length: '75', max_aperture: 'f/2', type: 'prime', category: 'portrait', is_stabilized: false, weight: 565 },
  { id: 'leica-summicron-90-f2', brand: 'Leica', name: 'Summicron-SL 90mm f/2 ASPH', mount: 'Leica L', focal_length: '90', max_aperture: 'f/2', type: 'prime', category: 'portrait', is_stabilized: false, weight: 700 },

  // Mount Adapters and Special Cases
  { id: 'rf-mount-adapter-ef-eos-r', brand: 'Canon', name: 'Mount Adapter EF-EOS R', mount: 'Canon RF', focal_length: 'Adapter', max_aperture: 'N/A', type: 'adapter', category: 'adapter', is_stabilized: false, weight: 110 },
  
  
  // Additional Astrophotography-Specific Lenses
  // Sigma Art Series (Excellent for Astro)
  { id: 'sigma-14-f18-dg-hsm-art-canon', brand: 'Sigma', name: '14mm f/1.8 DG HSM Art', mount: 'Canon EF', focal_length: '14', max_aperture: 'f/1.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 1170, astro_recommended: true },
  { id: 'sigma-14-f18-dg-hsm-art-nikon', brand: 'Sigma', name: '14mm f/1.8 DG HSM Art', mount: 'Nikon F', focal_length: '14', max_aperture: 'f/1.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 1170, astro_recommended: true },
  { id: 'sigma-14-f18-dg-hsm-art-sony', brand: 'Sigma', name: '14mm f/1.8 DG HSM Art', mount: 'Sony E', focal_length: '14', max_aperture: 'f/1.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 1170, astro_recommended: true },
  { id: 'sigma-20-f14-dg-hsm-art-canon', brand: 'Sigma', name: '20mm f/1.4 DG HSM Art', mount: 'Canon EF', focal_length: '20', max_aperture: 'f/1.4', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 950, astro_recommended: true },
  { id: 'sigma-20-f14-dg-hsm-art-nikon', brand: 'Sigma', name: '20mm f/1.4 DG HSM Art', mount: 'Nikon F', focal_length: '20', max_aperture: 'f/1.4', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 950, astro_recommended: true },
  { id: 'sigma-28-f14-dg-hsm-art-canon', brand: 'Sigma', name: '28mm f/1.4 DG HSM Art', mount: 'Canon EF', focal_length: '28', max_aperture: 'f/1.4', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 865, astro_recommended: true },
  { id: 'sigma-40-f14-dg-hsm-art-canon', brand: 'Sigma', name: '40mm f/1.4 DG HSM Art', mount: 'Canon EF', focal_length: '40', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 1200, astro_recommended: true },
  { id: 'sigma-14-24-f28-dg-dn-art-sony', brand: 'Sigma', name: '14-24mm f/2.8 DG DN Art', mount: 'Sony E', focal_length: '14-24', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 795, astro_recommended: true },
  { id: 'sigma-14-24-f28-dg-dn-art-l', brand: 'Sigma', name: '14-24mm f/2.8 DG DN Art', mount: 'Leica L', focal_length: '14-24', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 795, astro_recommended: true },
  
  // Tamron Astro Lenses
  { id: 'tamron-15-30-f28-di-vc-usd-g2-canon', brand: 'Tamron', name: 'SP 15-30mm f/2.8 Di VC USD G2', mount: 'Canon EF', focal_length: '15-30', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: true, weight: 1110, astro_recommended: true },
  { id: 'tamron-15-30-f28-di-vc-usd-g2-nikon', brand: 'Tamron', name: 'SP 15-30mm f/2.8 Di VC USD G2', mount: 'Nikon F', focal_length: '15-30', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: true, weight: 1110, astro_recommended: true },
  { id: 'tamron-17-28-f28-di-iii-rxd-sony', brand: 'Tamron', name: '17-28mm f/2.8 Di III RXD', mount: 'Sony E', focal_length: '17-28', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 420, astro_recommended: true },
  { id: 'tamron-35-f14-di-usd-canon', brand: 'Tamron', name: 'SP 35mm f/1.4 Di USD', mount: 'Canon EF', focal_length: '35', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 805, astro_recommended: true },
  { id: 'tamron-35-f14-di-usd-nikon', brand: 'Tamron', name: 'SP 35mm f/1.4 Di USD', mount: 'Nikon F', focal_length: '35', max_aperture: 'f/1.4', type: 'prime', category: 'standard', is_stabilized: false, weight: 805, astro_recommended: true },
  
  // Tokina Astro Lenses
  { id: 'tokina-11-20-f28-atx-pro-dx-canon', brand: 'Tokina', name: 'AT-X 11-20mm f/2.8 PRO DX', mount: 'Canon EF', focal_length: '11-20', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 560, astro_recommended: true },
  { id: 'tokina-11-20-f28-atx-pro-dx-nikon', brand: 'Tokina', name: 'AT-X 11-20mm f/2.8 PRO DX', mount: 'Nikon F', focal_length: '11-20', max_aperture: 'f/2.8', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 560, astro_recommended: true },
  { id: 'tokina-14-20-f2-atx-pro-dx-canon', brand: 'Tokina', name: 'AT-X 14-20mm f/2 PRO DX', mount: 'Canon EF', focal_length: '14-20', max_aperture: 'f/2', type: 'zoom', category: 'wide-angle', is_stabilized: false, weight: 725, astro_recommended: true },
  
  // Irix Astro Lenses
  { id: 'irix-15-f24-firefly-canon', brand: 'Irix', name: '15mm f/2.4 Firefly', mount: 'Canon EF', focal_length: '15', max_aperture: 'f/2.4', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 410, astro_recommended: true },
  { id: 'irix-15-f24-firefly-nikon', brand: 'Irix', name: '15mm f/2.4 Firefly', mount: 'Nikon F', focal_length: '15', max_aperture: 'f/2.4', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 410, astro_recommended: true },
  { id: 'irix-11-f4-blackstone-canon', brand: 'Irix', name: '11mm f/4 Blackstone', mount: 'Canon EF', focal_length: '11', max_aperture: 'f/4', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 730, astro_recommended: true },
  { id: 'irix-11-f4-blackstone-nikon', brand: 'Irix', name: '11mm f/4 Blackstone', mount: 'Nikon F', focal_length: '11', max_aperture: 'f/4', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 730, astro_recommended: true },
  
  // Laowa Ultra-Wide Astro Lenses
  { id: 'laowa-9-f28-zero-d-sony', brand: 'Laowa', name: '9mm f/2.8 Zero-D', mount: 'Sony E', focal_length: '9', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 215, astro_recommended: true },
  { id: 'laowa-9-f28-zero-d-fuji', brand: 'Laowa', name: '9mm f/2.8 Zero-D', mount: 'Fujifilm X', focal_length: '9', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 215, astro_recommended: true },
  { id: 'laowa-12-f28-zero-d-canon', brand: 'Laowa', name: '12mm f/2.8 Zero-D', mount: 'Canon EF', focal_length: '12', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 609, astro_recommended: true },
  { id: 'laowa-12-f28-zero-d-nikon', brand: 'Laowa', name: '12mm f/2.8 Zero-D', mount: 'Nikon F', focal_length: '12', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 609, astro_recommended: true },
  { id: 'laowa-15-f2-zero-d-sony', brand: 'Laowa', name: '15mm f/2 Zero-D', mount: 'Sony E', focal_length: '15', max_aperture: 'f/2', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 500, astro_recommended: true },
  { id: 'laowa-17-f18-mft', brand: 'Laowa', name: '17mm f/1.8 MFT', mount: 'Micro Four Thirds', focal_length: '17', max_aperture: 'f/1.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 172, astro_recommended: true },
  
  // Zeiss Astro Lenses
  { id: 'zeiss-milvus-15-f28-canon', brand: 'Zeiss', name: 'Milvus 15mm f/2.8', mount: 'Canon EF', focal_length: '15', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 947, astro_recommended: true },
  { id: 'zeiss-milvus-15-f28-nikon', brand: 'Zeiss', name: 'Milvus 15mm f/2.8', mount: 'Nikon F', focal_length: '15', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 947, astro_recommended: true },
  { id: 'zeiss-batis-18-f28-sony', brand: 'Zeiss', name: 'Batis 18mm f/2.8', mount: 'Sony E', focal_length: '18', max_aperture: 'f/2.8', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 330, astro_recommended: true },
  { id: 'zeiss-batis-25-f2-sony', brand: 'Zeiss', name: 'Batis 25mm f/2', mount: 'Sony E', focal_length: '25', max_aperture: 'f/2', type: 'prime', category: 'wide-angle', is_stabilized: false, weight: 335, astro_recommended: true },
  
  // Venus Optics Specialty
  { id: 'venus-argus-35-f095-ff-canon', brand: 'Venus Optics', name: 'Argus 35mm f/0.95 FF', mount: 'Canon RF', focal_length: '35', max_aperture: 'f/0.95', type: 'prime', category: 'standard', is_stabilized: false, weight: 755, astro_recommended: true },
  { id: 'venus-argus-35-f095-ff-sony', brand: 'Venus Optics', name: 'Argus 35mm f/0.95 FF', mount: 'Sony E', focal_length: '35', max_aperture: 'f/0.95', type: 'prime', category: 'standard', is_stabilized: false, weight: 755, astro_recommended: true },
]; 