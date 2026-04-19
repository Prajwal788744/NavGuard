import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const center: [number, number] = [12.9716, 77.5946];

type ZoneFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    zone: "safe" | "moderate" | "danger";
  };
};

// Fallback zones if GeoJSON fails to load
const FALLBACK_ZONES: ZoneFeature[] = [
  {
    geometry: { coordinates: [77.5946, 12.9716] },
    properties: { zone: "safe" }
  },
  {
    geometry: { coordinates: [77.6, 12.97] },
    properties: { zone: "moderate" }
  },
  {
    geometry: { coordinates: [77.59, 12.98] },
    properties: { zone: "danger" }
  }
];

// draggable marker icon with fallback
const createIcon = (url: string) => {
  try {
    return new L.Icon({
      iconUrl: url,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  } catch {
    return L.icon({ iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png", iconSize: [25, 41] });
  }
};

const dragIcon = createIcon("https://cdn-icons-png.flaticon.com/512/64/64113.png");
const gpsIcon = createIcon("https://cdn-icons-png.flaticon.com/512/684/684908.png");

const GeofenceMap: React.FC = () => {

  const [zones, setZones] = useState<ZoneFeature[]>(FALLBACK_ZONES);
  const [userLocation, setUserLocation] = useState<[number, number]>(center);
  const [realLocation, setRealLocation] = useState<[number, number] | null>(null);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(0);

  // load zone data with error handling
  useEffect(() => {
    const loadZones = async () => {
      try {
        console.log("🗺️ Loading geofence zones from /bangalore_zones_ml.geojson");
        const response = await fetch("/bangalore_zones_ml.geojson");
        
        if (!response.ok) {
          throw new Error(`Failed to load zones: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("✅ GeoJSON loaded successfully:", data.features?.length, "zones found");
        
        if (data.features && Array.isArray(data.features)) {
          setZones(data.features);
          setError(null);
        } else {
          throw new Error("Invalid GeoJSON format");
        }
      } catch (err) {
        console.error("❌ GeoJSON error:", err);
        setError("Failed to load zone data, using fallback");
        setZones(FALLBACK_ZONES);
      }
    };
    
    loadZones();
  }, []);

  // checkZone function with useCallback
  const checkZone = useCallback((lat: number, lon: number) => {
    const userPoint = L.latLng(lat, lon);
    zones.forEach((z) => {
      const coords = z.geometry.coordinates;
      const zoneType = z.properties.zone;
      const centerPoint = L.latLng(coords[1], coords[0]);
      const distance = userPoint.distanceTo(centerPoint);
      const radius = 200;

      if (distance <= radius) {
        if (currentZone !== zoneType) {
          setCurrentZone(zoneType);
          if (zoneType === "danger") alert("🚨 Danger Zone!");
          if (zoneType === "moderate") alert("⚠ Moderate Risk Area");
          if (zoneType === "safe") alert("✅ Safe Zone");
        }
      }
    });
  }, [zones, currentZone]);

  // real GPS tracking with error handling
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setRealLocation([lat, lon]);
        checkZone(lat, lon);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setError("Location access denied or unavailable");
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [checkZone]);

  const getColor = (zone: string) => {
    if (zone === "safe") return "green";
    if (zone === "moderate") return "yellow";
    if (zone === "danger") return "red";
    return "blue";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (e: any) => {
    try {
      const pos = e.target.getLatLng();
      const lat = pos.lat;
      const lon = pos.lng;
      setUserLocation([lat, lon]);
      checkZone(lat, lon);

      if (realLocation) {
        const user = L.latLng(lat, lon);
        const real = L.latLng(realLocation[0], realLocation[1]);
        if (user.distanceTo(real) < 50) {
          alert("📍 You are at your current location");
        }
      }
    } catch (err) {
      console.error("Drag error:", err);
    }
  };

  return (
    <div className="glass-card glow-border p-4 w-full rounded-lg overflow-hidden">
      <h3 className="font-bold text-guard-green mb-4">Geofence Map</h3>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-2 rounded mb-4 text-sm">
          ⚠️ {error} (Using fallback zones)
        </div>
      )}

      {zones.length === 0 ? (
        <div className="flex items-center justify-center h-[500px] bg-slate-900 rounded-lg text-muted-foreground">
          Loading map...
        </div>
      ) : (
        <div className="w-full bg-slate-900 rounded-lg overflow-hidden" style={{ height: "550px" }}>
          <MapContainer
            key={mapKey}
            center={center}
            zoom={12}
            className="w-full h-full"
          >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

          {zones.map((z, i) => {
            const coords = z.geometry.coordinates;
            const zoneType = z.properties.zone;
            return (
              <Circle
                key={i}
                center={[coords[1], coords[0]]}
                radius={200}
                pathOptions={{
                  color: getColor(zoneType),
                  fillColor: getColor(zoneType),
                  fillOpacity: 0.4
                }}
              >
                <Popup>{zoneType.toUpperCase()}</Popup>
              </Circle>
            );
          })}

          <Marker
            position={userLocation}
            draggable={true}
            icon={dragIcon}
            eventHandlers={{ dragend: handleDragEnd }}
          >
            <Popup>Draggable Position</Popup>
          </Marker>

          {realLocation && (
            <Marker position={realLocation} icon={gpsIcon}>
              <Popup>Current Location</Popup>
            </Marker>
          )}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default GeofenceMap;