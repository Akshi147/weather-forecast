'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import CityTable from '../components/cityTable';
import { FaSearch } from 'react-icons/fa'; // For search icon

const fetchCities = async ({ pageParam = 0, queryKey }: { pageParam?: number; queryKey: [string, string] }) => {
  const [, search] = queryKey;
  const res = await fetch(`/api/cities?start=${pageParam}&rows=50&q=${encodeURIComponent(search)}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};


const Home = () => {
  const [search, setSearch] = useState('');
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['cities', search],
    queryFn: fetchCities,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.flatMap(p => p.cities).length;
      return fetched < lastPage.total ? fetched : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loaderRef, fetchNextPage, hasNextPage]);

  if (isLoading) return <p className="text-blue-500 font-semibold">Loading...</p>;
  if (isError) return <p className="text-red-500 font-semibold">Error fetching cities</p>;

  const cities = data?.pages.flatMap((page) => page.cities) ?? [];

  return (
    <div className="flex flex-col items-center justify-center w-4/5 mx-auto p-6 ">
      {/* Search bar with icon */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search cities"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-4/5 p-3 mb-px rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg font-medium"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* City Table */}
      <CityTable cities={cities} search={search} />

      {/* Loader for next page */}
      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p className="text-blue-500 font-semibold">Loading more...</p>}
    </div>
  );
};

export default Home;
