import React, { useEffect, useState } from "react";
import { Cloud, Thermometer, Wind, Droplets, AlertCircle } from "lucide-react";

type WeatherData = {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
};

// Use environment variable or fallback
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "f44415c1dabcdaef4f14e664eee1ebed";

const WeatherModule: React.FC = () => {

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Fetch weather data
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
        )
          .then(res => {
            if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
            return res.json();
          })
          .then(data => {
            try {
              setWeather({
                temp: Math.round(data.main.temp),
                condition: data.weather[0]?.main || "Unknown",
                humidity: data.main.humidity || 0,
                wind: (data.wind.speed || 0).toFixed(1)
              });
              setError(null);
            } catch (err) {
              setError("Invalid weather data received");
              console.error("Weather data error:", err);
            }
          })
          .catch(err => {
            setError(`Failed to fetch weather: ${err.message}`);
            console.error("Weather fetch error:", err);
          })
          .finally(() => setLoading(false));
      },
      (err) => {
        setError(`Location access denied: ${err.message}`);
        setLoading(false);
        console.warn("Geolocation error:", err);
      }
    );
  }, []);

  return (

    <div className="glass-card glow-border p-6 space-y-4">

      <div className="flex items-center gap-2">
        <Cloud className="text-guard-green" size={24}/>
        <h3 className="font-bold">Weather Information</h3>
      </div>

      {loading && !weather && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          Fetching real-time weather...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 text-red-500 p-3 rounded text-sm">
          <AlertCircle size={16}/>
          {error}
        </div>
      )}

      {weather && (

        <div className="space-y-2 text-sm">

          <div className="flex gap-2 items-center">
            <Thermometer size={18}/>
            Temperature: {weather.temp} °C
          </div>

          <div className="flex gap-2 items-center">
            <Cloud size={18}/>
            Condition: {weather.condition}
          </div>

          <div className="flex gap-2 items-center">
            <Droplets size={18}/>
            Humidity: {weather.humidity} %
          </div>

          <div className="flex gap-2 items-center">
            <Wind size={18}/>
            Wind Speed: {weather.wind} m/s
          </div>

        </div>

      )}

    </div>

  );
};

export default WeatherModule;
