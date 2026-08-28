import { NextRequest, NextResponse } from 'next/server';
import { CATALOG } from '@/lib/catalog-data';

export async function GET(req: NextRequest) {
  const table = req.nextUrl.searchParams.get('table') || '';
  const dataset = CATALOG[table];
  if (!dataset) return NextResponse.json([]);

  // Find related datasets by tag overlap
  const others = Object.values(CATALOG).filter(d => d.id !== table);
  const scored = others.map(d => {
    const tagOverlap = d.tags.filter(t => dataset.tags.includes(t)).length;
    const domainMatch = d.domain === dataset.domain ? 1 : 0;
    const aiMatch = d.ai_ready === dataset.ai_ready ? 1 : 0;
    return { ...d, score: tagOverlap * 3 + domainMatch * 2 + aiMatch };
  }).sort((a, b) => b.score - a.score).slice(0, 3);

  return NextResponse.json(scored.map(d => ({
    id: d.id,
    display_name: d.display_name,
    domain: d.domain,
    certification: d.certification,
    ai_ready: d.ai_ready,
    reason: d.domain === dataset.domain ? 'Same domain' : `Shared tags: ${d.tags.filter(t => dataset.tags.includes(t)).join(', ')}`,
  })));
}
