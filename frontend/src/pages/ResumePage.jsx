import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiStar, FiMessageSquare, FiZap } from 'react-icons/fi';
import { resumeAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ResumePage() {
  const [tab, setTab] = useState('review');
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [review, setReview] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [interviewRole, setInterviewRole] = useState('');
  const [interviewLevel, setInterviewLevel] = useState('fresher');
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!resumeText.trim()) return;
    setLoading(true); setReview('');
    try {
      const { data } = await resumeAPI.review({ resumeText, targetRole });
      setReview(data.review);
    } catch (err) { setReview('Error: ' + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  const handleSuggestions = async () => {
    setLoading(true); setSuggestions('');
    try {
      const { data } = await resumeAPI.getSuggestions();
      setSuggestions(data.suggestions);
    } catch (err) { setSuggestions('Error: ' + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  const handleInterviewQuestions = async () => {
    if (!interviewRole.trim()) return;
    setLoading(true); setQuestions('');
    try {
      const { data } = await resumeAPI.getInterviewQuestions(interviewRole, interviewLevel);
      setQuestions(data.questions);
    } catch (err) { setQuestions('Error: ' + (err.response?.data?.message || err.message)); }
    finally { setLoading(false); }
  };

  const TABS = [
    { id: 'review', label: '📝 Resume Review' },
    { id: 'builder', label: '🏗️ Resume Builder' },
    { id: 'interview', label: '🎤 Interview Prep' },
  ];

  const MarkdownOutput = ({ content }) => (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
        <FiZap size={14} color="#6366f1" /><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>IBM Llama Analysis</span>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        p: ({children}) => <p style={{ fontSize: 14, marginBottom: 10 }}>{children}</p>,
        h2: ({children}) => <h2 style={{ fontSize: 16, margin: '16px 0 8px', color: 'var(--primary-light)' }}>{children}</h2>,
        h3: ({children}) => <h3 style={{ fontSize: 15, margin: '12px 0 6px' }}>{children}</h3>,
        ul: ({children}) => <ul style={{ paddingLeft: 18 }}>{children}</ul>,
        li: ({children}) => <li style={{ fontSize: 13, marginBottom: 4 }}>{children}</li>,
        strong: ({children}) => <strong style={{ color: 'var(--text-heading)' }}>{children}</strong>,
      }}>{content}</ReactMarkdown>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📝</div>
        <div>
          <h2 style={{ margin: 0 }}>Resume & Interview Assistant</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>AI-powered resume review and interview preparation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent', color: tab === t.id ? 'var(--primary-light)' : 'var(--text-muted)', fontWeight: tab === t.id ? 700 : 400, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Resume Review */}
      {tab === 'review' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h5 style={{ marginBottom: 16 }}>📝 AI Resume Review</h5>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Paste your resume content below for ATS scoring and improvement suggestions.</p>
            <div className="mb-3">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Target Job Role (optional)</label>
              <input className="form-control" placeholder="e.g., Software Developer, Government Officer, Data Analyst..." value={targetRole} onChange={e => setTargetRole(e.target.value)} />
            </div>
            <div className="mb-3">
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Paste Resume Content *</label>
              <textarea className="form-control" rows={10} placeholder="Paste your resume text here... Include your education, skills, experience, projects, etc." value={resumeText} onChange={e => setResumeText(e.target.value)} style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 13 }} />
            </div>
            <button onClick={handleReview} disabled={!resumeText.trim() || loading} className="btn-gradient d-flex align-items-center gap-2" style={{ padding: '10px 24px' }}>
              {loading ? <><span className="spinner-border spinner-border-sm" /> Analyzing...</> : <><FiStar size={15} /> Analyze Resume</>}
            </button>
          </div>
          {loading && <LoadingSpinner />}
          {review && <MarkdownOutput content={review} />}
        </motion.div>
      )}

      {/* Resume Builder */}
      {tab === 'builder' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h5 style={{ marginBottom: 12 }}>🏗️ AI Resume Builder Suggestions</h5>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
              Based on your profile, IBM Llama will generate personalized resume content including professional summary, skills section, and more.
            </p>
            <button onClick={handleSuggestions} disabled={loading} className="btn-gradient d-flex align-items-center gap-2" style={{ padding: '10px 24px' }}>
              {loading ? <><span className="spinner-border spinner-border-sm" /> Generating...</> : <><FiZap size={15} /> Generate Resume Suggestions</>}
            </button>
          </div>
          {loading && <LoadingSpinner />}
          {suggestions && <MarkdownOutput content={suggestions} />}
        </motion.div>
      )}

      {/* Interview Prep */}
      {tab === 'interview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h5 style={{ marginBottom: 16 }}>🎤 Interview Question Generator</h5>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Get AI-generated interview questions with answer guidelines for your target role.</p>
            <div className="row g-3 mb-3">
              <div className="col-md-7">
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Job Role *</label>
                <input className="form-control" placeholder="e.g., Software Developer, Bank Clerk, Data Analyst..." value={interviewRole} onChange={e => setInterviewRole(e.target.value)} />
              </div>
              <div className="col-md-5">
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Experience Level</label>
                <select className="form-select" value={interviewLevel} onChange={e => setInterviewLevel(e.target.value)}>
                  <option value="fresher">Fresher / 0 Experience</option>
                  <option value="junior">Junior (1-2 years)</option>
                  <option value="mid">Mid-level (2-5 years)</option>
                </select>
              </div>
            </div>
            <button onClick={handleInterviewQuestions} disabled={!interviewRole.trim() || loading} className="btn-gradient d-flex align-items-center gap-2" style={{ padding: '10px 24px' }}>
              {loading ? <><span className="spinner-border spinner-border-sm" /> Generating...</> : <><FiMessageSquare size={15} /> Generate Questions</>}
            </button>
          </div>
          {loading && <LoadingSpinner />}
          {questions && <MarkdownOutput content={questions} />}
        </motion.div>
      )}
    </div>
  );
}

