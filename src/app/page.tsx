'use client';  // Ensure this file is treated as a client component

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CityTable from '../components/cityTable';

// Type definition for City
interface City {
  name: string;
  country: string;
  timezone: string;
}

// Fetch function for cities data
const fetchCities = async (): Promise<City[]> => {
  const res = await fetch('https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/api/?disjunctive.cou_name_en&sort=name');
  const data = await res.json();

  // Sanitize response to ensure it's an array of plain objects
  const sanitizedData = Array.isArray(data) ? data : [];
  return sanitizedData;
};

const Home = () => {
  const [search, setSearch] = useState('');

  // Fetch cities data using React Query
  const { data: cities, isLoading, isError } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });

  // Loading state
  if (isLoading) return <p>Loading...</p>;

  // Error state
  if (isError) return <p>Error fetching data</p>;

  // Default empty array if cities is undefined
  const cityData = cities || [];

  return (
    <div>
      <input
        type="text"
        placeholder="Search cities"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4"
      />
      <CityTable cities={cityData} search={search} />
    </div>
  );
};

export default Home;
