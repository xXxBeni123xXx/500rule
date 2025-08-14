import { Download, FileText, Share2, Calendar } from 'lucide-react';
import { Camera, Lens } from '../services/api';
import { formatShutterFraction } from '../utils/astro';

interface SessionData {
  camera: Camera | null;
  lens: Lens | null;
  focalLength: number;
  shutterSpeed: number | null;
  ruleConstant: number;
  trailRisk: string;
  conditions?: {
    weather?: {
      cloudCover: number;
      visibility: number;
      windSpeed: number;
    };
    moonPhase?: {
      phase: string;
      illumination: number;
    };
    aurora?: {
      kpIndex: number;
    };
  };
  recommendations?: string[];
}

interface SessionExportProps {
  sessionData: SessionData;
}

export function SessionExport({ sessionData }: SessionExportProps) {
  const generateTextExport = () => {
    const { camera, lens, focalLength, shutterSpeed, ruleConstant, trailRisk, conditions, recommendations } = sessionData;
    
    let text = '=== ASTROPHOTOGRAPHY SESSION PLAN ===\n';
    text += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    text += '📷 EQUIPMENT\n';
    text += `Camera: ${camera ? `${camera.brand} ${camera.name}` : 'Not selected'}\n`;
    text += `Sensor: ${camera ? camera.sensor_format : 'N/A'}\n`;
    text += `Crop Factor: ${camera ? camera.crop_factor : 'N/A'}\n`;
    text += `Lens: ${lens ? `${lens.brand} ${lens.name}` : 'Not selected'}\n`;
    text += `Focal Length: ${focalLength}mm\n\n`;
    
    text += '⏱️ EXPOSURE SETTINGS\n';
    text += `Rule Used: ${ruleConstant}-Rule\n`;
    text += `Max Shutter Speed: ${shutterSpeed ? formatShutterFraction(shutterSpeed) : 'N/A'}\n`;
    text += `Trail Risk: ${trailRisk}\n\n`;
    
    if (conditions) {
      text += '🌤️ CONDITIONS\n';
      if (conditions.weather) {
        text += `Cloud Cover: ${conditions.weather.cloudCover}%\n`;
        text += `Visibility: ${(conditions.weather.visibility / 1000).toFixed(1)}km\n`;
        text += `Wind Speed: ${conditions.weather.windSpeed}m/s\n`;
      }
      if (conditions.moonPhase) {
        text += `Moon Phase: ${conditions.moonPhase.phase}\n`;
        text += `Moon Illumination: ${conditions.moonPhase.illumination}%\n`;
      }
      if (conditions.aurora) {
        text += `Aurora KP Index: ${conditions.aurora.kpIndex}/9\n`;
      }
      text += '\n';
    }
    
    if (recommendations && recommendations.length > 0) {
      text += '💡 RECOMMENDATIONS\n';
      recommendations.forEach(rec => {
        text += `• ${rec}\n`;
      });
      text += '\n';
    }
    
    text += '📝 NOTES\n';
    text += '_________________________________\n';
    text += '_________________________________\n';
    text += '_________________________________\n';
    
    return text;
  };

  const generateJSON = () => {
    return JSON.stringify(sessionData, null, 2);
  };

  const generateICS = () => {
    const now = new Date();
    const startTime = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const endTime = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    
    let ics = 'BEGIN:VCALENDAR\n';
    ics += 'VERSION:2.0\n';
    ics += 'PRODID:-//500Rule Calculator//EN\n';
    ics += 'BEGIN:VEVENT\n';
    ics += `DTSTART:${startTime}\n`;
    ics += `DTEND:${endTime}\n`;
    ics += 'SUMMARY:Astrophotography Session\n';
    
    let description = 'Equipment: ';
    if (sessionData.camera && sessionData.lens) {
      description += `${sessionData.camera.brand} ${sessionData.camera.name} with ${sessionData.lens.brand} ${sessionData.lens.name} at ${sessionData.focalLength}mm. `;
    }
    description += `Max shutter: ${sessionData.shutterSpeed ? formatShutterFraction(sessionData.shutterSpeed) : 'N/A'}`;
    
    ics += `DESCRIPTION:${description}\n`;
    ics += 'END:VEVENT\n';
    ics += 'END:VCALENDAR\n';
    
    return ics;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTextExport = () => {
    const content = generateTextExport();
    const filename = `astro-session-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(content, filename, 'text/plain');
  };

  const handleJSONExport = () => {
    const content = generateJSON();
    const filename = `astro-session-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(content, filename, 'application/json');
  };

  const handleCalendarExport = () => {
    const content = generateICS();
    const filename = `astro-session-${new Date().toISOString().split('T')[0]}.ics`;
    downloadFile(content, filename, 'text/calendar');
  };

  const handleShare = async () => {
    const text = generateTextExport();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Astrophotography Session Plan',
          text: text
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Session plan copied to clipboard!');
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Export Session Plan</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={handleTextExport}
          className="flex flex-col items-center gap-2 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FileText className="w-6 h-6 text-blue-400" />
          <span className="text-sm">Text File</span>
        </button>
        
        <button
          onClick={handleJSONExport}
          className="flex flex-col items-center gap-2 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Download className="w-6 h-6 text-green-400" />
          <span className="text-sm">JSON Data</span>
        </button>
        
        <button
          onClick={handleCalendarExport}
          className="flex flex-col items-center gap-2 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Calendar className="w-6 h-6 text-purple-400" />
          <span className="text-sm">Calendar Event</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-2 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Share2 className="w-6 h-6 text-orange-400" />
          <span className="text-sm">Share</span>
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
        <p className="text-xs text-gray-400">
          Export your session plan to save your calculations, equipment settings, and conditions for future reference.
        </p>
      </div>
    </div>
  );
}