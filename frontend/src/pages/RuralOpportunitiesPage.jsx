import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const OPPORTUNITIES = [
  { category: 'Local Jobs', icon: '💼', title: 'State Employment Portals', desc: 'Browse job opportunities in your state through official employment exchange portals.', link: 'https://www.ncs.gov.in', badge: 'Government' },
  { category: 'Skill Centers', icon: '🏫', title: 'Nearby ITI & Polytechnic', desc: 'Find Industrial Training Institutes and Polytechnic colleges in your district for vocational training.', link: 'https://www.ncvtmis.gov.in', badge: 'Free Training' },
  { category: 'Agriculture', icon: '🌾', title: 'AgriTech Careers', desc: 'Precision farming, drone operations, soil testing, organic certification, and agri-business opportunities.', link: 'https://agriinfra.dac.gov.in', badge: 'Growing Field' },
  { category: 'Entrepreneurship', icon: '🚀', title: 'Village-Level Business Ideas', desc: 'Dairy farming, poultry, organic food production, handicrafts, and e-commerce selling from home.', link: 'https://www.startupindia.gov.in', badge: 'Self-Employment' },
  { category: 'Digital Work', icon: '💻', title: 'Work from Home Opportunities', desc: 'Data entry, online tutoring, content writing, graphic design, and digital marketing from your village.', link: 'https://www.ncs.gov.in', badge: 'No Relocation' },
  { category: 'Government Jobs', icon: '🏛️', title: 'Local Body & Panchayat Jobs', desc: 'Gram Panchayat positions, ASHA workers, Anganwadi, state police, and district-level government jobs.', link: 'https://sarkariresult.com', badge: 'Stable Income' },
  { category: 'Skill Development', icon: '⚡', title: 'PMKVY Training Centers', desc: 'Find free PMKVY skill training centers near you in sectors like electronics, construction, hospitality.', link: 'https://pmkvyofficial.org', badge: 'Free + Stipend' },
  { category: 'Apprenticeship', icon: '🔧', title: 'National Apprenticeship Portal', desc: 'Get paid apprenticeship training in top companies. Earn ₹5,000-9,000/month while learning.', link: 'https://apprenticeshipindia.gov.in', badge: 'Earn While Learn' },
];

const AGRITECH_CAREERS = [
  { role: 'Drone Operator (Agriculture)', salary: '₹25,000-50,000/month', growth: 'Very High', desc: 'Operate agricultural drones for crop spraying and monitoring' },
  { role: 'Organic Farming Consultant', salary: '₹20,000-40,000/month', growth: 'High', desc: 'Guide farmers on organic certification and premium market access' },
  { role: 'Soil Testing Technician', salary: '₹15,000-25,000/month', growth: 'High', desc: 'Test soil samples and recommend fertilization strategies' },
  { role: 'FPO (Farmer Producer Org.) Manager', salary: '₹18,000-35,000/month', growth: 'Very High', desc: 'Manage collective farming operations and market linkages' },
];

export default function RuralOpportunitiesPage() {
  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌾</div>
        <div>
          <h2 style={{ margin: 0 }}>Rural Opportunities</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Local jobs, skill centers, and opportunities near you</p>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{ background: 'var(--gradient)', borderRadius: 16, padding: '20px 24px', marginBottom: 28, color: '#fff' }}>
        <h5 style={{ color: '#fff', marginBottom: 8 }}>🌟 Opportunities Are Closer Than You Think!</h5>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
          You don't always need to move to a city to build a successful career. Rural India has tremendous opportunities in agriculture technology, government jobs, skill development, and digital work. Explore them here.
        </p>
      </div>

      {/* Opportunity Cards */}
      <h5 style={{ marginBottom: 16 }}>🎯 Key Opportunity Areas</h5>
      <div className="row g-3 mb-5">
        {OPPORTUNITIES.map((opp, i) => (
          <div key={i} className="col-md-6 col-lg-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <span style={{ fontSize: 28 }}>{opp.icon}</span>
                <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: 'var(--gradient-soft)', color: 'var(--primary-light)', fontWeight: 600, border: '1px solid rgba(99,102,241,0.2)' }}>{opp.badge}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{opp.category}</div>
              <h6 style={{ marginBottom: 8 }}>{opp.title}</h6>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1, marginBottom: 16 }}>{opp.desc}</p>
              <a href={opp.link} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
                Explore <FiExternalLink size={11} />
              </a>
            </motion.div>
          </div>
        ))}
      </div>

      {/* AgriTech Careers */}
      <h5 style={{ marginBottom: 16 }}>🌱 Emerging AgriTech Career Paths</h5>
      <div className="row g-3 mb-5">
        {AGRITECH_CAREERS.map((career, i) => (
          <div key={i} className="col-md-6">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 style={{ margin: 0, fontSize: 14 }}>{career.role}</h6>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: career.growth === 'Very High' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: career.growth === 'Very High' ? '#10b981' : '#f59e0b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {career.growth} Growth
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981', marginBottom: 6 }}>{career.salary}</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{career.desc}</p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* AI Chat CTA */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
        <h5 style={{ marginBottom: 8 }}>Want Personalized Local Opportunities?</h5>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Tell CareerSaathi AI your district and career interests for hyper-local guidance and opportunities.</p>
        <Link to="/dashboard/chat" className="btn-gradient d-inline-flex align-items-center gap-2" style={{ textDecoration: 'none', padding: '10px 24px' }}>
          Ask CareerSaathi AI →
        </Link>
      </div>
    </div>
  );
}
