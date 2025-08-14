import axios from 'axios';

// Astronomy service for celestial calculations and events
class AstronomyService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60 * 60 * 1000; // 1 hour
  }

  // Get sunrise and sunset times
  async getSunTimes(lat, lon, date = new Date()) {
    const cacheKey = `sun_${lat}_${lon}_${date.toDateString()}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Use sunrise-sunset.org API (free, no key required)
      const response = await axios.get('https://api.sunrise-sunset.org/json', {
        params: {
          lat,
          lng: lon,
          date: date.toISOString().split('T')[0],
          formatted: 0
        }
      });

      const sunData = this.processSunData(response.data.results, lat, lon);
      
      this.cache.set(cacheKey, {
        data: sunData,
        timestamp: Date.now()
      });

      return sunData;
    } catch (error) {
      console.error('Sunrise/sunset API error:', error);
      return this.calculateSunTimes(lat, lon, date);
    }
  }

  processSunData(data, lat, lon) {
    const times = {
      sunrise: new Date(data.sunrise),
      sunset: new Date(data.sunset),
      solarNoon: new Date(data.solar_noon),
      dayLength: data.day_length,
      civilTwilightBegin: new Date(data.civil_twilight_begin),
      civilTwilightEnd: new Date(data.civil_twilight_end),
      nauticalTwilightBegin: new Date(data.nautical_twilight_begin),
      nauticalTwilightEnd: new Date(data.nautical_twilight_end),
      astronomicalTwilightBegin: new Date(data.astronomical_twilight_begin),
      astronomicalTwilightEnd: new Date(data.astronomical_twilight_end)
    };

    // Calculate golden hour and blue hour
    const goldenHourMorning = new Date(times.sunrise);
    goldenHourMorning.setHours(goldenHourMorning.getHours() + 1);
    
    const goldenHourEvening = new Date(times.sunset);
    goldenHourEvening.setHours(goldenHourEvening.getHours() - 1);

    return {
      location: { lat, lon },
      sun: {
        ...times,
        goldenHour: {
          morning: {
            start: times.sunrise,
            end: goldenHourMorning
          },
          evening: {
            start: goldenHourEvening,
            end: times.sunset
          }
        },
        blueHour: {
          morning: {
            start: times.nauticalTwilightBegin,
            end: times.civilTwilightBegin
          },
          evening: {
            start: times.civilTwilightEnd,
            end: times.nauticalTwilightEnd
          }
        }
      },
      darkness: {
        astronomicalDarkness: {
          evening: times.astronomicalTwilightEnd,
          morning: times.astronomicalTwilightBegin
        },
        duration: this.calculateDarknessDuration(
          times.astronomicalTwilightEnd,
          times.astronomicalTwilightBegin
        )
      }
    };
  }

  // Calculate sun times manually using astronomical formulas
  calculateSunTimes(lat, lon, date = new Date()) {
    const julianDate = this.getJulianDate(date);
    const n = julianDate - 2451545.0;
    
    // Mean solar noon
    const J = n - lon / 360;
    
    // Solar mean anomaly
    const M = (357.5291 + 0.98560028 * J) % 360;
    
    // Equation of center
    const C = 1.9148 * Math.sin(M * Math.PI / 180) +
              0.0200 * Math.sin(2 * M * Math.PI / 180) +
              0.0003 * Math.sin(3 * M * Math.PI / 180);
    
    // Ecliptic longitude
    const λ = (M + C + 180 + 102.9372) % 360;
    
    // Solar transit
    const Jtransit = 2451545.0 + J + 0.0053 * Math.sin(M * Math.PI / 180) -
                     0.0069 * Math.sin(2 * λ * Math.PI / 180);
    
    // Declination of the Sun
    const δ = Math.asin(Math.sin(λ * Math.PI / 180) * Math.sin(23.44 * Math.PI / 180));
    
    // Hour angle
    const ω = Math.acos(-Math.tan(lat * Math.PI / 180) * Math.tan(δ));
    
    // Calculate times
    const Jrise = Jtransit - ω * 180 / Math.PI / 360;
    const Jset = Jtransit + ω * 180 / Math.PI / 360;
    
    const sunrise = this.julianToDate(Jrise);
    const sunset = this.julianToDate(Jset);
    const solarNoon = this.julianToDate(Jtransit);
    
    // Approximate twilight times
    const civilOffset = 6 * Math.PI / 180;
    const nauticalOffset = 12 * Math.PI / 180;
    const astronomicalOffset = 18 * Math.PI / 180;
    
    return {
      location: { lat, lon },
      sun: {
        sunrise,
        sunset,
        solarNoon,
        dayLength: (Jset - Jrise) * 24 * 60 * 60,
        civilTwilightBegin: new Date(sunrise.getTime() - 30 * 60000),
        civilTwilightEnd: new Date(sunset.getTime() + 30 * 60000),
        nauticalTwilightBegin: new Date(sunrise.getTime() - 60 * 60000),
        nauticalTwilightEnd: new Date(sunset.getTime() + 60 * 60000),
        astronomicalTwilightBegin: new Date(sunrise.getTime() - 90 * 60000),
        astronomicalTwilightEnd: new Date(sunset.getTime() + 90 * 60000)
      }
    };
  }

  getJulianDate(date) {
    const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
    const y = date.getFullYear() + 4800 - a;
    const m = (date.getMonth() + 1) + 12 * a - 3;
    
    return date.getDate() + Math.floor((153 * m + 2) / 5) +
           365 * y + Math.floor(y / 4) - Math.floor(y / 100) +
           Math.floor(y / 400) - 32045 +
           (date.getHours() - 12) / 24 +
           date.getMinutes() / 1440 +
           date.getSeconds() / 86400;
  }

  julianToDate(julian) {
    const milliseconds = (julian - 2440587.5) * 86400000;
    return new Date(milliseconds);
  }

  calculateDarknessDuration(eveningEnd, morningBegin) {
    const endTime = new Date(eveningEnd);
    const startTime = new Date(morningBegin);
    
    // If morning is before evening, add a day
    if (startTime < endTime) {
      startTime.setDate(startTime.getDate() + 1);
    }
    
    const duration = startTime - endTime;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    
    return {
      milliseconds: duration,
      hours,
      minutes,
      formatted: `${hours}h ${minutes}m`
    };
  }

  // Get moon data and phase
  async getMoonData(date = new Date()) {
    const moonAge = this.getMoonAge(date);
    const phase = this.getMoonPhaseFromAge(moonAge);
    const illumination = this.getMoonIllumination(moonAge);
    const nextNewMoon = this.getNextNewMoon(date);
    const nextFullMoon = this.getNextFullMoon(date);
    
    return {
      age: moonAge,
      phase: phase,
      illumination: illumination,
      description: this.getMoonPhaseDescription(phase),
      nextNewMoon: nextNewMoon,
      nextFullMoon: nextFullMoon,
      bestDarkSkyDates: this.getBestDarkSkyDates(date)
    };
  }

  getMoonAge(date) {
    // Calculate moon age in days since last new moon
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simplified calculation
    let age = (year - 2000) * 12.368 + month + day / 30;
    age = age % 29.53;
    
    return Math.round(age * 10) / 10;
  }

  getMoonPhaseFromAge(age) {
    if (age < 1.84) return 'new';
    if (age < 5.53) return 'waxing_crescent';
    if (age < 9.22) return 'first_quarter';
    if (age < 12.91) return 'waxing_gibbous';
    if (age < 16.60) return 'full';
    if (age < 20.29) return 'waning_gibbous';
    if (age < 23.98) return 'last_quarter';
    if (age < 27.67) return 'waning_crescent';
    return 'new';
  }

  getMoonIllumination(age) {
    // Calculate illumination percentage based on moon age
    const phase = (age / 29.53) * 2 * Math.PI;
    const illumination = (1 - Math.cos(phase)) / 2 * 100;
    return Math.round(illumination);
  }

  getMoonPhaseDescription(phase) {
    const descriptions = {
      'new': 'New Moon - Best for deep sky photography',
      'waxing_crescent': 'Waxing Crescent - Good for most targets',
      'first_quarter': 'First Quarter - Moderate moonlight',
      'waxing_gibbous': 'Waxing Gibbous - Bright moonlight',
      'full': 'Full Moon - Challenging for deep sky',
      'waning_gibbous': 'Waning Gibbous - Bright moonlight',
      'last_quarter': 'Last Quarter - Moderate moonlight',
      'waning_crescent': 'Waning Crescent - Good for most targets'
    };
    return descriptions[phase] || 'Unknown phase';
  }

  getNextNewMoon(date) {
    const moonAge = this.getMoonAge(date);
    const daysToNew = 29.53 - moonAge;
    const nextNew = new Date(date);
    nextNew.setDate(nextNew.getDate() + Math.round(daysToNew));
    return nextNew;
  }

  getNextFullMoon(date) {
    const moonAge = this.getMoonAge(date);
    let daysToFull = 14.77 - moonAge;
    if (daysToFull < 0) daysToFull += 29.53;
    const nextFull = new Date(date);
    nextFull.setDate(nextFull.getDate() + Math.round(daysToFull));
    return nextFull;
  }

  getBestDarkSkyDates(startDate) {
    const dates = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 30; i++) {
      const moonAge = this.getMoonAge(current);
      const illumination = this.getMoonIllumination(moonAge);
      
      if (illumination < 30) {
        dates.push({
          date: new Date(current),
          moonIllumination: illumination,
          quality: illumination < 10 ? 'Excellent' : 'Good'
        });
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }

  // Get upcoming celestial events
  async getCelestialEvents(lat, lon, days = 30) {
    const events = [];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    // Add moon phases
    const nextNew = this.getNextNewMoon(startDate);
    if (nextNew <= endDate) {
      events.push({
        date: nextNew,
        type: 'moon_phase',
        name: 'New Moon',
        description: 'Best conditions for deep sky astrophotography',
        importance: 'high'
      });
    }
    
    const nextFull = this.getNextFullMoon(startDate);
    if (nextFull <= endDate) {
      events.push({
        date: nextFull,
        type: 'moon_phase',
        name: 'Full Moon',
        description: 'Bright moonlight, best for lunar photography',
        importance: 'medium'
      });
    }
    
    // Add meteor showers (simplified, would need a proper database)
    const meteorShowers = this.getUpcomingMeteorShowers(startDate, endDate);
    events.push(...meteorShowers);
    
    // Add planetary events
    const planetaryEvents = this.getUpcomingPlanetaryEvents(startDate, endDate);
    events.push(...planetaryEvents);
    
    // Sort by date
    events.sort((a, b) => a.date - b.date);
    
    return events;
  }

  getUpcomingMeteorShowers(startDate, endDate) {
    // Major annual meteor showers (simplified)
    const showers = [
      { name: 'Quadrantids', peak: { month: 0, day: 3 }, rate: 120 },
      { name: 'Lyrids', peak: { month: 3, day: 22 }, rate: 18 },
      { name: 'Eta Aquarids', peak: { month: 4, day: 6 }, rate: 60 },
      { name: 'Perseids', peak: { month: 7, day: 12 }, rate: 100 },
      { name: 'Orionids', peak: { month: 9, day: 21 }, rate: 20 },
      { name: 'Leonids', peak: { month: 10, day: 17 }, rate: 15 },
      { name: 'Geminids', peak: { month: 11, day: 14 }, rate: 120 }
    ];
    
    const events = [];
    const year = startDate.getFullYear();
    
    showers.forEach(shower => {
      const peakDate = new Date(year, shower.peak.month, shower.peak.day);
      
      // Check if next year's shower is closer
      if (peakDate < startDate) {
        peakDate.setFullYear(year + 1);
      }
      
      if (peakDate >= startDate && peakDate <= endDate) {
        events.push({
          date: peakDate,
          type: 'meteor_shower',
          name: `${shower.name} Meteor Shower Peak`,
          description: `Peak rate: ~${shower.rate} meteors/hour`,
          importance: shower.rate > 50 ? 'high' : 'medium'
        });
      }
    });
    
    return events;
  }

  getUpcomingPlanetaryEvents(startDate, endDate) {
    // Simplified planetary events
    const events = [];
    
    // This would need ephemeris data for accurate calculations
    // For now, return empty array or mock data
    
    return events;
  }

  // Calculate NPF (Night Photography Formula) rule
  calculateNPFRule(aperture, pixelPitch, focalLength, declination = 0) {
    // NPF Rule: (35 × aperture + 30 × pixel pitch) ÷ focal length
    // More accurate than 500 rule for modern high-resolution sensors
    
    const npfBase = (35 * aperture + 30 * pixelPitch) / focalLength;
    
    // Adjust for declination (optional)
    const declinationFactor = Math.cos(declination * Math.PI / 180);
    
    return {
      shutterSpeed: npfBase * declinationFactor,
      formula: 'NPF',
      factors: {
        aperture,
        pixelPitch,
        focalLength,
        declination
      }
    };
  }

  // Calculate pixel pitch from sensor size and resolution
  calculatePixelPitch(sensorWidth, sensorHeight, megapixels) {
    const totalPixels = megapixels * 1000000;
    const aspectRatio = sensorWidth / sensorHeight;
    const pixelsHeight = Math.sqrt(totalPixels / aspectRatio);
    const pixelsWidth = pixelsHeight * aspectRatio;
    
    const pixelPitch = (sensorWidth / pixelsWidth) * 1000; // Convert to micrometers
    
    return Math.round(pixelPitch * 100) / 100;
  }
}

export default new AstronomyService();