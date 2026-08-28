'use client';
import { useState } from 'react';
import { CATALOG, type DataProduct } from '@/lib/catalog-data';

const ML_DATASETS = Object.values(CATALOG).filter(d => d.ml_enabled || d.ai_ready);
const ACCOUNT = 'sfsenorthamerica-mbijelic-aws-useast1';

export default function MLDeliveryPage() {
  const [selected, setSelected] = useState<DataProduct | null>(ML_DATASETS[0] || null);
  const [deliveryMethod, setDeliveryMethod] = useState('FEATURE_TABLE');
  const [refreshSchedule, setRefreshSchedule] = useState('0 6 * * *');
  const [showCredentials, setShowCredentials] = useState(false);

  if (!selected) return <div className="p-6">No AI-Ready datasets available.</div>;

  const featureCols = selected.columns.filter(c => c.feature_importance !== undefined && c.feature_importance > 0);
  const allDeliveryMethods = [...selected.delivery_methods, 'SCHEDULED_REFRESH'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <a href="/" className="text-blue-600 hover:underline text-sm font-medium">&larr; Back to Marketplace</a>
      <h1 className="text-2xl font-bold mt-4 mb-1 text-gray-900">ML / AI Data Delivery</h1>
      <p className="text-sm text-gray-500 mb-6">Programmatic access to AI-Ready and ML-Enabled datasets for model development</p>

      {/* Dataset Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {ML_DATASETS.map(d => (
          <button key={d.id} onClick={() => { setSelected(d); setDeliveryMethod(d.delivery_methods[0] || 'TABLE'); }} className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${selected.id === d.id ? 'bg-violet-600 text-white border-violet-600 shadow-sm' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
            {d.display_name}
            {d.ml_enabled && <span className="ml-1.5 px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded text-[10px]">ML</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Feature Metadata (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-gray-900">Feature-Level Metadata</h2>
            <div className="flex gap-3 text-xs text-gray-500">
              <span>Quality: <strong className="text-emerald-600">{selected.quality.trust_score}/100</strong></span>
              <span>Update: <strong>{selected.update_frequency}</strong></span>
              <span>Rows: <strong>{selected.row_count.toLocaleString()}</strong></span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Feature</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Type</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Importance</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Training Suitable</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Description</th>
                </tr>
              </thead>
              <tbody>
                {featureCols.sort((a, b) => (b.feature_importance || 0) - (a.feature_importance || 0)).map(c => (
                  <tr key={c.name} className="border-b hover:bg-slate-50">
                    <td className="py-2 px-2 font-mono text-xs text-gray-800">{c.name}</td>
                    <td className="py-2 px-2 text-xs text-gray-500">{c.type}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 bg-gray-200 rounded-full h-1.5"><div className="bg-violet-500 h-1.5 rounded-full" style={{width: `${(c.feature_importance || 0) * 10}%`}}></div></div>
                        <span className="text-xs text-gray-600 w-6">{c.feature_importance}/10</span>
                      </div>
                    </td>
                    <td className="py-2 px-2"><span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[10px] border border-green-200">Yes</span></td>
                    <td className="py-2 px-2 text-xs text-gray-600 max-w-[200px] truncate">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Options (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Method selector */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-bold text-sm text-gray-900 mb-3">Delivery Method</h2>
            <div className="grid grid-cols-2 gap-2">
              {allDeliveryMethods.map(m => (
                <button key={m} onClick={() => setDeliveryMethod(m)} className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${deliveryMethod === m ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>
                  {m === 'SCHEDULED_REFRESH' ? 'Scheduled Refresh' : m}
                </button>
              ))}
            </div>
          </div>

          {/* Code snippets per method */}
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-bold text-sm text-gray-900 mb-3">
              {deliveryMethod === 'FEATURE_TABLE' && 'Feature Table Access'}
              {deliveryMethod === 'API' && 'REST API (SQL API)'}
              {deliveryMethod === 'TABLE' && 'Direct Table Access'}
              {deliveryMethod === 'SCHEDULED_REFRESH' && 'Scheduled Dataset Refresh'}
            </h2>

            {deliveryMethod === 'FEATURE_TABLE' && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed">{`-- Feature table access (governed)
USE ROLE OPS_DATA_SCIENTIST;

SELECT *
FROM ON_GOVERNANCE_RFS.${selected.domain}.${selected.name}
WHERE IS_TRAINING_SUITABLE = 'Yes'
  AND DATA_QUALITY_SCORE >= 90
LIMIT 10000;

-- Row count for training
SELECT COUNT(*) AS training_rows
FROM ON_GOVERNANCE_RFS.${selected.domain}.${selected.name}
WHERE IS_TRAINING_SUITABLE = 'Yes';`}</pre>
            )}

            {deliveryMethod === 'API' && (
              <div className="space-y-3">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed">{`# Python — Snowpark SDK
from snowflake.snowpark import Session

session = Session.builder.configs({
    "account": "${ACCOUNT}",
    "authenticator": "externalbrowser",
    "warehouse": "COMPUTE_WH",
    "database": "ON_GOVERNANCE_RFS",
    "role": "OPS_DATA_SCIENTIST"
}).create()

df = session.table("${selected.domain}.${selected.name}")
df = df.filter(df.IS_TRAINING_SUITABLE == 'Yes')
df = df.filter(df.DATA_QUALITY_SCORE >= 90)

# To pandas for model training
pdf = df.to_pandas()
print(f"Shape: {pdf.shape}")`}</pre>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed">{`# REST API (SQL API)
curl -X POST \\
  "https://${ACCOUNT}.snowflakecomputing.com/api/v2/statements" \\
  -H "Authorization: Bearer <oauth_token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "statement": "SELECT * FROM ON_GOVERNANCE_RFS.${selected.domain}.${selected.name} WHERE IS_TRAINING_SUITABLE='"'"'Yes'"'"' LIMIT 1000",
    "warehouse": "COMPUTE_WH",
    "database": "ON_GOVERNANCE_RFS",
    "role": "OPS_DATA_SCIENTIST"
  }'`}</pre>
              </div>
            )}

            {deliveryMethod === 'TABLE' && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed">{`-- Direct table query (masking applies)
USE ROLE OPS_DATA_SCIENTIST;
USE DATABASE ON_GOVERNANCE_RFS;

SELECT * FROM ${selected.domain}.${selected.name}
LIMIT 100;

-- Note: RESTRICTED columns are masked
-- unless your role has explicit access`}</pre>
            )}

            {deliveryMethod === 'SCHEDULED_REFRESH' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Refresh Schedule (cron)</label>
                  <input value={refreshSchedule} onChange={e => setRefreshSchedule(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
                  <p className="text-[10px] text-gray-400 mt-1">Current: Daily at 6:00 AM ET</p>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed">{`-- Task-based scheduled refresh
CREATE OR REPLACE TASK ML_FEATURE_REFRESH
  WAREHOUSE = COMPUTE_WH
  SCHEDULE = 'USING CRON ${refreshSchedule} America/Toronto'
AS
  CREATE OR REPLACE TABLE ML_SANDBOX.${selected.name}_SNAPSHOT AS
  SELECT *
  FROM ON_GOVERNANCE_RFS.${selected.domain}.${selected.name}
  WHERE IS_TRAINING_SUITABLE = 'Yes'
    AND DATA_QUALITY_SCORE >= 90;

ALTER TASK ML_FEATURE_REFRESH RESUME;

-- Check refresh history:
SELECT * FROM TABLE(INFORMATION_SCHEMA.TASK_HISTORY())
WHERE NAME = 'ML_FEATURE_REFRESH'
ORDER BY SCHEDULED_TIME DESC;`}</pre>
              </div>
            )}
          </div>

          {/* Connection Details (Gap 7) */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm text-gray-900">Connection Details</h2>
              <button onClick={() => setShowCredentials(!showCredentials)} className="text-xs text-blue-600 hover:underline">{showCredentials ? 'Hide' : 'Show'}</button>
            </div>
            {showCredentials && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-slate-50 rounded"><span className="text-gray-500">Account</span><span className="font-mono text-gray-800">{ACCOUNT}</span></div>
                <div className="flex justify-between p-2 bg-slate-50 rounded"><span className="text-gray-500">Host</span><span className="font-mono text-gray-800">{ACCOUNT}.snowflakecomputing.com</span></div>
                <div className="flex justify-between p-2 bg-slate-50 rounded"><span className="text-gray-500">Database</span><span className="font-mono text-gray-800">ON_GOVERNANCE_RFS</span></div>
                <div className="flex justify-between p-2 bg-slate-50 rounded"><span className="text-gray-500">Schema</span><span className="font-mono text-gray-800">{selected.domain}</span></div>
                <div className="flex justify-between p-2 bg-slate-50 rounded"><span className="text-gray-500">Warehouse</span><span className="font-mono text-gray-800">COMPUTE_WH</span></div>
                <div className="flex justify-between p-2 bg-slate-50 rounded"><span className="text-gray-500">Role</span><span className="font-mono text-gray-800">OPS_DATA_SCIENTIST</span></div>
                <div className="flex justify-between p-2 bg-slate-50 rounded"><span className="text-gray-500">Authentication</span><span className="font-mono text-gray-800">SSO (Entra ID SAML)</span></div>
                <div className="p-2 bg-blue-50 rounded border border-blue-100">
                  <span className="text-blue-700">JDBC URL:</span>
                  <p className="font-mono text-[10px] text-blue-800 mt-1 break-all">jdbc:snowflake://{ACCOUNT}.snowflakecomputing.com/?db=ON_GOVERNANCE_RFS&schema={selected.domain}&warehouse=COMPUTE_WH&role=OPS_DATA_SCIENTIST</p>
                </div>
              </div>
            )}
            {!showCredentials && (
              <p className="text-xs text-gray-400">Connection parameters for direct integration into your ML environment.</p>
            )}
          </div>

          {/* Governance note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-medium text-xs text-amber-800">Governance Note</p>
            <p className="text-xs text-amber-700 mt-1">All delivery methods enforce the same tag-based masking policies. RESTRICTED columns are masked unless your role has explicit access. Authentication is via Ontario Government SSO (Microsoft Entra ID).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
