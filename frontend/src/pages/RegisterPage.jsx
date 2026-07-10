import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiZap, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: FiZap,          text: 'Free AI career guidance' },
    { icon: FiCheckCircle,  text: 'Government scheme alerts' },
    { icon: FiCheckCircle,  text: 'Personalized roadmaps' },
    { icon: FiShield,       text: 'Resume assistance' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: '#8b5cf6', filter: 'blur(120px)', opacity: 0.07, top: '-5%', left: '-5%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: '#06b6d4', filter: 'blur(100px)', opacity: 0.06, bottom: '-5%', right: '5%', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', maxWidth: 480 }}
      >
        <div className="glass-card" style={{ padding: '44px 36px' }}>

          {/* Header */}
          <div className="text-center" style={{ marginBottom: 24 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '14px',
                background: 'var(--gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
              }}>🎯</div>
              <span style={{ fontWeight: 800, fontSize: 22, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
                CareerSaathi
              </span>
            </Link>
            <h2 style={{ fontSize: 26, marginBottom: 6, fontWeight: 800 }}>Start Your Journey Free</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
              No experience needed. No fees. Just guidance.
            </p>
          </div>

          {/* Benefits pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
            {benefits.map((b, i) => (
              <span key={i} className="auth-feature-pill">
                <b.icon size={11} /> {b.text}
              </span>
            ))}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 12,
              padding: '11px 14px',
              fontSize: 13,
              color: '#ef4444',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <FiShield size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">
                <FiUser size={12} /> Full Name
              </label>
              <div className="input-icon-wrap">
                <div className="input-icon-box">
                  <FiUser size={16} />
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">
                <FiMail size={12} /> Email Address
              </label>
              <div className="input-icon-wrap">
                <div className="input-icon-box">
                  <FiMail size={16} />
                </div>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label className="field-label">
                <FiLock size={12} /> Password
              </label>
              <div className="input-icon-wrap">
                <div className="input-icon-box">
                  <FiLock size={16} />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-control with-action"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 28 }}>
              <label className="field-label">
                <FiLock size={12} /> Confirm Password
              </label>
              <div className="input-icon-wrap">
                <div className="input-icon-box">
                  <FiCheckCircle size={16} />
                </div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-gradient w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ padding: '13px', fontSize: 15, borderRadius: 13 }}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm" style={{ width: 16, height: 16 }} /> Creating account...</>
                : <>Create Free Account <FiArrowRight size={16} /></>
              }
            </button>
          </form>

          <div style={{ margin: '22px 0 0', textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
