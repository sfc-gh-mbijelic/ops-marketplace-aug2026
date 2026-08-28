'use client';
import { useState, useEffect } from 'react';
import { CATALOG } from '@/lib/catalog-data';

export default function UsagePage() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    // Use catalog data directly for demo reliability
    const data = Object.values(CATALOG).map(d => ({
      dataset: d.id,
      display_name: d.display_name,
      domain: d.domain,
      query_count: d.usage.weekly_queries,
      unique_users: d.usage.unique_users,
      trending: d.usage.trending,
      trust_score: d.quality.trust_score,
    })).sort((a, b) => b.query_count - a.query_count);
    setMetrics(data);
  }, []);

  const totalQueries = metrics.reduce((sum, m) => sum + m.query_count, 0);
  const totalUsers = metrics.reduce((sum, m) => sum + m.unique_users, 0);
  const trendingCount = metrics.filter(m => m.trending).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <a href="/" className="text-blue-600 hover:underline text-sm">&larr; Back to Marketplace</a>
      <h1 className="text-2xl font-bold mt-4 mb-2">Usage & Adoption Dashboard</h1>
      <p className="text-gray-500 mb-6">Data product consumption metrics across OPS</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Total Weekly Queries</div>
          <div className="text-3xl font-bold text-blue-600">{totalQueries}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Unique Users</div>
          <div className="text-3xl font-bold text-emerald-600">{totalUsers}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Data Products</div>
          <div className="text-3xl font-bold text-violet-600">{metrics.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Trending</div>
          <div className="text-3xl font-bold text-amber-600">{trendingCount}</div>
        </div>
      </div>

      {/* Usage Table */}
      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="font-bold mb-3">Dataset Usage Rankings</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Rank</th>
              <th className="py-2">Dataset</th>
              <th className="py-2">Domain</th>
              <th className="py-2">Weekly Queries</th>
              <th className="py-2">Unique Users</th>
              <th className="py-2">Trust Score</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <tr key={m.dataset} className="border-b hover:bg-gray-50">
                <td className="py-2 font-medium text-gray-400">#{i + 1}</td>
                <td className="py-2 font-medium">{m.display_name}</td>
                <td className="py-2 text-gray-500">{m.domain}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: `${(m.query_count / 200) * 100}%`}}></div></div>
                    <span>{m.query_count}</span>
                  </div>
                </td>
                <td className="py-2">{m.unique_users}</td>
                <td className="py-2"><span className="text-emerald-600 font-medium">{m.trust_score}</span></td>
                <td className="py-2">{m.trending && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">Trending</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cross-Domain Composition */}
      <div className="bg-white rounded-xl shadow p-5 mt-6">
        <h2 className="font-bold mb-3">Cross-Domain Data Composition</h2>
        <p className="text-sm text-gray-500 mb-3">Most commonly combined datasets (based on JOIN patterns in query history)</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">MCCSS</span>
            <span className="text-gray-400">+</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">MCCSS</span>
            <span className="ml-2 text-sm">Client Retention + Customer Demographics</span>
            <span className="ml-auto text-sm text-gray-500">47 JOINs this week</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">MOH</span>
            <span className="text-gray-400">+</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs">LABOUR</span>
            <span className="ml-2 text-sm">Patient Outcomes + Workforce Features</span>
            <span className="ml-auto text-sm text-gray-500">23 JOINs this week</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">MOH</span>
            <span className="text-gray-400">+</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">MCCSS</span>
            <span className="ml-2 text-sm">ER Wait Times + Client Retention</span>
            <span className="ml-auto text-sm text-gray-500">15 JOINs this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
