import { NextRequest, NextResponse } from 'next/server';
import { CATALOG } from '@/lib/catalog-data';

export async function GET(req: NextRequest) {
  const table = req.nextUrl.searchParams.get('table') || '';
  const dataset = CATALOG[table];
  if (!dataset) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(dataset);
}
