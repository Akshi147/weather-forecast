'use client';  // Ensure this file is treated as a client component

import React from 'react';

// Type definition for City
interface City {
  name: string;
  country: string;
  timezone: string;
}

interface CityTableProps {
  cities: City[];
  search: string;
}

const CityTable: React.FC<CityTableProps> = ({ cities, search }) => {
  // Filter cities based on the search term
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {filteredCities.length === 0 ? (
        <p>No cities found</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Timezone</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city) => (
              <tr key={city.name}>
                <td className="border px-4 py-2">{city.name}</td>
                <td className="border px-4 py-2">{city.country}</td>
                <td className="border px-4 py-2">{city.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CityTable;
