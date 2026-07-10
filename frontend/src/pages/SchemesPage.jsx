import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiExternalLink, FiBookmark, FiFilter, FiCheckCircle } from 'react-icons/fi';
import { schemesAPI, profileAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORY_COLORS = {
  'Skill Development': '#6366f1', 'Scholarship': '#10b981', 'Entrepreneurship': '#f59e0b',
  'Apprenticeship': '#06b6d4', 'Agriculture': '#84cc16',
};

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(new Set());

  useEffect(() => {
    loadSchemes();
  }, [activeCategory]);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const { data } = await schemesAPI.getAll({ category: activeCategory, search });
      setSchemes(data.schemes || []);
      setCategories(data.categories || []);
    } catch {
    } finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadSchemes();
  };

  const toggleSave = async (schemeId) => {
    try {
      if (saved.has(schemeId)) {
        await profileAPI.removeScheme(schemeId);
        setSaved(prev => { const n = new Set(prev); n.delete(schemeId); return n; });
      } else {
        await profileAPI.saveScheme(schemeId);
        setSaved(prev => new Set([...prev, schemeId]));
      }
    } catch {}
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏛️</div>
        <div>
          <h2 style={{ margin: 0 }}>Government Schemes Explorer</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>PMKVY, Scholarships, Skill India, and 100+ schemes</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
        <form onSubmit={handleSearch} className="d-flex gap-3 flex-wrap">
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <input type="text" className="form-control" placeholder="Search schemes, scholarships..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <button type="submit" className="btn-gradient d-flex align-items-center gap-2" style={{ padding: '9px 20px' }}>
            <FiSearch size={14} /> Search
          </button>
        </form>
        <div className="d-flex flex-wrap gap-2 mt-3">
          <button onClick={() => setActiveCategory('')} style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid var(--border)', background: !activeCategory ? 'var(--gradient)' : 'transparent', color: !activeCategory ? '#fff' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat === activeCategory ? '' : cat)}
              style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid var(--border)', background: cat === activeCategory ? CATEGORY_COLORS[cat] || 'var(--gradient)' : 'transparent', color: cat === activeCategory ? '#fff' : 'var(--text-muted)', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="row g-3">
          {schemes.map((scheme, i) => (
            <div key={scheme.id} className="col-md-6 col-lg-4">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="scheme-card" onClick={() => setSelected(scheme)}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: (CATEGORY_COLORS[scheme.category] || '#6366f1') + '20', color: CATEGORY_COLORS[scheme.category] || '#6366f1', fontWeight: 600 }}>{scheme.category}</span>
                  <button onClick={e => { e.stopPropagation(); toggleSave(scheme.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved.has(scheme.id) ? 'var(--warning)' : 'var(--text-muted)', padding: 0 }}>
                    <FiBookmark size={16} fill={saved.has(scheme.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <h6 style={{ fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{scheme.name}</h6>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{scheme.description}</p>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiCheckCircle size={11} color="#10b981" /> {scheme.states}
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {scheme.tags?.slice(0, 3).map((tag, j) => (
                    <span key={j} style={{ fontSize: 10, background: 'var(--gradient-soft)', borderRadius: 5, padding: '2px 7px', color: 'var(--text-muted)' }}>#{tag}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, maxWidth: 600, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: (CATEGORY_COLORS[selected.category] || '#6366f1') + '20', color: CATEGORY_COLORS[selected.category] || '#6366f1', fontWeight: 600 }}>{selected.category}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <h4 style={{ marginBottom: 12 }}>{selected.name}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>{selected.description}</p>
            <div className="row g-3 mb-4">
              <div className="col-12">
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                  <h6 style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>✅ ELIGIBILITY</h6>
                  <p style={{ fontSize: 14, margin: 0 }}>{selected.eligibility}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, height: '100%' }}>
                  <h6 style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>🎁 BENEFITS</h6>
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {selected.benefits?.map((b, i) => <li key={i} style={{ fontSize: 13, marginBottom: 4 }}>{b}</li>)}
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, height: '100%' }}>
                  <h6 style={{ marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>📋 DOCUMENTS REQUIRED</h6>
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {selected.documents?.map((d, i) => <li key={i} style={{ fontSize: 13, marginBottom: 4 }}>{d}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="d-flex gap-3 flex-wrap">
              <a href={selected.applicationLink} target="_blank" rel="noreferrer" className="btn-gradient d-inline-flex align-items-center gap-2" style={{ textDecoration: 'none', padding: '10px 20px', fontSize: 13 }}>
                Apply Now <FiExternalLink size={13} />
              </a>
              <a href={selected.officialLink} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                Official Website <FiExternalLink size={13} />
              </a>
              <button onClick={() => toggleSave(selected.id)} style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: 12, background: 'none', color: saved.has(selected.id) ? 'var(--warning)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiBookmark size={13} fill={saved.has(selected.id) ? 'currentColor' : 'none'} /> {saved.has(selected.id) ? 'Saved' : 'Save'}
              </button>
            </div>
            <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)', padding: '10px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
              ⚠️ Always verify eligibility and deadlines from the official government website. Information is for guidance only.
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
