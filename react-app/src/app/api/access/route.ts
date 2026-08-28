import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body;

  try {
    const { executeQuery } = await import('@/lib/snowflake');

    if (action === 'request') {
      const { role, table, purpose } = body;
      const result = await executeQuery(
        `CALL ON_GOVERNANCE_RFS.PUBLIC.SUBMIT_ACCESS_REQUEST(?, ?, ?, ?)`,
        [role, 'Demo User', table, purpose || 'Marketplace request']
      );
      return NextResponse.json({ status: 'ok', result });
    }

    if (action === 'batch_provision') {
      const { items } = body;
      const result = await executeQuery(
        `CALL ON_GOVERNANCE_RFS.PUBLIC.BATCH_PROVISION(?)`,
        [JSON.stringify(items)]
      );
      return NextResponse.json({ status: 'ok', result });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
