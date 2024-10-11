import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY 

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function WeatherDashboard() {
  const [city, setCity] = useState("");
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('weatherData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=${cityName}&units=metric`);
      if (!res.ok) throw new Error('City not found');
      const result = await res.json();
      setData(result);
      localStorage.setItem('weatherData', JSON.stringify(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    fetchWeatherData(city);
  };

  return (
    <div className="min-h-screen bg-purple-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input 
              className="w-full h-12 px-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all duration-300"
              placeholder="Enter City Name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button 
              type="submit"
              className="h-12 px-6 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all duration-300"
            >
              Search
            </button>
          </div>
        </form>
        
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
            </motion.div>
          )}
          
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.p>
          )}
          
          {data && !loading && (
            <motion.div
              key="data"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-4 text-center text-purple-800">{data.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex justify-center items-center">
                  <img 
                    src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    alt={data.weather[0].description}
                    className="w-24 h-24"
                  />
                  <div className="text-center">
                    <p className="text-5xl font-bold">{Math.round(data.main.temp)}°C</p>
                    <p className="text-xl capitalize">{data.weather[0].description}</p>
                  </div>
                </div>
                <div className="text-center p-2 bg-purple-100 rounded">
                  <p className="font-semibold">Feels Like</p>
                  <p>{Math.round(data.main.feels_like)}°C</p>
                </div>
                <div className="text-center p-2 bg-purple-100 rounded">
                  <p className="font-semibold">Humidity</p>
                  <p>{data.main.humidity}%</p>
                </div>
                <div className="text-center p-2 bg-purple-100 rounded">
                  <p className="font-semibold">Wind Speed</p>
                  <p>{data.wind.speed} m/s</p>
                </div>
                <div className="text-center p-2 bg-purple-100 rounded">
                  <p className="font-semibold">Pressure</p>
                  <p>{data.main.pressure} hPa</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}