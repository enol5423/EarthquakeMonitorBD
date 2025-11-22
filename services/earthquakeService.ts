import { Earthquake } from '../types';

const CACHE_KEY = 'quake_monitor_usgs_cache';
const CACHE_TTL = 60 * 1000; // 1 minute cache (matches USGS update frequency)

export const fetchEarthquakeData = async (forceRefresh = false): Promise<{ data: Earthquake[]; sources: Array<{ title: string; uri: string }> }> => {
  // 1. Fast Path: Check Cache
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const age = Date.now() - cached.timestamp;
        if (age < CACHE_TTL) {
          return { data: cached.data, sources: cached.sources };
        }
      }
    } catch (e) {
      console.warn("Cache lookup failed", e);
    }
  }

  // 2. Fetch from USGS
  try {
    // Calculate date range: Last 365 days (1 year) to ensure we see history
    // USGS defaults to 30 days, which is why the list was short.
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 365);

    const params = new URLSearchParams({
      format: 'geojson',
      // Expanded bounding box to capture border regions (Assam, Tripura, Myanmar) that affect Bangladesh
      minlatitude: '19', 
      maxlatitude: '28',
      minlongitude: '87',
      maxlongitude: '94',
      orderby: 'time',
      limit: '100',
      starttime: startDate.toISOString()
    });

    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`USGS API Error: ${response.statusText}`);
    
    const json = await response.json();
    
    const data: Earthquake[] = json.features.map((feature: any) => {
      const date = new Date(feature.properties.time);
      return {
        id: feature.id,
        location: feature.properties.place || 'Unknown Location',
        magnitude: feature.properties.mag || 0,
        depth: `${feature.geometry.coordinates[2]} km`,
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: date.toLocaleDateString(),
        timestamp: feature.properties.time, // Raw timestamp for sorting
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        sourceUrl: feature.properties.url
      };
    });

    const sources = [{
      title: "USGS Earthquake Hazards Program",
      uri: "https://earthquake.usgs.gov/"
    }];

    // Update Cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data,
      sources
    }));

    return { data, sources };

  } catch (error) {
    console.error("USGS Fetch Error:", error);
    
    // Fallback to cache if available even if stale
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      return { data: cached.data, sources: cached.sources };
    }
    
    throw error;
  }
};