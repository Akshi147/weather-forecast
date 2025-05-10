'use-client';
import React from 'react';

interface CityTableProps {
  cities: { name: string; country: string; timezone: string }[];
  search: string;
}

const CityTable = ({ cities, search }: CityTableProps) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="mt-px min-w-full bg-gray-100 table-auto border-collapse border border-black">
        <thead>
          <tr className="bg-gray-100 text-lg font-semibold text-left">
            <th className="py-px border border-black">City</th>
            <th className="py-px border border-black">Country</th>
            <th className="py-px border border-black">TimeZone</th>
          </tr>
        </thead>
        <tbody>
          {cities.length > 0 ? (
            cities
            .filter((city) => city.name.toLowerCase().includes(search.toLowerCase()))
            .map((city, index) => (
              <tr key={index} className="bg-gray-200">
                <td className="border border-black px-4 py-2">{city.name.normalize("NFD").replace(/\p{Diacritic}/gu, '').replace(/[\u2018\u2019\u201A\u201B\u2039\u203A]/g, " ")}</td>
                <td className="px-4 py-2 border border-black">{city.country}</td>
                <td className="px-4 py-2 border border-black">{city.timezone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-4 py-2 text-center text-gray-500">No cities found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CityTable;
