// This service is deprecated in favor of earthquakeService.ts (USGS API)
// Keeping file placeholder to avoid import errors during transition if referenced elsewhere.

export const fetchEarthquakeData = async () => {
  console.warn("Gemini service is deprecated. Use earthquakeService.");
  return { data: [], sources: [] };
};