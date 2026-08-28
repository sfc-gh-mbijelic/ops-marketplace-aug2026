import { NextRequest, NextResponse } from 'next/server';
import { CATALOG } from '@/lib/catalog-data';

export async function GET(req: NextRequest) {
  const table = req.nextUrl.searchParams.get('table') || '';
  const dataset = CATALOG[table];
  if (!dataset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Try real lineage from ACCESS_HISTORY
  try {
    const { executeQuery } = await import('@/lib/snowflake');
    const rows = await executeQuery(`
      SELECT
        query_start_time,
        user_name,
        direct_objects_accessed,
        base_objects_accessed,
        objects_modified
      FROM SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY
      WHERE ARRAY_TO_STRING(base_objects_accessed, ',') ILIKE '%${dataset.name}%'
      ORDER BY query_start_time DESC
      LIMIT 20
    `);
    return NextResponse.json({
      dataset: table,
      lineage: dataset.lineage,
      access_history: rows,
    });
  } catch {
    // Fallback: return static lineage
    return NextResponse.json({
      dataset: table,
      lineage: dataset.lineage,
      access_history: [],
    });
  }
}
