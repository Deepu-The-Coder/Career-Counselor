import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiTarget, FiAward, FiBookOpen, FiArrowRight, FiCheckCircle, FiMap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { assessmentAPI, roadmapAPI, chatAPI } from '../services/api';

const QUICK_ACTIONS = [
  { label: 'Chat with AI', icon: '🤖', to: '/dashboard/chat', desc: 'Get instant career guidance', color: '#6366f1' },
  { label: 'Take Assessment', icon: '🎯', to: '/dashboard/assessment', desc: 'Discover your career match', color: '#8b5cf6' },
  { label: 'View Roadmap', icon: '🗺️', to: '/dashboard/roadmap', desc: 'See your career path', color: '#06b6d4' },
  { label: 'Govt Schemes', icon: '🏛️', to: '/dashboard/schemes', desc: 'Find financial support', color: '#10b981' },
  { label: 'Free Courses', icon: '📚', to: '/dashboard/resources', desc: 'Learn new skills', color: '#f59e0b' },
  { label: 'Resume Help', icon: '📝', to: '/dashboard/resume', desc: 'Build your resume', color: '#ef4444' },
];

const MOTIVATIONAL_QUOTES = [
  '"Every expert was once a beginner. Start today, succeed tomorrow." 💪',
  '"Your background doesn\'t define your future. Your actions do." 🚀',
  '"A journey of a thousand miles begins with a single step." 🌟',
  '"Success is not final, failure is not fatal: it is the courage to continue." ✨',
];

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const [quote] = useState(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);

  useEffect(() => {
    assessmentAPI.getLatest().then(({data}) => setAssessment(data.assessment)).catch(() => {});
    roadmapAPI.getAll().then(({data}) => setRoadmaps(data.roadmaps || [])).catch(() => {});
    chatAPI.getSessions().then(({data}) => setChatCount(data.sessions?.length || 0)).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const completeness = profile?.profileComplete || 0;

  return (
    <div>
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ background: 'var(--gradient)', borderRadius: 20, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: -40 }} />
          <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', bottom: -30, right: 100 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 4 }}>🌅 {greeting},</div>
            <h2 style={{ color: '#fff', fontWeight: 800, marginBottom: 8 }}>{user?.name || 'Student'}! 🙏</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 16, fontSize: 14 }}>
              {quote}
            </p>
            <div className="d-flex flex-wrap gap-3">
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: '#fff' }}>
                ✅ {completeness}% Profile Complete
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: '#fff' }}>
                💬 {chatCount} AI Conversations
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: '#fff' }}>
                🗺️ {roadmaps.length} Roadmaps
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Alert */}
      {completeness < 40 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Complete your profile for personalized guidance!</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add your education, location, and interests to get career recommendations tailored for you.</div>
          </div>
          <Link to="/dashboard/profile" className="btn-gradient ms-auto" style={{ textDecoration: 'none', padding: '7px 16px', fontSize: 12, whiteSpace: 'nowrap', flexShrink: 0 }}>Complete Now</Link>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <h5 style={{ marginBottom: 16 }}>⚡ Quick Actions</h5>
        <div className="row g-3">
          {QUICK_ACTIONS.map((action, i) => (
            <div key={i} className="col-6 col-md-4 col-lg-2">
              <Link to={action.to} style={{ textDecoration: 'none' }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 12px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{action.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text)', marginBottom: 3 }}>{action.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{action.desc}</div>
                </motion.div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Career Readiness', value: assessment?.results?.overallScore ? `${assessment.results.overallScore}%` : 'Not assessed', icon: '🎯', color: '#6366f1', action: '/dashboard/assessment', actionLabel: assessment ? 'Retake' : 'Take Now' },
          { label: 'Active Roadmaps', value: roadmaps.length || '0', icon: '🗺️', color: '#06b6d4', action: '/dashboard/roadmap', actionLabel: 'View All' },
          { label: 'AI Conversations', value: chatCount, icon: '💬', color: '#8b5cf6', action: '/dashboard/chat', actionLabel: 'Start Chat' },
          { label: 'Profile Status', value: `${completeness}%`, icon: '👤', color: '#10b981', action: '/dashboard/profile', actionLabel: 'Edit Profile' },
        ].map((stat, i) => (
          <div key={i} className="col-6 col-md-3">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="stat-card">
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>{stat.label}</div>
              <Link to={stat.action} style={{ fontSize: 11, color: 'var(--primary-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                {stat.actionLabel} <FiArrowRight size={10} />
              </Link>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Assessment Results */}
        <div className="col-lg-6">
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ margin: 0 }}>🎯 Career Matches</h5>
              <Link to="/dashboard/assessment" style={{ fontSize: 12, color: 'var(--primary-light)', textDecoration: 'none' }}>
                {assessment ? 'Retake Assessment' : 'Take Assessment'} →
              </Link>
            </div>
            {assessment ? (
              <div>
                {assessment.results?.careerMatches?.slice(0, 3).map((match, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{match.career}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: ['#6366f1', '#8b5cf6', '#06b6d4'][i] }}>{match.matchScore}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--border)', borderRadius: 3 }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${match.matchScore}%` }} transition={{ duration: 1, delay: i * 0.2 }}
                        style={{ height: '100%', background: ['var(--gradient)', 'linear-gradient(135deg,#8b5cf6,#06b6d4)', 'linear-gradient(135deg,#10b981,#06b6d4)'][i], borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Take the AI career assessment to discover your perfect career matches</p>
                <Link to="/dashboard/assessment" className="btn-gradient d-inline-flex align-items-center gap-2" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: 13 }}>
                  <FiTarget size={14} /> Start Assessment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Active Roadmap */}
        <div className="col-lg-6">
          <div className="glass-card" style={{ padding: 24, height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ margin: 0 }}>🗺️ Latest Roadmap</h5>
              <Link to="/dashboard/roadmap" style={{ fontSize: 12, color: 'var(--primary-light)', textDecoration: 'none' }}>View All →</Link>
            </div>
            {roadmaps.length > 0 ? (
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{roadmaps[0].title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{roadmaps[0].careerPath} · {roadmaps[0].totalDuration}</div>
                {roadmaps[0].milestones?.slice(0, 4).map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: m.status === 'completed' ? '#10b981' : m.status === 'in-progress' ? 'var(--warning)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                      {m.status === 'completed' ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: 13, flex: 1 }}>{m.title}</span>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: m.status === 'completed' ? 'rgba(16,185,129,0.1)' : m.status === 'in-progress' ? 'rgba(245,158,11,0.1)' : 'var(--bg)', color: m.status === 'completed' ? '#10b981' : m.status === 'in-progress' ? 'var(--warning)' : 'var(--text-muted)' }}>{m.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Generate your first AI-powered career roadmap</p>
                <Link to="/dashboard/roadmap" className="btn-gradient d-inline-flex align-items-center gap-2" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: 13 }}>
                  <FiMap size={14} /> Create Roadmap
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
