'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

const WeatherPage = () => {
  const router = useRouter();
  const { cityname } = router.query;  // Get city name from query string
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // Store weather data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityname) return;  // If no cityname, exit

    const fetchWeatherData = async () => {
      try {
        // Extract lat and lon from query params
        const { lat, lon } = router.query;

        if (!lat || !lon) {
          console.error('Missing lat or lon in query');
          return;
        }

        // Replace with your OpenWeatherMap API key
        const API_KEY = '61642988fe3968661f18e6e937ae0200';

        // OpenWeatherMap API call
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();
        
        // Set the weather data in state
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [cityname, router.query]);

  if (loading) return <p>Loading weather data...</p>;

  if (!weatherData) return <p>No weather data found for {cityname}</p>;

  const { main, weather, wind } = weatherData;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Weather in {cityname}</h1>
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl mb-4">{weather[0]?.description}</h2>
        <p className="text-lg mb-2">Temperature: {main.temp}°C</p>
        <p className="text-lg mb-2">Humidity: {main.humidity}%</p>
        <p className="text-lg mb-2">Wind Speed: {wind.speed} m/s</p>
        <p className="text-lg mb-2">Pressure: {main.pressure} hPa</p>
        {/* Optional: Display the weather icon */}
        <Image
          src={`https://openweathermap.org/img/wn/${weather[0]?.icon}.png`}
          alt={weather[0]?.description}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default WeatherPage;
