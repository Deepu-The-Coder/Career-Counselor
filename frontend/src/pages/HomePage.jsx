import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight, FiStar, FiBriefcase, FiBook, FiUsers, FiAward,
  FiMapPin, FiCheckCircle, FiMoon, FiSun, FiZap, FiMessageSquare,
  FiTarget, FiMap, FiFileText, FiShield,
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const STATS = [
  { label: 'Rural Students Guided', value: '50,000+', icon: FiUsers },
  { label: 'Career Paths Available', value: '200+', icon: FiBriefcase },
  { label: 'Government Schemes', value: '100+', icon: FiAward },
  { label: 'Free Resources', value: '500+', icon: FiBook },
];

const FEATURES = [
  { icon: FiMessageSquare, title: 'AI Career Chat', desc: 'IBM Llama-powered personalized counseling in simple language, 24/7 availability', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { icon: FiTarget, title: 'Career Assessment', desc: 'Discover your strengths, interests, and best-fit career paths through smart evaluation', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { icon: FiMap, title: 'Personalized Roadmap', desc: 'Step-by-step career journey from your current position to your dream goal', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  { icon: FiAward, title: 'Govt Schemes Explorer', desc: 'PMKVY, NSP, DDU-GKY and 100+ schemes with eligibility and application guides', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { icon: FiBook, title: 'Free Learning Resources', desc: 'SWAYAM, NPTEL, DIKSHA and curated free courses for skill development', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { icon: FiFileText, title: 'Resume & Interview', desc: 'AI-powered resume review, ATS optimization, and interview preparation', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { icon: FiUsers, title: 'Family Dashboard', desc: 'Manage career guidance for the entire family from a single platform', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { icon: FiMapPin, title: 'Rural Opportunities', desc: 'Local job listings, skill centers, vocational institutes, and agri-tech careers', color: '#84cc16', bg: 'rgba(132,204,22,0.1)' },
];

const TESTIMONIALS = [
  { name: 'Rahul Kumar', location: 'Gaya, Bihar', text: 'CareerSaathi helped me discover IT careers I never knew were possible from my village. Got placed in a software company!', career: 'Software Developer', rating: 5 },
  { name: 'Priya Devi', location: 'Nandurbar, Maharashtra', text: 'The government schemes section helped me apply for PMKVY and get free skill training. Now I run my own tailoring business.', career: 'Entrepreneur', rating: 5 },
  { name: 'Suresh Yadav', location: 'Muzaffarpur, Bihar', text: 'The AI counselor guided me step-by-step for SSC exam preparation. I am now a government employee!', career: 'Govt. Employee', rating: 5 },
];

const CAREER_DOMAINS = [
  '🏛️ Government Jobs', '💻 IT & Software', '🌾 Agriculture & AgriTech', '⚡ Skill Development',
  '🚀 Entrepreneurship', '📖 Higher Education', '🎓 Scholarships', '🔧 Vocational Training',
];

const TRUST_ITEMS = ['Free to Use', 'No Experience Needed', 'Hindi Friendly', 'Government Verified'];

export default function HomePage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        padding: '12px 0',
        background: isScrolled ? 'var(--bg-surface)' : 'transparent',
        borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
        backdropFilter: isScrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: isScrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 38, height: 38, borderRadius: '11px',
              background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}>🎯</div>
            <span style={{ fontWeight: 800, fontSize: 20, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
              CareerSaathi
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button onClick={toggleDarkMode} style={{
              background: 'var(--bg-glass-strong)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '7px 11px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}>
              {darkMode ? <FiSun size={15} /> : <FiMoon size={15} />}
            </button>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, padding: '8px 16px', fontSize: 14 }}>
              Sign In
            </Link>
            <Link to="/register" className="btn-gradient" style={{ borderRadius: '11px', textDecoration: 'none', padding: '9px 22px', fontSize: 14 }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero-section" style={{ paddingTop: '80px' }}>
        <div className="hero-bg-orb orb1" />
        <div className="hero-bg-orb orb2" />
        <div className="hero-bg-orb orb3" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeUp}>
                  <span className="section-tag"><FiZap size={10} style={{ marginRight: 4 }} /> Powered by IBM Llama AI</span>
                </motion.div>
                <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.03em' }}>
                  Your AI Career Guide for{' '}
                  <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Rural India's Future
                  </span>
                </motion.h1>
                <motion.p variants={fadeUp} style={{ fontSize: 17, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.8, maxWidth: 500 }}>
                  Personalized career guidance, government scheme discovery, skill development paths, and job preparation — all in one place. Designed for rural youth aged 14–30.
                </motion.p>
                <motion.div variants={fadeUp} className="d-flex flex-wrap gap-3">
                  <Link to="/register" className="btn-gradient d-flex align-items-center gap-2" style={{ fontSize: 16, padding: '13px 30px', borderRadius: '13px', textDecoration: 'none' }}>
                    Start Free Career Guidance <FiArrowRight />
                  </Link>
                  <Link to="/login" style={{ padding: '13px 28px', border: '1px solid var(--border)', borderRadius: '13px', color: 'var(--text)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-glass-strong)', backdropFilter: 'blur(12px)', fontSize: 15 }}>
                    <FiZap size={15} color="#f59e0b" /> Live Demo
                  </Link>
                </motion.div>
                <motion.div variants={fadeUp} className="d-flex flex-wrap gap-4 mt-4">
                  {TRUST_ITEMS.map(t => (
                    <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                      <FiCheckCircle color="#10b981" size={14} /> {t}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}>
                <HeroCard />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="row g-4">
            {STATS.map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: '14px',
                    background: 'var(--gradient-soft)',
                    border: '1px solid var(--border-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <stat.icon size={22} color="var(--primary-light)" />
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Career Domains ── */}
      <section style={{ padding: '88px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Career Paths</span>
            <h2 style={{ fontSize: 34, marginTop: 10, letterSpacing: '-0.02em' }}>Explore 200+ Career Domains</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '12px auto 0', fontSize: 15 }}>
              From government jobs to entrepreneurship, tech careers to agriculture — guidance for every path.
            </p>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {CAREER_DOMAINS.map((domain, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, ease: [0.4, 0, 0.2, 1] }}
                viewport={{ once: true }}
                style={{
                  background: 'var(--bg-glass-strong)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '10px 22px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(12px)',
                }}
                whileHover={{ scale: 1.05, borderColor: 'var(--primary)', boxShadow: '0 4px 16px rgba(99,102,241,0.2)' }}
              >
                {domain}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{ padding: '88px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Features</span>
            <h2 style={{ fontSize: 34, marginTop: 10, letterSpacing: '-0.02em' }}>Everything You Need to Succeed</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '12px auto 0', fontSize: 15 }}>
              Comprehensive career guidance platform built for rural India's next generation.
            </p>
          </div>
          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, ease: [0.4, 0, 0.2, 1] }}
                  viewport={{ once: true }}
                  className="glass-card"
                  style={{ padding: '26px 22px', height: '100%' }}
                >
                  {/* Premium icon box */}
                  <div style={{
                    width: 50, height: 50, borderRadius: '14px',
                    background: f.bg,
                    border: `1px solid ${f.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <f.icon size={22} color={f.color} />
                  </div>
                  <h5 style={{ marginBottom: 8, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>{f.title}</h5>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '88px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-tag">Success Stories</span>
            <h2 style={{ fontSize: 34, marginTop: 10, letterSpacing: '-0.02em' }}>Real Students, Real Results</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="col-md-4">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  viewport={{ once: true }}
                  className="glass-card"
                  style={{ padding: '28px 24px' }}
                >
                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                    {[...Array(t.rating)].map((_, j) => <FiStar key={j} size={13} color="#f59e0b" fill="#f59e0b" />)}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 18, lineHeight: 1.75, fontStyle: 'italic' }}>
                    "{t.text}"
                  </p>
                  <div className="d-flex align-items-center gap-10" style={{ gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FiMapPin size={10} /> {t.location} · <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{t.career}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: '88px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: [0.4, 0, 0.2, 1] }}>
            <span className="section-tag" style={{ marginBottom: 16 }}>Get Started</span>
            <h2 style={{ fontSize: 38, marginBottom: 16, letterSpacing: '-0.03em', fontWeight: 900 }}>
              Start Your Career Journey{' '}
              <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Today — Free!</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 36px', fontSize: 16, lineHeight: 1.7 }}>
              Join 50,000+ rural youth who have discovered their career path with CareerSaathi powered by IBM Llama AI.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/register" className="btn-gradient d-inline-flex align-items-center gap-2" style={{ fontSize: 16, padding: '14px 36px', borderRadius: '14px', textDecoration: 'none' }}>
                Create Free Account <FiArrowRight />
              </Link>
              <Link to="/login" style={{ fontSize: 15, padding: '14px 28px', borderRadius: '14px', textDecoration: 'none', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-glass-strong)', backdropFilter: 'blur(12px)' }}>
                <FiShield size={15} /> Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '44px 0', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div style={{ width: 32, height: 32, borderRadius: '9px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎯</div>
                <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>CareerSaathi</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 0, lineHeight: 1.6 }}>
                AI Career Counselor for Rural India<br />Powered by IBM Llama &amp; Watsonx.ai
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginBottom: 6 }}>
                <span className="auth-feature-pill" style={{ fontSize: 11 }}><FiZap size={9} /> IBM Llama AI</span>
                <span className="auth-feature-pill" style={{ fontSize: 11 }}><FiShield size={9} /> Secure Platform</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                © 2024 CareerSaathi. Built with IBM Watsonx.ai &amp; IBM Llama Models.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroCard() {
  const [typing, setTyping] = useState(true);
  const [messages] = useState([
    { role: 'user', text: 'I passed 10th class. What should I do for an IT job?' },
    { role: 'ai', text: '🎉 Great question! After 10th, here\'s your path to IT:\n\n1. ✅ Complete 12th (Science/PCM preferred)\n2. 💻 Start free coding on SWAYAM/YouTube\n3. 🎓 Enroll in PMKVY Digital program\n4. 🏆 Get certified — Python, Web Dev\n\nYou can earn ₹3-8 LPA in 2-3 years!' },
  ]);

  useEffect(() => { setTimeout(() => setTyping(false), 2000); }, []);

  return (
    <div className="glass-card" style={{ padding: 24, maxWidth: 460, margin: '0 auto' }}>
      {/* Chat header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'var(--gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
          boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>CareerSaathi AI</div>
          <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            Online · IBM Llama
          </div>
        </div>
        <span className="badge-gradient" style={{ marginLeft: 'auto', fontSize: 9 }}>AI</span>
      </div>

      {/* Messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200 }}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role === 'user' ? 'user' : 'assistant'}`} style={{ fontSize: 13, whiteSpace: 'pre-line' }}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="chat-bubble assistant" style={{ width: 'fit-content', padding: '12px 16px' }}>
            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{
        marginTop: 16, padding: '10px 14px',
        background: 'var(--input-bg)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        fontSize: 13, color: 'var(--text-muted)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ flex: 1 }}>Ask your career question...</span>
        <button className="btn-gradient" style={{ padding: '5px 14px', fontSize: 12, borderRadius: 8, flexShrink: 0 }}>Send</button>
      </div>
    </div>
  );
}

