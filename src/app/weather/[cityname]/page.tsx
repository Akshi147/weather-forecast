'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
// import Image from 'next/image';

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
  const params = useParams();
  const searchParams = useSearchParams();

  const cityname = decodeURIComponent(params.cityname as string);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lon) {
      console.error('Latitude and longitude are required.');
      return;
    }

    const fetchWeatherData = async () => {
      try {
        const API_KEY = '61642988fe3968661f18e6e937ae0200';
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [lat, lon]);

  if (loading) return <p>Loading weather data...</p>;
  if (!weatherData) return <p>No weather data found for {cityname}</p>;

  const { main, weather, wind } = weatherData;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Weather in {cityname}</h1>
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl mb-4 capitalize">{weather[0]?.description}</h2>
        <p className="text-lg mb-2">Temperature: {main.temp}°C</p>
        <p className="text-lg mb-2">Humidity: {main.humidity}%</p>
        <p className="text-lg mb-2">Wind Speed: {wind.speed} m/s</p>
        <p className="text-lg mb-2">Pressure: {main.pressure} hPa</p>
        {/* <Image
          src={`https://openweathermap.org/img/wn/${weather[0]?.icon}.png`}
          alt={weather[0]?.description}
          width={80}
          height={80}
          className="mt-4 inline-block"
        /> */}
      </div>
    </div>
  );
};

export default WeatherPage;
