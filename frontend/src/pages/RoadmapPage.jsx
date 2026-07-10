import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiCheckCircle, FiClock, FiTarget, FiArrowRight } from 'react-icons/fi';
import { roadmapAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const POPULAR_PATHS = [
  { name: 'Software Developer', emoji: '💻', domain: 'IT' },
  { name: 'Government Job (SSC)', emoji: '🏛️', domain: 'Government' },
  { name: 'PMKVY Skill Training', emoji: '⚡', domain: 'Skill' },
  { name: 'Agriculture Business', emoji: '🌾', domain: 'Agriculture' },
  { name: 'Digital Marketing', emoji: '📱', domain: 'Marketing' },
  { name: 'ITI Trade Course', emoji: '🔧', domain: 'Vocational' },
  { name: 'Nurse / Healthcare', emoji: '🏥', domain: 'Healthcare' },
  { name: 'Entrepreneur / Business', emoji: '🚀', domain: 'Business' },
];

export default function RoadmapPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [customPath, setCustomPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    roadmapAPI.getAll()
      .then(({ data }) => { setRoadmaps(data.roadmaps || []); if (data.roadmaps?.length) setSelectedRoadmap(data.roadmaps[0]); })
      .catch(() => {})
      .finally(() => setFetchLoading(false));
  }, []);

  const generateRoadmap = async (path) => {
    setLoading(true);
    setShowGenerator(false);
    try {
      const { data } = await roadmapAPI.generate(path || customPath);
      setRoadmaps(prev => [data.roadmap, ...prev]);
      setSelectedRoadmap(data.roadmap);
      setCustomPath('');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const updateMilestone = async (milestoneIndex, status) => {
    if (!selectedRoadmap) return;
    try {
      const { data } = await roadmapAPI.updateMilestone({ roadmapId: selectedRoadmap._id, milestoneIndex, status });
      setSelectedRoadmap(data.roadmap);
      setRoadmaps(prev => prev.map(r => r._id === data.roadmap._id ? data.roadmap : r));
    } catch {}
  };

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🗺️</div>
          <div>
            <h2 style={{ margin: 0 }}>Career Roadmap</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Your personalized step-by-step career journey</p>
          </div>
        </div>
        <button onClick={() => setShowGenerator(true)} className="btn-gradient d-flex align-items-center gap-2" style={{ padding: '9px 20px' }}>
          <FiPlus size={15} /> New Roadmap
        </button>
      </div>

      {/* Generator Modal */}
      {showGenerator && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, maxWidth: 540, width: '100%' }}>
            <h4 style={{ marginBottom: 20 }}>🗺️ Generate Career Roadmap</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Choose a popular career path or type your own:</p>
            <div className="row g-2 mb-4">
              {POPULAR_PATHS.map((p, i) => (
                <div key={i} className="col-6 col-md-3">
                  <button onClick={() => generateRoadmap(p.name)}
                    style={{ width: '100%', padding: '10px 8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11, cursor: 'pointer', color: 'var(--text)', textAlign: 'center', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{p.emoji}</div>
                    <div>{p.name}</div>
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={customPath} onChange={e => setCustomPath(e.target.value)} placeholder="Or enter custom career path..." className="form-control" style={{ fontSize: 14 }} onKeyDown={e => e.key === 'Enter' && customPath && generateRoadmap()} />
              <button onClick={() => customPath && generateRoadmap()} className="btn-gradient" style={{ whiteSpace: 'nowrap', padding: '0 16px' }}>Generate</button>
            </div>
            <button onClick={() => setShowGenerator(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', marginTop: 12, cursor: 'pointer', width: '100%', fontSize: 13 }}>Cancel</button>
          </motion.div>
        </motion.div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <LoadingSpinner />
          <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>IBM Llama is building your personalized roadmap...</p>
        </div>
      )}

      {!loading && roadmaps.length === 0 && (
        <div className="glass-card" style={{ padding: '60px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
          <h4>No Roadmaps Yet</h4>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Generate your first AI-powered career roadmap to get started</p>
          <button onClick={() => setShowGenerator(true)} className="btn-gradient d-inline-flex align-items-center gap-2">
            <FiPlus size={15} /> Create Your First Roadmap
          </button>
        </div>
      )}

      {!loading && roadmaps.length > 0 && (
        <div className="row g-4">
          {/* Roadmap List */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: 20 }}>
              <h6 style={{ color: 'var(--text-muted)', marginBottom: 12, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Your Roadmaps ({roadmaps.length})</h6>
              <div className="d-flex flex-column gap-2">
                {roadmaps.map(r => {
                  const completed = r.milestones?.filter(m => m.status === 'completed').length || 0;
                  const total = r.milestones?.length || 1;
                  return (
                    <div key={r._id} onClick={() => setSelectedRoadmap(r)}
                      style={{ padding: '14px 16px', background: selectedRoadmap?._id === r._id ? 'var(--gradient-soft)' : 'var(--bg-card)', border: `1px solid ${selectedRoadmap?._id === r._id ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{r.careerPath} · {r.totalDuration}</div>
                      <div style={{ height: 3, background: 'var(--border)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${(completed / total) * 100}%`, background: 'var(--gradient)', borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{completed}/{total} milestones</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Roadmap Detail */}
          <div className="col-lg-8">
            {selectedRoadmap && (
              <motion.div key={selectedRoadmap._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 style={{ margin: 0 }}>{selectedRoadmap.title}</h4>
                      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><FiClock size={12} /> {selectedRoadmap.totalDuration}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><FiTarget size={12} /> {selectedRoadmap.difficulty}</span>
                      </div>
                    </div>
                    <span className="badge-gradient">AI Generated</span>
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ paddingLeft: 8 }}>
                  {selectedRoadmap.milestones?.map((milestone, i) => (
                    <div key={i} className={`roadmap-step ${milestone.status}`}>
                      <div className="roadmap-step-circle">{milestone.status === 'completed' ? '✓' : i + 1}</div>
                      <div className="glass-card" style={{ padding: 20, marginLeft: 4 }}>
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                          <h6 style={{ margin: 0, fontSize: 15 }}>{milestone.title}</h6>
                          <div className="d-flex gap-2 align-items-center">
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><FiClock size={10} /> {milestone.duration}</span>
                            <select value={milestone.status} onChange={e => updateMilestone(i, e.target.value)}
                              style={{ fontSize: 11, background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 6px', color: 'var(--text)', cursor: 'pointer' }}>
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 12px' }}>{milestone.description}</p>
                        {milestone.skills?.length > 0 && (
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {milestone.skills.map((s, j) => <span key={j} style={{ fontSize: 10, background: 'var(--gradient-soft)', borderRadius: 6, padding: '2px 8px', color: 'var(--primary-light)', border: '1px solid rgba(99,102,241,0.2)' }}>{s}</span>)}
                          </div>
                        )}
                        {milestone.resources?.length > 0 && (
                          <div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>📚 Resources:</div>
                            {milestone.resources.map((r, j) => <div key={j} style={{ fontSize: 12, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: 4 }}><FiArrowRight size={10} /> {r}</div>)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

