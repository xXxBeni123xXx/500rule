import { useState, useEffect } from 'react';
import { Lightbulb, AlertCircle, CheckCircle, Info, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartTipsProps {
  focalLength?: number;
  cropFactor?: number;
  currentCamera?: string;
  currentLens?: string;
  maxShutter?: number | null;
  trailRisk?: string | null;
  weatherConditions?: any;
  moonPhase?: any;
  location?: { lat: number; lng: number };
}

interface Tip {
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  message: string;
  priority: number;
}

export function SmartTips({ 
  focalLength, 
  cropFactor, 
  currentCamera,
  currentLens,
  maxShutter,
  trailRisk,
  weatherConditions,
  moonPhase,
  location
}: SmartTipsProps) {
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    generateTips();
  }, [focalLength, cropFactor, currentCamera, currentLens, maxShutter, trailRisk, weatherConditions, moonPhase]);

  const generateTips = () => {
    const newTips: Tip[] = [];

    // Camera-specific tips
    if (currentCamera) {
      if (cropFactor && cropFactor > 1.5) {
        newTips.push({
          type: 'info',
          title: 'Crop Sensor Advantage',
          message: 'Your crop sensor gives you extra reach for capturing distant objects like galaxies and nebulae. Consider this advantage when choosing targets.',
          priority: 3
        });
      }
      
      if (currentCamera.toLowerCase().includes('sony') || currentCamera.toLowerCase().includes('nikon')) {
        newTips.push({
          type: 'tip',
          title: 'Star Eater Algorithm',
          message: 'Some Sony and Nikon cameras apply noise reduction that can remove stars. Disable "Long Exposure NR" in camera settings for best results.',
          priority: 2
        });
      }
    }

    // Lens-specific tips
    if (focalLength) {
      if (focalLength < 24) {
        newTips.push({
          type: 'success',
          title: 'Ultra-Wide Excellence',
          message: 'Perfect focal length for capturing the Milky Way core! Try landscape astrophotography with foreground elements.',
          priority: 1
        });
      } else if (focalLength >= 24 && focalLength <= 50) {
        newTips.push({
          type: 'info',
          title: 'Versatile Focal Length',
          message: 'Great for constellation photography and medium-wide Milky Way shots. Consider focus stacking for sharp stars edge-to-edge.',
          priority: 2
        });
      } else if (focalLength > 85) {
        newTips.push({
          type: 'warning',
          title: 'Telephoto Challenges',
          message: `At ${focalLength}mm, you'll need very short exposures (${maxShutter?.toFixed(1)}s). Consider using a star tracker for better results.`,
          priority: 1
        });
      }

      // Aperture tips
      if (currentLens) {
        if (currentLens.includes('1.4') || currentLens.includes('1.8')) {
          newTips.push({
            type: 'tip',
            title: 'Fast Aperture Advantage',
            message: 'Your fast lens is excellent for astrophotography! Consider stopping down to f/2.8 for sharper corners while maintaining good light gathering.',
            priority: 2
          });
        }
        
        if (currentLens.toLowerCase().includes('zoom')) {
          newTips.push({
            type: 'info',
            title: 'Zoom Lens Tip',
            message: 'Zoom lenses often have more vignetting and distortion. Consider shooting at intermediate focal lengths for best optical quality.',
            priority: 3
          });
        }
      }
    }

    // Exposure time tips
    if (maxShutter) {
      if (maxShutter < 2) {
        newTips.push({
          type: 'warning',
          title: 'Very Short Exposure',
          message: 'Your exposure time is very limited. Increase ISO to 3200-6400 or consider a star tracker for longer exposures.',
          priority: 1
        });
      } else if (maxShutter > 20) {
        newTips.push({
          type: 'success',
          title: 'Long Exposure Possible',
          message: 'You can use longer exposures! This allows for lower ISO values (1600-3200) resulting in less noise.',
          priority: 2
        });
      }

      // ISO recommendations based on exposure time
      const recommendedISO = maxShutter > 10 ? '1600-3200' : 
                             maxShutter > 5 ? '3200-6400' : 
                             '6400-12800';
      newTips.push({
        type: 'info',
        title: 'Recommended ISO',
        message: `For ${maxShutter.toFixed(1)}s exposures, use ISO ${recommendedISO} as a starting point. Adjust based on sky brightness.`,
        priority: 3
      });
    }

    // Trail risk tips
    if (trailRisk) {
      if (trailRisk === 'high') {
        newTips.push({
          type: 'warning',
          title: 'High Trail Risk',
          message: 'Star trails are likely at this focal length. Use the NPF rule for more accurate calculations or invest in a star tracker.',
          priority: 1
        });
      } else if (trailRisk === 'low') {
        newTips.push({
          type: 'success',
          title: 'Low Trail Risk',
          message: 'Excellent setup for pinpoint stars! You can confidently use the calculated exposure time.',
          priority: 3
        });
      }
    }

    // Weather condition tips
    if (weatherConditions) {
      if (weatherConditions.cloudCover > 30) {
        newTips.push({
          type: 'warning',
          title: 'Cloud Cover Alert',
          message: `${weatherConditions.cloudCover}% cloud cover detected. Consider waiting for clearer skies or focus on bright targets like the Moon or planets.`,
          priority: 1
        });
      }
      
      if (weatherConditions.humidity > 80) {
        newTips.push({
          type: 'warning',
          title: 'High Humidity',
          message: 'High humidity can cause lens fogging. Use a lens heater or dew shield to prevent condensation.',
          priority: 2
        });
      }
    }

    // Moon phase tips
    if (moonPhase) {
      if (moonPhase.illumination > 50) {
        newTips.push({
          type: 'info',
          title: 'Bright Moon',
          message: `${moonPhase.illumination}% moon illumination. Best for lunar photography or use narrowband filters for deep-sky objects.`,
          priority: 2
        });
      } else if (moonPhase.illumination < 20) {
        newTips.push({
          type: 'success',
          title: 'Dark Skies',
          message: 'Excellent moon phase for deep-sky astrophotography! Take advantage of these dark skies.',
          priority: 2
        });
      }
    }

    // General best practices
    newTips.push({
      type: 'tip',
      title: 'Focus Tip',
      message: 'Use live view at 10x magnification on a bright star. Turn the focus ring slowly until the star is smallest and sharpest.',
      priority: 4
    });

    newTips.push({
      type: 'tip',
      title: 'Test Shot Strategy',
      message: 'Take a 5-second test shot at ISO 6400 to check composition and focus before your final exposures.',
      priority: 4
    });

    // Sort by priority
    newTips.sort((a, b) => a.priority - b.priority);
    setTips(newTips.slice(0, 8)); // Show top 8 tips
  };

  const getIcon = (type: Tip['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-purple-400" />;
    }
  };

  const getColorClass = (type: Tip['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-400/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-400/30';
      case 'info':
        return 'bg-blue-500/10 border-blue-400/30';
      case 'tip':
        return 'bg-purple-500/10 border-purple-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <Star className="h-6 w-6 text-yellow-400" />
        <h2 className="text-xl font-semibold text-white">Smart Tips & Recommendations</h2>
      </div>

      <div className="space-y-3">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-lg border ${getColorClass(tip.type)}`}
          >
            <div className="flex items-start gap-3">
              {getIcon(tip.type)}
              <div className="flex-1">
                <div className="font-medium text-sm text-white mb-1">{tip.title}</div>
                <div className="text-xs text-slate-300">{tip.message}</div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Quick Reference */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Quick Reference</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Polaris (North Star):</span>
              <span className="text-slate-200 ml-1">Use for alignment</span>
            </div>
            <div>
              <span className="text-slate-400">Best Time:</span>
              <span className="text-slate-200 ml-1">2 hours after sunset</span>
            </div>
            <div>
              <span className="text-slate-400">File Format:</span>
              <span className="text-slate-200 ml-1">Always shoot RAW</span>
            </div>
            <div>
              <span className="text-slate-400">White Balance:</span>
              <span className="text-slate-200 ml-1">3200-4000K</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
