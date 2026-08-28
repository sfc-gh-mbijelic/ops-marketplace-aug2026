import { NextRequest, NextResponse } from 'next/server';
import { CATALOG } from '@/lib/catalog-data';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  if (!q.trim()) return NextResponse.json([]);

  // Try Cortex Search first, fallback to local text match
  try {
    const { executeQuery } = await import('@/lib/snowflake');
    const results = await executeQuery(`
      SELECT DISTINCT SCHEMA_NAME, TABLE_NAME, TABLE_DESCRIPTION, CERTIFICATION, AI_READY
      FROM TABLE(ON_GOVERNANCE_RFS.PUBLIC.MARKETPLACE_SEARCH(
        '${q.replace(/'/g, "''")}', 10
      ))
    `);
    return NextResponse.json(results);
  } catch {
    // Fallback: local text matching
    const lower = q.toLowerCase();
    const matches = Object.values(CATALOG).filter(d =>
      d.display_name.toLowerCase().includes(lower) ||
      d.description.toLowerCase().includes(lower) ||
      d.tags.some(t => t.includes(lower)) ||
      d.columns.some(c => c.description.toLowerCase().includes(lower))
    ).map(d => ({ SCHEMA_NAME: d.domain, TABLE_NAME: d.name }));
    return NextResponse.json(matches);
  }
}
