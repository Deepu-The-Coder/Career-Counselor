import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: '#6366f1', filter: 'blur(130px)', opacity: 0.07, top: '-10%', right: '5%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: '#06b6d4', filter: 'blur(100px)', opacity: 0.06, bottom: '5%', left: '5%', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        <div className="glass-card" style={{ padding: '44px 36px' }}>

          {/* Header */}
          <div className="text-center" style={{ marginBottom: 32 }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
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
            <h2 style={{ fontSize: 26, marginBottom: 6, fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
              Sign in to continue your career journey
            </p>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
            <span className="auth-feature-pill"><FiShield size={11} /> Secure Login</span>
            <span className="auth-feature-pill"><FiZap size={11} /> IBM Llama AI</span>
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
            {/* Email field */}
            <div style={{ marginBottom: 18 }}>
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

            {/* Password field */}
            <div style={{ marginBottom: 28 }}>
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
                  placeholder="••••••••"
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

            <button
              type="submit"
              className="btn-gradient w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ padding: '13px', fontSize: 15, borderRadius: 13 }}
              disabled={loading}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm" style={{ width: 16, height: 16 }} /> Signing in...</>
                : <>Sign In <FiArrowRight size={16} /></>
              }
            </button>
          </form>

          <div style={{ margin: '24px 0 0', textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            New to CareerSaathi?{' '}
            <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none' }}>
              Create Free Account
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--text-muted)' }}>
          Demo: use any email &amp; password "password123"
        </p>
      </motion.div>
    </div>
  );
}

