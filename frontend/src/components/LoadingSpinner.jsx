import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullScreen = false }) {
  const content = (
    <div className="text-center">
      <div style={{ position: 'relative', width: 56, height: 56, margin: '0 auto' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#6366f1',
          borderRightColor: '#8b5cf6',
          animation: 'spin 0.8s linear infinite',
          position: 'absolute',
        }} />
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#06b6d4',
          animation: 'spin 1.2s linear infinite reverse',
          position: 'absolute', top: 8, left: 8,
        }} />
      </div>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 13 }}>Loading CareerSaathi...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
      }}>
        {content}
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
      {content}
    </div>
  );
}
