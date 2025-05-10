// app/api/cities/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const start = searchParams.get('start') || '0';
  const rows = searchParams.get('rows') || '50';
  const q = searchParams.get('q') || ''; // for search support

  const url = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${q}&rows=${rows}&start=${start}&sort=name`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch cities');
    
    const data = await res.json();

    // extract city data with coordinates
    const cities = data.records.map((record: any) => ({
      name: record.fields.name,
      country: record.fields.cou_name_en,
      timezone: record.fields.timezone,
      coordinates: {
        lat: record.fields.coordinates?.[0] || null,
        lon: record.fields.coordinates?.[1] || null
      }
    }));

    return NextResponse.json({
      cities,
      total: data.nhits,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}