'use client';
import { useState, useEffect } from 'react';
import { CATALOG, getDatasetsForRole, ROLE_MAP, type DataProduct } from '@/lib/catalog-data';

const PERSONAS = ['Data Analyst', 'General User', 'Data Scientist', 'Contributor'];

const DOMAIN_COLORS: Record<string, string> = {
  MCCSS: 'bg-purple-100 text-purple-800',
  FIN: 'bg-green-100 text-green-800',
  MOH: 'bg-red-100 text-red-800',
  MTO: 'bg-blue-100 text-blue-800',
  EDU: 'bg-yellow-100 text-yellow-800',
  ENERGY: 'bg-orange-100 text-orange-800',
  LABOUR: 'bg-indigo-100 text-indigo-800',
};

const CERT_COLORS: Record<string, string> = {
  Authoritative: 'bg-emerald-600 text-white',
  Certified: 'bg-sky-600 text-white',
  Draft: 'bg-gray-400 text-white',
};

// Visual lineage DAG component (SVG-based)
function LineageDAG({ lineage, tableName }: { lineage: DataProduct['lineage']; tableName: string }) {
  const sources = lineage.sources;
  const transforms = lineage.transformations;
  const downstream = lineage.downstream;
  const nodeW = 180, nodeH = 36, gapX = 60, gapY = 14;
  const col0X = 20, col1X = col0X + nodeW + gapX, col2X = col1X + nodeW + gapX, col3X = col2X + nodeW + gapX;
  const maxRows = Math.max(sources.length, downstream.length, 1);
  const svgH = maxRows * (nodeH + gapY) + 40;
  const svgW = col3X + nodeW + 20;
  const centerY = (i: number, total: number) => 20 + i * (nodeH + gapY) + nodeH / 2 + ((maxRows - total) * (nodeH + gapY)) / 2;
  const mainY = centerY(0, 1);

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${svgH}`} className="border rounded-lg bg-slate-50">
      {/* Source nodes */}
      {sources.map((s, i) => {
        const y = centerY(i, sources.length);
        return (
          <g key={`src-${i}`}>
            <rect x={col0X} y={y - nodeH/2} width={nodeW} height={nodeH} rx={6} fill="#dbeafe" stroke="#93c5fd" strokeWidth={1.5} />
            <text x={col0X + 10} y={y + 4} fontSize={10} fill="#1e40af" className="font-medium">{s.length > 22 ? s.slice(0, 22) + '...' : s}</text>
            <line x1={col0X + nodeW} y1={y} x2={col1X} y2={mainY} stroke="#93c5fd" strokeWidth={1.5} markerEnd="url(#arrow)" />
          </g>
        );
      })}
      {/* Transformation node */}
      <rect x={col1X} y={mainY - nodeH/2} width={nodeW} height={nodeH} rx={6} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={col1X + 10} y={mainY + 4} fontSize={9} fill="#92400e">{transforms[0]?.length > 24 ? transforms[0].slice(0, 24) + '...' : transforms[0]}</text>
      {/* Current table */}
      <line x1={col1X + nodeW} y1={mainY} x2={col2X} y2={mainY} stroke="#10b981" strokeWidth={2} markerEnd="url(#arrow)" />
      <rect x={col2X} y={mainY - nodeH/2} width={nodeW} height={nodeH} rx={6} fill="#d1fae5" stroke="#10b981" strokeWidth={2} />
      <text x={col2X + 10} y={mainY + 4} fontSize={10} fill="#065f46" fontWeight="bold">{tableName.length > 22 ? tableName.slice(0, 22) + '...' : tableName}</text>
      {/* Downstream nodes */}
      {downstream.map((d, i) => {
        const y = centerY(i, downstream.length);
        return (
          <g key={`ds-${i}`}>
            <line x1={col2X + nodeW} y1={mainY} x2={col3X} y2={y} stroke="#a78bfa" strokeWidth={1.5} markerEnd="url(#arrow)" />
            <rect x={col3X} y={y - nodeH/2} width={nodeW} height={nodeH} rx={6} fill="#ede9fe" stroke="#a78bfa" strokeWidth={1.5} />
            <text x={col3X + 10} y={y + 4} fontSize={10} fill="#5b21b6">{d.length > 22 ? d.slice(0, 22) + '...' : d}</text>
          </g>
        );
      })}
      <defs>
        <marker id="arrow" viewBox="0 0 10 7" refX="9" refY="3.5" markerWidth="8" markerHeight="6" orient="auto-start-reverse">
          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
        </marker>
      </defs>
    </svg>
  );
}

// Applicable Policies component
function ApplicablePolicies({ dataset }: { dataset: DataProduct }) {
  const restrictedCols = dataset.columns.filter(c => c.sensitivity === 'RESTRICTED');
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        Applicable Access Policies
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-700">Table Sensitivity</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${dataset.sensitivity === 'RESTRICTED' ? 'bg-red-100 text-red-700' : dataset.sensitivity === 'INTERNAL' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{dataset.sensitivity}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-700">Access Control</span>
          <span className="text-xs text-gray-600">{dataset.sensitivity === 'PUBLIC' ? 'Open Access' : dataset.sensitivity === 'INTERNAL' ? 'Role-Based (Analyst+)' : 'Owner Approval Required'}</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-700">Masking Policy</span>
          <span className="text-xs text-gray-600">{restrictedCols.length > 0 ? `Tag-based dynamic masking (${restrictedCols.length} columns)` : 'None required'}</span>
        </div>
        {restrictedCols.length > 0 && (
          <div className="p-2 bg-red-50 rounded border border-red-100">
            <span className="text-xs font-medium text-red-700">Masked columns (unauthorized roles see ***MASKED***):</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {restrictedCols.map(c => (
                <span key={c.name} className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-mono">{c.name}</span>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-700">Approval Routing</span>
          <span className="text-xs text-gray-600">{dataset.data_owner} (Data Owner)</span>
        </div>
        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <span className="text-gray-700">Governance Framework</span>
          <span className="text-xs text-gray-600">OPS Enterprise Data Governance Policy v2.1</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [persona, setPersona] = useState('Data Analyst');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DataProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [basket, setBasket] = useState<DataProduct[]>([]);
  const [showBasket, setShowBasket] = useState(false);
  const [filterCert, setFilterCert] = useState<string>('');
  const [filterAI, setFilterAI] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<DataProduct | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [accessRequested, setAccessRequested] = useState<string[]>([]);
  const [detailTab, setDetailTab] = useState<'overview' | 'lineage' | 'policies'>('overview');
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const role = ROLE_MAP[persona] || 'OPS_GENERAL_USER';
  const allDatasets = Object.values(CATALOG);

  const filteredCatalog = allDatasets.filter(d => {
    if (filterCert && d.certification !== filterCert) return false;
    if (filterAI && !d.ai_ready) return false;
    return true;
  });

  const displayData = searchResults.length > 0 ? searchResults : filteredCatalog;

  function addNotification(msg: string) {
    setNotifications(prev => [msg, ...prev]);
    setTimeout(() => setNotifications(prev => prev.slice(0, -1)), 5000);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const results = await res.json();
      if (Array.isArray(results)) {
        const enriched = results.map((r: any) => {
          const key = `${r.SCHEMA_NAME || r.TABLE_SCHEMA}.${r.TABLE_NAME}`;
          return CATALOG[key] || null;
        }).filter(Boolean);
        const unique = [...new Map(enriched.map((d: DataProduct) => [d.id, d])).values()];
        setSearchResults(unique as DataProduct[]);
      }
    } catch { setSearchResults([]); }
    setIsSearching(false);
  }

  function isAccessible(d: DataProduct) { return d.accessible_by.includes(role); }
  function addToBasket(d: DataProduct) {
    if (!basket.find(b => b.id === d.id)) {
      setBasket([...basket, d]);
      addNotification(`Added "${d.display_name}" to basket`);
    }
  }
  function removeFromBasket(id: string) { setBasket(basket.filter(b => b.id !== id)); }

  async function handleCheckout() {
    const payload = basket.map(d => ({ table: d.id, role, purpose: 'Marketplace basket checkout' }));
    try {
      await fetch('/api/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'batch_provision', items: payload }) });
    } catch {}
    setCheckoutDone(true);
    addNotification(`Access provisioned for ${basket.length} dataset(s). Data is now available.`);
    setTimeout(() => { setCheckoutDone(false); setBasket([]); setShowBasket(false); }, 4000);
  }

  async function handleRequestAccess(d: DataProduct) {
    try {
      await fetch('/api/access', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({action:'request', role, table: d.id, purpose: 'Marketplace access request'}) });
    } catch {}
    setAccessRequested(prev => [...prev, d.id]);
    addNotification(`Access request submitted for "${d.display_name}". Routed to ${d.data_owner} for approval.`);
  }

  // Dataset detail view
  if (selectedDataset) {
    const d = selectedDataset;
    const hasAccess = isAccessible(d);
    const requested = accessRequested.includes(d.id);

    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((n, i) => (
              <div key={i} className="bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm max-w-sm animate-pulse">{n}</div>
            ))}
          </div>
        )}

        <button onClick={() => { setSelectedDataset(null); setDetailTab('overview'); }} className="text-blue-600 mb-4 hover:underline text-sm font-medium">&larr; Back to Marketplace</button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-4">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${DOMAIN_COLORS[d.domain]}`}>{d.domain}</span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${CERT_COLORS[d.certification]}`}>{d.certification}</span>
            {d.ai_ready && <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-violet-600 text-white">AI-Ready</span>}
            {d.ml_enabled && <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-pink-600 text-white">ML-Enabled</span>}
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${d.sensitivity === 'RESTRICTED' ? 'bg-red-50 text-red-700 border-red-300' : d.sensitivity === 'INTERNAL' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-green-50 text-green-700 border-green-300'}`}>{d.sensitivity}</span>
            {hasAccess && <span className="ml-auto px-2.5 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold border border-green-300">Access Granted</span>}
            {!hasAccess && !requested && <span className="ml-auto px-2.5 py-1 bg-red-50 text-red-600 rounded-md text-xs font-bold border border-red-200">No Access</span>}
            {requested && <span className="ml-auto px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-bold border border-amber-200">Request Pending</span>}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{d.display_name}</h1>
          <p className="text-gray-600 text-sm">{d.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Owner</div><div className="font-medium text-sm text-gray-800">{d.data_owner}</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Steward</div><div className="font-medium text-sm text-gray-800">{d.data_steward}</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Trust Score</div><div className="font-medium text-sm text-emerald-600">{d.quality.trust_score}/100</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Queries / Week</div><div className="font-medium text-sm text-gray-800">{d.usage.weekly_queries}</div></div>
            <div className="bg-slate-50 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Freshness</div><div className="font-medium text-sm text-gray-800">{d.quality.freshness}</div></div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            {hasAccess ? (
              <button onClick={() => addToBasket(d)} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition">Add to Basket</button>
            ) : requested ? (
              <button disabled className="px-5 py-2.5 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed">Request Pending...</button>
            ) : (
              <button onClick={() => handleRequestAccess(d)} className="px-5 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium transition">Request Access</button>
            )}
            <a href="/ml-delivery" className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">API / ML Delivery</a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
          {(['overview', 'lineage', 'policies'] as const).map(tab => (
            <button key={tab} onClick={() => setDetailTab(tab)} className={`px-4 py-2 rounded-md text-sm font-medium transition ${detailTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'overview' ? 'Schema & Quality' : tab === 'lineage' ? 'Lineage' : 'Policies'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {detailTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border p-5">
              <h3 className="font-bold text-sm mb-3">Schema & Business Glossary</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-slate-50"><th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Column</th><th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Type</th><th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Description</th><th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Sensitivity</th></tr></thead>
                  <tbody>
                    {d.columns.map(c => (
                      <tr key={c.name} className="border-b hover:bg-slate-50">
                        <td className="py-2 px-2 font-mono text-xs text-gray-800">{c.name}</td>
                        <td className="py-2 px-2 text-xs text-gray-500">{c.type}</td>
                        <td className="py-2 px-2 text-xs text-gray-700">{c.description}</td>
                        <td className="py-2 px-2">{c.sensitivity === 'RESTRICTED' && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-medium">MASKED</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-bold text-sm mb-3">Quality Metrics</h3>
                <div className="space-y-3">
                  <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Completeness</span><span className="font-medium">{d.quality.completeness}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{width: `${d.quality.completeness}%`}}></div></div></div>
                  <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Consistency</span><span className="font-medium">{d.quality.consistency}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: `${d.quality.consistency}%`}}></div></div></div>
                  <div><div className="flex justify-between text-xs mb-1"><span className="text-gray-500">Trust Score</span><span className="font-medium">{d.quality.trust_score}/100</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-violet-500 h-2 rounded-full" style={{width: `${d.quality.trust_score}%`}}></div></div></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-bold text-sm mb-3">Delivery Methods</h3>
                <div className="flex flex-wrap gap-2">{d.delivery_methods.map(m => <span key={m} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">{m}</span>)}</div>
              </div>
              <div className="bg-white rounded-xl border p-5">
                <h3 className="font-bold text-sm mb-3">Tags</h3>
                <div className="flex flex-wrap gap-1.5">{d.tags.map(t => <span key={t} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>)}</div>
              </div>
            </div>
          </div>
        )}

        {detailTab === 'lineage' && (
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-sm mb-1">Column-Level Data Lineage</h3>
            <p className="text-xs text-gray-500 mb-4">Source systems, transformations, and downstream consumers — traced via Snowflake ACCESS_HISTORY</p>
            <LineageDAG lineage={d.lineage} tableName={d.display_name} />
            <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
              <div><span className="inline-block w-3 h-3 bg-blue-100 border border-blue-400 rounded mr-1"></span>Source Systems ({d.lineage.sources.length})</div>
              <div><span className="inline-block w-3 h-3 bg-amber-100 border border-amber-400 rounded mr-1"></span>Transformations</div>
              <div><span className="inline-block w-3 h-3 bg-violet-100 border border-violet-400 rounded mr-1"></span>Downstream Consumers ({d.lineage.downstream.length})</div>
            </div>
          </div>
        )}

        {detailTab === 'policies' && <ApplicablePolicies dataset={d} />}

        {/* AI Recommendations */}
        <div className="mt-6 bg-white rounded-xl border p-5">
          <h3 className="font-bold text-sm text-gray-900 mb-1 flex items-center gap-2">
            <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI-Driven Recommendations
          </h3>
          <p className="text-xs text-gray-500 mb-3">Related data products based on domain, tag similarity, and co-query patterns</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {allDatasets.filter(other => other.id !== d.id).map(other => {
              const tagOverlap = other.tags.filter(t => d.tags.includes(t)).length;
              const domainMatch = other.domain === d.domain ? 1 : 0;
              return { ...other, score: tagOverlap * 3 + domainMatch * 2 + (other.ai_ready === d.ai_ready ? 1 : 0) };
            }).sort((a, b) => b.score - a.score).slice(0, 3).map(rec => (
              <div key={rec.id} onClick={() => { setSelectedDataset(rec); setDetailTab('overview'); }} className="border rounded-lg p-3 hover:bg-blue-50 cursor-pointer transition group">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${DOMAIN_COLORS[rec.domain]}`}>{rec.domain}</span>
                  {rec.ai_ready && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-violet-600 text-white">AI-Ready</span>}
                </div>
                <div className="font-medium text-sm text-gray-800 group-hover:text-blue-700">{rec.display_name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {rec.domain === d.domain ? 'Same domain' : `Shared tags: ${rec.tags.filter((t: string) => d.tags.includes(t)).join(', ') || 'related'}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main marketplace view
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((n, i) => (
            <div key={i} className="bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm max-w-sm">{n}</div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OPS Data Marketplace</h1>
          <p className="text-sm text-gray-500">Ontario Public Service — Enterprise Data Product Catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/usage" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50">Usage</a>
          <a href="/ml-delivery" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50">ML Delivery</a>
          <a href="/publish" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded-lg hover:bg-gray-50">Publish</a>
          <select value={persona} onChange={e => { setPersona(e.target.value); setSearchResults([]); }} className="border rounded-lg px-3 py-2 text-sm bg-white">
            {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={() => setShowBasket(!showBasket)} className="relative px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Basket {basket.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{basket.length}</span>}
          </button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-5">
        <div className="flex gap-2">
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder='Search data products (e.g. "client retention metrics", "emergency wait times")' className="flex-1 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 shadow-sm" />
          <button type="submit" disabled={isSearching} className="px-7 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shadow-sm transition">{isSearching ? 'Searching...' : 'Search'}</button>
          {searchResults.length > 0 && <button type="button" onClick={() => { setSearchResults([]); setSearchQuery(''); }} className="px-5 py-3.5 border rounded-xl text-sm hover:bg-gray-50">Clear</button>}
        </div>
      </form>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap items-center">
        <span className="text-xs text-gray-400 mr-1">Filter:</span>
        <button onClick={() => setFilterCert(filterCert === 'Authoritative' ? '' : 'Authoritative')} className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${filterCert === 'Authoritative' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300 hover:bg-gray-50'}`}>Authoritative</button>
        <button onClick={() => setFilterCert(filterCert === 'Certified' ? '' : 'Certified')} className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${filterCert === 'Certified' ? 'bg-sky-600 text-white border-sky-600' : 'border-gray-300 hover:bg-gray-50'}`}>Certified</button>
        <button onClick={() => setFilterAI(!filterAI)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition ${filterAI ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300 hover:bg-gray-50'}`}>AI-Ready</button>
        <span className="text-xs text-gray-400 ml-auto">{displayData.length} data products</span>
      </div>

      {/* Basket Sidebar */}
      {showBasket && (
        <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 p-6 overflow-y-auto border-l">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Data Basket</h2>
            <button onClick={() => setShowBasket(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>
          {basket.length === 0 ? <p className="text-gray-400 text-sm">Your basket is empty. Add data products to request access in a single provisioned request.</p> : (
            <>
              {basket.map(d => (
                <div key={d.id} className="border rounded-lg p-3 mb-2 flex justify-between items-center hover:bg-slate-50">
                  <div>
                    <div className="font-medium text-sm text-gray-800">{d.display_name}</div>
                    <div className="text-xs text-gray-400">{d.domain} &middot; {d.sensitivity}</div>
                  </div>
                  <button onClick={() => removeFromBasket(d.id)} className="text-gray-300 hover:text-red-500 transition">&times;</button>
                </div>
              ))}
              <div className="mt-5 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-medium text-sm text-blue-900 mb-2">Policy Evaluation Summary</p>
                <div className="space-y-1 text-xs text-blue-800">
                  <div className="flex justify-between"><span>Active Role:</span><span className="font-mono">{role}</span></div>
                  <div className="flex justify-between"><span>Datasets:</span><span>{basket.length}</span></div>
                  <div className="flex justify-between"><span>Auto-provision (PUBLIC):</span><span className="text-green-700">{basket.filter(d => d.sensitivity === 'PUBLIC').length}</span></div>
                  <div className="flex justify-between"><span>Requires Approval:</span><span className="text-amber-700">{basket.filter(d => d.sensitivity !== 'PUBLIC').length}</span></div>
                </div>
              </div>
              <button onClick={handleCheckout} className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition">
                {checkoutDone ? 'Provisioned Successfully!' : 'Checkout & Provision All'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayData.map(d => {
          const hasAccess = isAccessible(d);
          return (
            <div key={d.id} onClick={() => setSelectedDataset(d)} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition cursor-pointer p-5 group">
              <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${DOMAIN_COLORS[d.domain]}`}>{d.domain}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${CERT_COLORS[d.certification]}`}>{d.certification}</span>
                {d.ai_ready && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-600 text-white">AI-Ready</span>}
                {d.ml_enabled && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-600 text-white">ML</span>}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition">{d.display_name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{d.description}</p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <span className="text-gray-400">Trust: <strong className="text-emerald-600">{d.quality.trust_score}</strong></span>
                <span className="text-gray-400">{d.usage.weekly_queries} queries/wk</span>
                {hasAccess ? <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded font-medium border border-green-200">Access</span> : <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded font-medium border border-red-200">No Access</span>}
              </div>
              {d.usage.trending && <span className="inline-block mt-2.5 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] rounded font-medium border border-amber-200">Trending</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
