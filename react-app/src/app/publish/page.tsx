'use client';
import { useState } from 'react';
import { CATALOG } from '@/lib/catalog-data';

export default function PublishPage() {
  const [selected, setSelected] = useState(Object.keys(CATALOG)[0]);
  const [validation, setValidation] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [deprecated, setDeprecated] = useState(false);

  // Editable metadata (Gap 4)
  const dataset = CATALOG[selected];
  const [editDescription, setEditDescription] = useState(dataset?.description || '');
  const [editCert, setEditCert] = useState(dataset?.certification || 'Draft');
  const [editDelivery, setEditDelivery] = useState<string[]>(dataset?.delivery_methods || ['TABLE']);
  const [editTags, setEditTags] = useState(dataset?.tags.join(', ') || '');
  const [editAudience, setEditAudience] = useState('All OPS Analysts');
  const [newTag, setNewTag] = useState('');

  function onSelectChange(id: string) {
    setSelected(id);
    const d = CATALOG[id];
    if (d) {
      setEditDescription(d.description);
      setEditCert(d.certification);
      setEditDelivery(d.delivery_methods);
      setEditTags(d.tags.join(', '));
      setValidation(null);
      setPublished(false);
      setDeprecated(false);
    }
  }

  async function runValidation() {
    setPublishing(true);
    setTimeout(() => {
      if (!dataset) return;
      setValidation({
        table: selected,
        checks: [
          { name: 'Certification Set', passed: editCert !== 'Draft', value: editCert },
          { name: 'Data Owner Assigned', passed: !!dataset.data_owner, value: dataset.data_owner },
          { name: 'All Columns Documented', passed: true, value: `${dataset.columns.length} columns documented` },
          { name: 'Sensitivity Classified', passed: true, value: 'All columns classified via SYSTEM$CLASSIFY' },
          { name: 'Quality Above Threshold (80+)', passed: dataset.quality.trust_score >= 80, value: `Trust Score: ${dataset.quality.trust_score}/100` },
          { name: 'Description Provided', passed: editDescription.length > 20, value: `${editDescription.length} characters` },
          { name: 'Delivery Methods Defined', passed: editDelivery.length > 0, value: editDelivery.join(', ') },
        ],
        publish_ready: editCert !== 'Draft' && dataset.quality.trust_score >= 80 && editDescription.length > 20 && editDelivery.length > 0,
      });
      setPublishing(false);
    }, 1500);
  }

  function handlePublish() {
    setPublished(true);
    setDeprecated(false);
  }

  function handleDeprecate() {
    setDeprecated(true);
    setPublished(false);
    setEditCert('Draft');
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <a href="/" className="text-blue-600 hover:underline text-sm font-medium">&larr; Back to Marketplace</a>
      <h1 className="text-2xl font-bold mt-4 mb-1 text-gray-900">Data Product Publisher</h1>
      <p className="text-sm text-gray-500 mb-6">Prepare, validate, and publish data products to the OPS Marketplace</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Selection + Metadata Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dataset selector */}
          <div className="bg-white rounded-xl border p-5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Select Dataset</label>
            <select value={selected} onChange={e => onSelectChange(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2.5 text-sm bg-white">
              {Object.values(CATALOG).map(d => <option key={d.id} value={d.id}>{d.display_name} ({d.domain}) — {d.certification}</option>)}
            </select>
          </div>

          {/* Editable Metadata (Gap 4) */}
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900">Edit Metadata</h3>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Business Description & Use Cases</label>
              <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Certification Level</label>
                <select value={editCert} onChange={e => setEditCert(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm bg-white">
                  <option value="Draft">Draft</option>
                  <option value="Certified">Certified</option>
                  <option value="Authoritative">Authoritative</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Intended Audience</label>
                <input value={editAudience} onChange={e => setEditAudience(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. All OPS Analysts, Data Scientists" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tags</label>
              <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
                {editTags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                  <span key={t} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center gap-1">
                    {t}
                    <button onClick={() => setEditTags(editTags.split(',').map(x => x.trim()).filter(x => x !== t).join(', '))} className="text-gray-400 hover:text-red-500">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newTag} onChange={e => setNewTag(e.target.value)} className="flex-1 border rounded-lg px-3 py-1.5 text-sm" placeholder="Add tag..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); setEditTags(editTags ? editTags + ', ' + newTag : newTag); setNewTag(''); }}} />
                <button onClick={() => { if (newTag) { setEditTags(editTags ? editTags + ', ' + newTag : newTag); setNewTag(''); }}} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Add</button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Supported Delivery Methods</label>
              <div className="flex gap-2 mt-1">
                {['TABLE', 'VIEW', 'API', 'FEATURE_TABLE'].map(m => (
                  <button key={m} onClick={() => setEditDelivery(editDelivery.includes(m) ? editDelivery.filter(x => x !== m) : [...editDelivery, m])} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${editDelivery.includes(m) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Validation Results */}
          {validation && (
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Pre-Publish Validation (Contract Check)</h3>
              <div className="space-y-2">
                {validation.checks.map((c: any) => (
                  <div key={c.name} className={`p-3 rounded-lg flex justify-between items-center ${c.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${c.passed ? 'text-green-600' : 'text-red-600'}`}>{c.passed ? '\u2713' : '\u2717'}</span>
                      <span className="text-sm font-medium text-gray-700">{c.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{c.value}</span>
                  </div>
                ))}
              </div>
              {validation.publish_ready && !published && (
                <button onClick={handlePublish} className="mt-4 w-full px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm transition">Publish to Marketplace</button>
              )}
              {!validation.publish_ready && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">Fix failing checks above before publishing.</div>
              )}
            </div>
          )}

          {published && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <div className="text-2xl mb-2">Published</div>
              <p className="text-sm text-emerald-800">Data product is now live in the OPS Marketplace with certification: <strong>{editCert}</strong></p>
            </div>
          )}

          {deprecated && (
            <div className="bg-gray-100 border rounded-xl p-5 text-center">
              <p className="text-sm text-gray-600">Data product has been <strong>deprecated</strong>. It will be hidden from marketplace search.</p>
            </div>
          )}
        </div>

        {/* Right: Actions + Status */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Actions</h3>
            <div className="space-y-2">
              <button onClick={runValidation} disabled={publishing} className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
                {publishing ? 'Validating...' : 'Run Pre-Publish Validation'}
              </button>
              <button onClick={handleDeprecate} className="w-full px-4 py-2.5 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                Deprecate Product
              </button>
              <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Create New Version
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Current Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Certification</span><span className={`font-medium ${editCert === 'Authoritative' ? 'text-emerald-600' : editCert === 'Certified' ? 'text-sky-600' : 'text-gray-400'}`}>{editCert}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Quality Score</span><span className="font-medium">{dataset?.quality.trust_score || 0}/100</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Last Updated</span><span className="font-medium">{dataset?.last_updated}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Owner</span><span className="font-medium">{dataset?.data_owner}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Lifecycle</span><span className={`font-medium ${deprecated ? 'text-red-600' : published ? 'text-emerald-600' : 'text-gray-600'}`}>{deprecated ? 'Deprecated' : published ? 'Published' : 'Active'}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Governance Checklist</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2"><span className="text-green-500">&#9679;</span><span>Data Owner assigned</span></div>
              <div className="flex items-center gap-2"><span className="text-green-500">&#9679;</span><span>SYSTEM$CLASSIFY executed</span></div>
              <div className="flex items-center gap-2"><span className={dataset && dataset.quality.trust_score >= 80 ? 'text-green-500' : 'text-red-500'}>&#9679;</span><span>Quality threshold (80+)</span></div>
              <div className="flex items-center gap-2"><span className="text-green-500">&#9679;</span><span>Masking policies attached</span></div>
              <div className="flex items-center gap-2"><span className={editDescription.length > 20 ? 'text-green-500' : 'text-amber-500'}>&#9679;</span><span>Description provided</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
