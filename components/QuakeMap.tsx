import React, { useEffect, useRef } from 'react';
import { Earthquake } from '../types';

// Type declaration for global Leaflet object since we are using CDN
declare global {
  interface Window {
    L: any;
  }
}

interface QuakeMapProps {
  data: Earthquake[];
}

export const QuakeMap: React.FC<QuakeMapProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  // Track markers by ID to prevent re-rendering the whole map on every update
  const markersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize Map if not already done
    if (!mapInstance.current) {
      // Center roughly on Bangladesh
      mapInstance.current = window.L.map(mapRef.current, {
        zoomControl: false
      }).setView([23.6850, 90.3563], 6);

      // Add Zoom Control to top-right
      window.L.control.zoom({
        position: 'topright'
      }).addTo(mapInstance.current);

      // Dark Matter Tiles
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstance.current);
    }

    const markersMap = markersRef.current;
    const activeIds = new Set<string>();

    // --- Diffing Logic for Real-time Updates ---
    
    // 1. Add new markers or update existing ones
    data.forEach(quake => {
      if (!quake.lat || !quake.lon) return;
      
      activeIds.add(quake.id);

      if (!markersMap.has(quake.id)) {
        // New Marker - Add with 'quake-marker-new' class for animation
        const color = quake.magnitude >= 5 ? '#ef4444' : quake.magnitude >= 4 ? '#f97316' : '#3b82f6';
        const radius = Math.max(quake.magnitude * 3, 5); // Minimum visible size

        const marker = window.L.circleMarker([quake.lat, quake.lon], {
          radius: radius,
          fillColor: color,
          color: '#fff',
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6,
          className: 'quake-marker-new' // Triggers CSS animation in index.html
        })
        .bindPopup(`
          <div class="font-sans text-sm min-w-[150px]">
            <h3 class="font-bold text-slate-200 border-b border-slate-600 pb-1 mb-2">${quake.location}</h3>
            <div class="space-y-1.5 text-slate-300">
              <div class="flex justify-between items-center gap-4">
                <span class="text-slate-500 text-xs uppercase font-semibold">Magnitude</span>
                <span class="font-bold ${quake.magnitude >= 4 ? 'text-orange-400' : 'text-blue-400'} text-base">${quake.magnitude.toFixed(1)}</span>
              </div>
              <div class="flex justify-between items-center gap-4">
                <span class="text-slate-500 text-xs uppercase font-semibold">Depth</span>
                <span>${quake.depth}</span>
              </div>
              <div class="flex justify-between items-center gap-4">
                <span class="text-slate-500 text-xs uppercase font-semibold">Time</span>
                <span>${quake.time}</span>
              </div>
               <div class="flex justify-between items-center gap-4">
                <span class="text-slate-500 text-xs uppercase font-semibold">Date</span>
                <span>${quake.date}</span>
              </div>
            </div>
          </div>
        `);

        marker.addTo(mapInstance.current);
        markersMap.set(quake.id, marker);
      } else {
        // Existing marker - Logic to handle updates if needed (e.g. magnitude change)
        // For this app, we assume ID is immutable for a specific event version.
      }
    });

    // 2. Remove old markers that are no longer in the dataset (e.g. filtered out or older than window)
    for (const [id, marker] of markersMap.entries()) {
      if (!activeIds.has(id)) {
        mapInstance.current.removeLayer(marker);
        markersMap.delete(id);
      }
    }

  }, [data]);

  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-slate-800 group">
        <div ref={mapRef} className="w-full h-full z-0" />
        
        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-3 rounded-lg z-[400] text-xs space-y-2 shadow-lg transition-opacity opacity-70 group-hover:opacity-100">
           <div className="font-bold text-slate-300 mb-1">Magnitude</div>
           <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-red-500/80 border border-white/50"></span>
             <span className="text-slate-400">5.0+ (High)</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-orange-500/80 border border-white/50"></span>
             <span className="text-slate-400">4.0 - 4.9 (Mod)</span>
           </div>
           <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-blue-500/80 border border-white/50"></span>
             <span className="text-slate-400">&lt; 4.0 (Minor)</span>
           </div>
        </div>
    </div>
  );
};