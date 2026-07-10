import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { FiSave, FiUser, FiMapPin, FiBook, FiTarget, FiCheckCircle } from 'react-icons/fi';

const EDUCATION_LEVELS = ['Below 8th', '8th Pass', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Other'];
const CAREER_FIELDS = ['Government Jobs', 'IT Careers', 'Agriculture & AgriTech', 'Entrepreneurship', 'Vocational Courses', 'Skill Development', 'Freelancing', 'Higher Education', 'Healthcare', 'Teaching'];
const INDIAN_STATES = ['Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Jharkhand', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other'];

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: '', age: '', gender: '', education: { level: '', stream: '', currentClass: '', percentage: '' }, location: { village: '', district: '', state: '', pincode: '' }, interests: '', skills: '', languages: '', careerGoals: '', preferredCareerFields: [], bio: '', familyBackground: { occupation: '', annualIncome: '' } });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        education: { level: profile.education?.level || '', stream: profile.education?.stream || '', currentClass: profile.education?.currentClass || '', percentage: profile.education?.percentage || '' },
        location: { village: profile.location?.village || '', district: profile.location?.district || '', state: profile.location?.state || '', pincode: profile.location?.pincode || '' },
        interests: profile.interests?.join(', ') || '',
        skills: profile.skills?.join(', ') || '',
        languages: profile.languages?.join(', ') || '',
        careerGoals: profile.careerGoals || '',
        preferredCareerFields: profile.preferredCareerFields || [],
        bio: profile.bio || '',
        familyBackground: { occupation: profile.familyBackground?.occupation || '', annualIncome: profile.familyBackground?.annualIncome || '' },
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        age: form.age ? parseInt(form.age) : undefined,
        interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await profileAPI.update(payload);
      updateProfile(data.profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleField = (field) => {
    setForm(prev => ({
      ...prev,
      preferredCareerFields: prev.preferredCareerFields.includes(field)
        ? prev.preferredCareerFields.filter(f => f !== field)
        : [...prev.preferredCareerFields, field],
    }));
  };

  const completeness = profile?.profileComplete || 0;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👤</div>
        <div>
          <h2 style={{ margin: 0 }}>My Profile</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Complete your profile for personalized AI guidance</p>
        </div>
      </div>

      {/* Completeness Bar */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 24 }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span style={{ fontSize: 14, fontWeight: 600 }}>Profile Completeness</span>
          <span style={{ fontSize: 20, fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{completeness}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 4 }}>
          <div style={{ height: '100%', width: `${completeness}%`, background: 'var(--gradient)', borderRadius: 4, transition: 'width 0.8s' }} />
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, marginBottom: 0 }}>
          {completeness < 50 ? '⚡ Add more details for better AI career recommendations!' : completeness < 80 ? '🔥 Almost there! A few more fields will unlock personalized guidance.' : '✅ Great profile! AI can now give you highly personalized guidance.'}
        </p>
      </div>

      {error && <div className="alert alert-danger" style={{ borderRadius: 10, marginBottom: 16 }}>{error}</div>}
      {saved && (
        <div className="alert" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiCheckCircle color="#10b981" size={16} /> Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Info */}
        <Section title="Personal Information" icon="👤">
          <div className="row g-3">
            <div className="col-md-6"><F label="Full Name" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="Your full name" /></div>
            <div className="col-md-3"><F label="Age" type="number" value={form.age} onChange={v => setForm({...form, age: v})} placeholder="18" /></div>
            <div className="col-md-3">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Gender</label>
              <select className="form-select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="">Select...</option>
                {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="col-12"><F label="Bio / About Me" value={form.bio} onChange={v => setForm({...form, bio: v})} placeholder="Tell us about yourself in 2-3 sentences..." textarea /></div>
          </div>
        </Section>

        {/* Education */}
        <Section title="Education" icon="🎓">
          <div className="row g-3">
            <div className="col-md-4">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Education Level</label>
              <select className="form-select" value={form.education.level} onChange={e => setForm({...form, education: {...form.education, level: e.target.value}})}>
                <option value="">Select level...</option>
                {EDUCATION_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="col-md-4"><F label="Stream / Subject" value={form.education.stream} onChange={v => setForm({...form, education: {...form.education, stream: v}})} placeholder="Science / Commerce / Arts" /></div>
            <div className="col-md-4"><F label="Current Class / Year" value={form.education.currentClass} onChange={v => setForm({...form, education: {...form.education, currentClass: v}})} placeholder="Class 12 / 2nd Year" /></div>
            <div className="col-md-4"><F label="Percentage / CGPA" type="number" value={form.education.percentage} onChange={v => setForm({...form, education: {...form.education, percentage: v}})} placeholder="75" /></div>
          </div>
        </Section>

        {/* Location */}
        <Section title="Location" icon="📍">
          <div className="row g-3">
            <div className="col-md-6"><F label="Village / Town" value={form.location.village} onChange={v => setForm({...form, location: {...form.location, village: v}})} placeholder="Your village or town name" /></div>
            <div className="col-md-6"><F label="District" value={form.location.district} onChange={v => setForm({...form, location: {...form.location, district: v}})} placeholder="Your district" /></div>
            <div className="col-md-6">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>State</label>
              <select className="form-select" value={form.location.state} onChange={e => setForm({...form, location: {...form.location, state: e.target.value}})}>
                <option value="">Select state...</option>
                {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-6"><F label="PIN Code" value={form.location.pincode} onChange={v => setForm({...form, location: {...form.location, pincode: v}})} placeholder="123456" /></div>
          </div>
        </Section>

        {/* Skills & Interests */}
        <Section title="Skills & Interests" icon="⚡">
          <div className="row g-3">
            <div className="col-12"><F label="Your Interests (comma-separated)" value={form.interests} onChange={v => setForm({...form, interests: v})} placeholder="Reading, Computers, Farming, Sports, Drawing..." /></div>
            <div className="col-12"><F label="Your Skills (comma-separated)" value={form.skills} onChange={v => setForm({...form, skills: v})} placeholder="Basic Computer, English, Math, Driving, Sewing..." /></div>
            <div className="col-12"><F label="Languages Known (comma-separated)" value={form.languages} onChange={v => setForm({...form, languages: v})} placeholder="Hindi, English, Marathi..." /></div>
            <div className="col-12"><F label="Career Goals" value={form.careerGoals} onChange={v => setForm({...form, careerGoals: v})} placeholder="I want to become a software engineer / government officer / entrepreneur..." textarea /></div>
          </div>
        </Section>

        {/* Preferred Fields */}
        <Section title="Preferred Career Fields" icon="🎯">
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Select all that interest you:</p>
          <div className="d-flex flex-wrap gap-2">
            {CAREER_FIELDS.map(f => (
              <button key={f} type="button" onClick={() => toggleField(f)}
                style={{ padding: '7px 14px', borderRadius: 10, border: `1px solid ${form.preferredCareerFields.includes(f) ? 'transparent' : 'var(--border)'}`, background: form.preferredCareerFields.includes(f) ? 'var(--gradient)' : 'transparent', color: form.preferredCareerFields.includes(f) ? '#fff' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
                {f}
              </button>
            ))}
          </div>
        </Section>

        {/* Family Background */}
        <Section title="Family Background" icon="👨‍👩‍👧">
          <div className="row g-3">
            <div className="col-md-6"><F label="Family Occupation" value={form.familyBackground.occupation} onChange={v => setForm({...form, familyBackground: {...form.familyBackground, occupation: v}})} placeholder="Farming, Labour, Business..." /></div>
            <div className="col-md-6">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Annual Family Income</label>
              <select className="form-select" value={form.familyBackground.annualIncome} onChange={e => setForm({...form, familyBackground: {...form.familyBackground, annualIncome: e.target.value}})}>
                <option value="">Select range...</option>
                {['Below ₹1 Lakh', '₹1-2.5 Lakh', '₹2.5-5 Lakh', '₹5-8 Lakh', 'Above ₹8 Lakh'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>
        </Section>

        <button type="submit" disabled={loading} className="btn-gradient d-flex align-items-center gap-2 ms-auto" style={{ padding: '11px 28px', fontSize: 15 }}>
          {loading ? <><span className="spinner-border spinner-border-sm" /> Saving...</> : <><FiSave size={16} /> Save Profile</>}
        </button>
      </form>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
      <h5 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span> {title}
      </h5>
      {children}
    </div>
  );
}

function F({ label, value, onChange, placeholder, type = 'text', textarea = false }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>{label}</label>
      {textarea ? (
        <textarea className="form-control" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} style={{ resize: 'none' }} />
      ) : (
        <input type={type} className="form-control" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}
