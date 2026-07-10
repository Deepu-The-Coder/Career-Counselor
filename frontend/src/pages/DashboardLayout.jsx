import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiMessageSquare, FiTarget, FiMap, FiBookOpen, FiAward,
  FiUser, FiFileText, FiUsers, FiMapPin, FiX, FiSun, FiMoon,
  FiLogOut, FiZap, FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { to: '/dashboard',               label: 'Dashboard',           icon: FiHome,          end: true },
  { to: '/dashboard/chat',          label: 'AI Career Chat',      icon: FiMessageSquare, badge: 'AI' },
  { to: '/dashboard/assessment',    label: 'Career Assessment',   icon: FiTarget },
  { to: '/dashboard/roadmap',       label: 'Career Roadmap',      icon: FiMap },
  { to: '/dashboard/schemes',       label: 'Govt Schemes',        icon: FiAward },
  { to: '/dashboard/resources',     label: 'Learning Resources',  icon: FiBookOpen },
  { to: '/dashboard/resume',        label: 'Resume Assistant',    icon: FiFileText },
  { to: '/dashboard/opportunities', label: 'Rural Opportunities', icon: FiMapPin },
  { to: '/dashboard/family',        label: 'Family Dashboard',    icon: FiUsers },
  { to: '/dashboard/profile',       label: 'My Profile',          icon: FiUser },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // navbar hide/show state
  const [navbarHidden, setNavbarHidden]   = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  const lastScrollY   = useRef(0);
  const scrollTicking = useRef(false);
  const closeTimer    = useRef(null);
  const sidebarRef    = useRef(null);

  const { user, profile, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  /* ─── Scroll-aware navbar ─────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      if (scrollTicking.current) return;
      scrollTicking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // scrolled > 8px → show shadow
        setNavbarScrolled(y > 8);
        // hide after 80px of downward scroll; show on any upward move or near top
        if (y < 60) {
          setNavbarHidden(false);
        } else if (y > lastScrollY.current + 4) {
          setNavbarHidden(true);   // scrolling down
        } else if (y < lastScrollY.current - 4) {
          setNavbarHidden(false);  // scrolling up
        }
        lastScrollY.current = y;
        scrollTicking.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ─── Sidebar auto-close on mouse-leave ───────────────── */
  // We give a short grace period (250ms) so the user can move between
  // hamburger button and sidebar without it snapping shut.
  const handleSidebarLeave = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setSidebarOpen(false), 250);
  }, []);

  const handleSidebarEnter = useCallback(() => {
    clearTimeout(closeTimer.current);
  }, []);

  // Also clear timer on unmount
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const open   = () => { clearTimeout(closeTimer.current); setSidebarOpen(true); };
  const close  = () => setSidebarOpen(false);
  const toggle = () => setSidebarOpen(v => !v);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ════════════════════════════════════
          TOP NAVBAR — hide on scroll down
          ════════════════════════════════════ */}
      <header
        className={`dash-navbar${navbarHidden ? ' hidden' : ''}${navbarScrolled ? ' scrolled' : ''}`}
      >
        {/* Left: brand — click to open/close sidebar */}
        <button
          className="dash-navbar-brand"
          onClick={toggle}
          aria-label="Toggle navigation menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div>
            <div className="brand-name">CareerSaathi</div>
            <div className="brand-sub">
              <FiZap size={8} style={{ color: '#f59e0b', marginRight: 3 }} />
              IBM Llama AI
            </div>
          </div>
        </button>

        {/* Right: theme toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <FiSun size={15} /> : <FiMoon size={15} />}
        </button>
      </header>

      {/* ════════════════════════════════════
          ICON RAIL — always on the left
          ════════════════════════════════════ */}
      <div className="sidebar-rail">
        <div
          className="rail-logo"
          onClick={open}
          title="Open menu"
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && open()}
        >
          🎯
        </div>

        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `rail-icon-btn${isActive ? ' active' : ''}`}
            data-tip={item.label}
            onClick={close}
            title={item.label}
          >
            <item.icon size={17} />
          </NavLink>
        ))}

        <div className="rail-spacer" />
        <div className="rail-divider" />

        <button
          className="rail-icon-btn"
          data-tip={darkMode ? 'Light Mode' : 'Dark Mode'}
          onClick={toggleDarkMode}
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

        <button
          className="rail-icon-btn"
          data-tip="Logout"
          onClick={handleLogout}
          title="Logout"
          style={{ color: 'var(--danger)' }}
        >
          <FiLogOut size={16} />
        </button>
      </div>

      {/* ════════════════════════════════════
          OVERLAY — pure CSS, zero framer
          ════════════════════════════════════ */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════
          FULL SIDEBAR DRAWER — left, pure CSS
          Mouse-leave closes after 250ms grace
          ════════════════════════════════════ */}
      <aside
        ref={sidebarRef}
        className={`sidebar${sidebarOpen ? ' open' : ''}`}
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '15px 14px 13px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '10px',
              background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
            }}>🎯</div>
            <div>
              <div style={{
                fontWeight: 800, fontSize: 15,
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.03em',
              }}>
                CareerSaathi
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                <FiZap size={9} style={{ color: '#f59e0b' }} /> IBM Llama AI
              </div>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={close} aria-label="Close menu">
            <FiX size={13} />
          </button>
        </div>

        {/* User info — arrow navigates to profile */}
        <div style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <button
            onClick={() => { navigate('/dashboard/profile'); close(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 6px', borderRadius: 10,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--gradient-soft)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <div className="sidebar-avatar">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>
                {user?.name || 'Student'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                {profile?.profileComplete
                  ? `${profile.profileComplete}% complete`
                  : 'Complete your profile'}
              </div>
            </div>
            <FiChevronRight size={12} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
          </button>
          {profile && profile.profileComplete < 100 && (
            <div style={{ marginTop: 8, height: 3, background: 'var(--border)', borderRadius: 3 }}>
              <div style={{
                height: '100%',
                width: `${profile.profileComplete || 20}%`,
                background: 'var(--gradient)',
                borderRadius: 3,
                transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
              }} />
            </div>
          )}
        </div>

        {/* ── Navigation — ultra-smooth scroll ── */}
        <nav className="sidebar-nav-scroll">
          <div style={{
            fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
            letterSpacing: '1px', textTransform: 'uppercase',
            padding: '3px 6px 7px', marginBottom: 1,
          }}>
            Navigation
          </div>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={close}
              className={({ isActive }) => `nav-link-item${isActive ? ' active' : ''}`}
              style={{ marginBottom: 2 }}
            >
              <span className="nav-icon-box">
                <item.icon size={15} />
              </span>
              <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
              {item.badge && (
                <span className="badge-gradient" style={{ fontSize: 9 }}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <button
            onClick={toggleDarkMode}
            className="nav-link-item"
            style={{ border: 'none', background: 'none', marginBottom: 2, width: '100%' }}
          >
            <span className="nav-icon-box">
              {darkMode ? <FiSun size={15} /> : <FiMoon size={15} />}
            </span>
            <span style={{ flex: 1, fontSize: 13 }}>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="nav-link-item"
            style={{ border: 'none', background: 'none', color: 'var(--danger)', width: '100%' }}
          >
            <span className="nav-icon-box" style={{ background: 'rgba(239,68,68,0.12)' }}>
              <FiLogOut size={15} style={{ color: 'var(--danger)' }} />
            </span>
            <span style={{ flex: 1, fontSize: 13 }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════
          MAIN CONTENT
          ════════════════════════════════════ */}
      <main className="dashboard-content">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

