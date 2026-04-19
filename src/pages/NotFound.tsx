import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type ZoneFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    zone: "safe" | "moderate" | "danger";
  };
};

const center: [number, number] = [12.9716, 77.5946];

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30]
});

function NotFound() {

  const [zones, setZones] = useState<ZoneFeature[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number]>(center);
  const [currentZone, setCurrentZone] = useState<string | null>(null);

  // Load zone data
  useEffect(() => {

    fetch("/bangalore_zones_ml.geojson")
      .then(res => res.json())
      .then(data => {
        setZones(data.features);
      })
      .catch(err => console.log("GeoJSON error:", err));

  }, []);

  // GPS tracking
  useEffect(() => {

    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition((pos) => {

      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setUserLocation([lat, lon]);

      checkZone(lat, lon);

    });

  }, [zones, currentZone]);;

  const getColor = (zone: string) => {

    if (zone === "safe") return "green";
    if (zone === "moderate") return "yellow";
    if (zone === "danger") return "red";

    return "blue";
  };

  function checkZone(lat: number, lon: number) {

    const userPoint = L.latLng(lat, lon);

    zones.forEach((z) => {

      const coords = z.geometry.coordinates;
      const zoneType = z.properties.zone;

      const zoneCenter = L.latLng(coords[1], coords[0]);

      const distance = userPoint.distanceTo(zoneCenter);

      if (distance <= 200) {

        if (currentZone !== zoneType) {

          setCurrentZone(zoneType);

          if (zoneType === "danger") alert("🚨 Danger Zone!");
          if (zoneType === "moderate") alert("⚠ Moderate Zone");
          if (zoneType === "safe") alert("✅ Safe Zone");

        }

      }

    });

  }

  return (

    <div style={{ height: "600px", width: "100%" }}>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
            />

          );

        })}

        <Marker position={userLocation} icon={markerIcon} />

      </MapContainer>

    </div>

  );
}

export default NotFound;