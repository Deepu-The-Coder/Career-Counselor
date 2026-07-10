import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { familyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FamilyPage() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    familyAPI.getStats()
      .then(({ data }) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍👩‍👧</div>
        <div>
          <h2 style={{ margin: 0 }}>Family Dashboard</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Manage career guidance for your entire family</p>
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
        <h5 style={{ marginBottom: 16 }}>🏠 How Family Dashboard Works</h5>
        <div className="row g-3">
          {[
            ['1. Each Member Registers', 'Every family member creates their own free account on CareerSaathi with their email.', '📧'],
            ['2. Individual Profiles', 'Each person completes their own profile with their education, skills, and career goals.', '👤'],
            ['3. Personalized Guidance', 'AI provides tailored career guidance based on each member\'s unique profile and background.', '🤖'],
            ['4. Shared Opportunities', 'Discover government schemes and opportunities that benefit the whole family.', '🏛️'],
          ].map(([title, desc, icon], i) => (
            <div key={i} className="col-md-6">
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current User Profile Summary */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h5 style={{ marginBottom: 16 }}>👤 Your Profile Summary</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, margin: '0 auto 12px' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="row g-2">
              {[
                ['Education', profile?.education?.level || 'Not set'],
                ['Location', profile?.location?.state || 'Not set'],
                ['Career Goal', profile?.careerGoals?.substring(0, 60) || 'Not set'],
                ['Profile Complete', `${profile?.profileComplete || 0}%`],
              ].map(([label, value], i) => (
                <div key={i} className="col-6">
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Family Benefits */}
      <h5 style={{ marginBottom: 16 }}>🌟 Benefits for Your Family</h5>
      <div className="row g-3 mb-4">
        {[
          { icon: '🎓', title: 'Education Guidance', desc: 'Scholarship recommendations and education path guidance for students in the family' },
          { icon: '💼', title: 'Career Diversity', desc: 'Explore different career paths suitable for different family members based on their education' },
          { icon: '🏛️', title: 'Scheme Discovery', desc: 'Find government schemes available for your entire family — scholarships, skill training, loans' },
          { icon: '💡', title: 'Income Diversification', desc: 'Guide multiple family members toward different income sources for financial stability' },
        ].map((b, i) => (
          <div key={i} className="col-md-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{b.icon}</span>
              <div>
                <h6 style={{ marginBottom: 4 }}>{b.title}</h6>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{b.desc}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Invite */}
      <div style={{ background: 'var(--gradient)', borderRadius: 16, padding: '24px 28px', color: '#fff', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>👨‍👩‍👧‍👦</div>
        <h5 style={{ color: '#fff', marginBottom: 8 }}>Invite Your Family Members!</h5>
        <p style={{ opacity: 0.9, marginBottom: 20, fontSize: 14 }}>
          Share CareerSaathi with your siblings, children, or parents. It's completely free and can transform the career prospects of your entire family.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
          <span>🔗 careersaathi.app/register</span>
          <button onClick={() => navigator.clipboard?.writeText('https://careersaathi.app/register')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, padding: '3px 10px', color: '#fff', cursor: 'pointer', fontSize: 12 }}>Copy</button>
        </div>
      </div>
    </div>
  );
}
