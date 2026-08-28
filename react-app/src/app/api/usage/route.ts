import { NextResponse } from 'next/server';
import { CATALOG } from '@/lib/catalog-data';

export async function GET() {
  // Try real usage metrics from QUERY_HISTORY
  try {
    const { executeQuery } = await import('@/lib/snowflake');
    const rows = await executeQuery(`
      SELECT
        SPLIT_PART(query_text, '.', 2) || '.' || SPLIT_PART(query_text, '.', 3) AS dataset,
        COUNT(*) AS query_count,
        COUNT(DISTINCT user_name) AS unique_users,
        MAX(start_time) AS last_accessed
      FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY
      WHERE database_name = 'ON_GOVERNANCE_RFS'
        AND query_type = 'SELECT'
        AND start_time > DATEADD(day, -7, CURRENT_TIMESTAMP())
      GROUP BY 1
      ORDER BY query_count DESC
      LIMIT 20
    `);
    return NextResponse.json({ source: 'live', metrics: rows });
  } catch {
    // Fallback: return catalog usage data
    const metrics = Object.values(CATALOG).map(d => ({
      dataset: d.id,
      display_name: d.display_name,
      query_count: d.usage.weekly_queries,
      unique_users: d.usage.unique_users,
      trending: d.usage.trending,
    })).sort((a, b) => b.query_count - a.query_count);
    return NextResponse.json({ source: 'catalog', metrics });
  }
}
