import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiExternalLink, FiFilter } from 'react-icons/fi';
import { resourcesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const BADGE_COLORS = { 'Government': '#10b981', 'Premium Free': '#6366f1', 'Best for Beginners': '#f59e0b', 'Job Focused': '#ef4444', 'World Class': '#8b5cf6', 'Foundation Skills': '#06b6d4', 'Hindi Available': '#ec4899' };

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ cost: '', difficulty: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await resourcesAPI.getAll({ search, ...filters });
      setResources(data.resources || []);
    } catch {} finally { setLoading(false); }
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📚</div>
        <div>
          <h2 style={{ margin: 0 , paddingLeft:10}}>Learning Resources</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>SWAYAM, NPTEL, free courses, and more</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: 16, marginBottom: 20 }}>
        <div className="d-flex gap-3 flex-wrap align-items-end">
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
           
            <input className="form-control" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42, paddingRight: 12 }} onKeyDown={e => e.key === 'Enter' && load()} />
          </div>
          <select className="form-select" style={{ maxWidth: 150 }} value={filters.cost} onChange={e => setFilters({...filters, cost: e.target.value})}>
            <option value="">All Costs</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
          <select className="form-select" style={{ maxWidth: 150 }} value={filters.difficulty} onChange={e => setFilters({...filters, difficulty: e.target.value})}>
            <option value="">All Levels</option>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
          <button onClick={load} className="btn-gradient" style={{ padding: '9px 20px' }}>Filter</button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="row g-3">
          {resources.map((r, i) => (
            <div key={r.id} className="col-md-6 col-lg-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 20, background: (BADGE_COLORS[r.badge] || '#6366f1') + '20', color: BADGE_COLORS[r.badge] || '#6366f1', fontWeight: 700, border: `1px solid ${(BADGE_COLORS[r.badge] || '#6366f1')}30` }}>
                    {r.badge || r.type}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: r.cost === 'Free' ? '#10b981' : 'var(--warning)' }}>
                    {r.cost}
                  </span>
                </div>
                <h6 style={{ fontWeight: 700, marginBottom: 8 }}>{r.name}</h6>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, marginBottom: 12 }}>{r.description}</p>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                  <span>By {r.provider}</span> · <span>{r.difficulty}</span>
                </div>
                <a href={r.url} target="_blank" rel="noreferrer" className="btn-gradient d-flex align-items-center justify-content-center gap-2" style={{ textDecoration: 'none', padding: '8px', fontSize: 13, borderRadius: 10 }}>
                  Visit Resource <FiExternalLink size={12} />
                </a>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
