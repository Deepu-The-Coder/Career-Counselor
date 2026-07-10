import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronLeft, FiCheckCircle, FiZap, FiTarget } from 'react-icons/fi';
import { assessmentAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export default function AssessmentPage() {
  const [phase, setPhase] = useState('intro'); // intro | assessment | loading | results
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState({});
  const [results, setResults] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loadingQ, setLoadingQ] = useState(true);

  useEffect(() => {
    assessmentAPI.getQuestions()
      .then(({ data }) => { setQuestions(data.questions); setLoadingQ(false); })
      .catch(() => setLoadingQ(false));

    // Check for existing results
    assessmentAPI.getLatest()
      .then(({ data }) => { if (data.assessment) { setResults(data.assessment.results); setAiAnalysis(data.assessment.aiAnalysis); setPhase('results'); } })
      .catch(() => {});
  }, []);

  const handleAnswer = (qId, answer) => {
    setResponses(prev => ({ ...prev, [qId]: answer }));
  };

  const submitAssessment = async () => {
    setPhase('loading');
    const responseArray = questions.map(q => ({
      questionId: q.id, question: q.question, answer: responses[q.id] || '', category: q.category,
    })).filter(r => r.answer);

    try {
      const { data } = await assessmentAPI.submit(responseArray);
      setResults(data.assessment.results);
      setAiAnalysis(data.assessment.aiAnalysis);
      setPhase('results');
    } catch (err) {
      alert('Assessment error: ' + (err.response?.data?.message || err.message));
      setPhase('assessment');
    }
  };

  const progress = questions.length > 0 ? Math.round((Object.keys(responses).length / questions.length) * 100) : 0;

  if (loadingQ) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎯</div>
        <div>
          <h2 style={{ margin: 0 }}>Career Assessment</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Discover your perfect career path with AI analysis</p>
        </div>
      </div>

      {/* Intro Phase */}
      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="glass-card" style={{ padding: 32, textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
            <h3 style={{ marginBottom: 12 }}>AI-Powered Career Assessment</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.8 }}>
              Answer {questions.length} simple questions about your interests, skills, and goals. IBM Llama AI will analyze your responses and recommend the best career paths for you.
            </p>
            <div className="row g-3 mb-4 text-start">
              {[['⏱️ 5-10 minutes', 'Takes just a few minutes to complete'], ['🤖 AI Powered', 'IBM Llama analyzes your unique profile'], ['📊 Detailed Results', 'Career matches, strengths, and action plan'], ['🔄 Retake Anytime', 'Update as your goals evolve']].map(([title, desc], i) => (
                <div key={i} className="col-6">
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase('assessment')} className="btn-gradient d-inline-flex align-items-center gap-2" style={{ padding: '12px 32px', fontSize: 15 }}>
              <FiTarget size={16} /> Start Assessment
            </button>
          </div>
        </motion.div>
      )}

      {/* Assessment Phase */}
      {phase === 'assessment' && questions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Progress */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Question {current + 1} of {questions.length}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-light)' }}>{progress}% complete</span>
            </div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 4 }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient)', borderRadius: 4, transition: 'width 0.4s' }} />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <QuestionCard
                question={questions[current]}
                value={responses[questions[current]?.id]}
                onAnswer={(val) => handleAnswer(questions[current].id, val)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: '9px 20px', color: 'var(--text-muted)', cursor: current === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: current === 0 ? 0.4 : 1 }}>
              <FiChevronLeft size={16} /> Previous
            </button>
            {current < questions.length - 1 ? (
              <button onClick={() => setCurrent(current + 1)}
                className="btn-gradient d-flex align-items-center gap-2" style={{ padding: '9px 20px' }}>
                Next <FiChevronRight size={16} />
              </button>
            ) : (
              <button onClick={submitAssessment} disabled={Object.keys(responses).length < 6}
                className="btn-gradient d-flex align-items-center gap-2" style={{ padding: '9px 24px', opacity: Object.keys(responses).length < 6 ? 0.5 : 1 }}>
                <FiZap size={16} /> Get AI Results
              </button>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            Answered: {Object.keys(responses).length}/{questions.length} questions (minimum 6 required)
          </div>
        </motion.div>
      )}

      {/* Loading Phase */}
      {phase === 'loading' && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
          <h4 style={{ marginBottom: 8 }}>IBM Llama is Analyzing Your Profile...</h4>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>This may take 30-60 seconds</p>
          <LoadingSpinner />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '24px auto 0' }}>
            {['Analyzing your interests...', 'Matching career paths...', 'Generating recommendations...'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', animation: `fadeIn ${0.5 + i * 0.8}s forwards` }}>
                <FiCheckCircle size={13} color="#10b981" /> {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Phase */}
      {phase === 'results' && results && (
        <AssessmentResults results={results} aiAnalysis={aiAnalysis} onRetake={() => { setPhase('assessment'); setResponses({}); setCurrent(0); }} />
      )}
    </div>
  );
}

function QuestionCard({ question, value, onAnswer }) {
  if (!question) return null;

  return (
    <div className="question-card" style={{ borderColor: value ? 'var(--primary)' : 'var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span className="badge-gradient" style={{ fontSize: 11 }}>{question.category?.replace('_', ' ').toUpperCase()}</span>
        {value && <FiCheckCircle size={16} color="#10b981" />}
      </div>
      <h5 style={{ marginBottom: 20, lineHeight: 1.5 }}>{question.question}</h5>

      {question.type === 'choice' && question.options && (
        <div className="d-flex flex-column gap-2">
          {question.options.map((opt, i) => (
            <button key={i} onClick={() => onAnswer(opt)}
              style={{ textAlign: 'left', padding: '12px 16px', background: value === opt ? 'var(--gradient)' : 'var(--bg)', border: `1px solid ${value === opt ? 'transparent' : 'var(--border)'}`, borderRadius: 10, color: value === opt ? '#fff' : 'var(--text)', cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {question.type === 'text' && (
        <textarea value={value || ''} onChange={e => onAnswer(e.target.value)}
          placeholder="Type your answer here..." rows={3}
          className="form-control" style={{ resize: 'none', fontSize: 14 }} />
      )}

      {question.type === 'scale' && (
        <div>
          <input type="range" min={question.min || 1} max={question.max || 5} value={value || 3}
            onChange={e => onAnswer(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1' }} />
          <div className="d-flex justify-content-between" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            <span>Not comfortable ({question.min})</span><span>Selected: {value || 3}</span><span>Very comfortable ({question.max})</span>
          </div>
        </div>
      )}
    </div>
  );
}

function AssessmentResults({ results, aiAnalysis, onRetake }) {
  const radarData = results.topDomains?.map(d => ({ subject: d.domain.split(' ')[0], score: d.score })) || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 style={{ margin: 0 }}>Your Assessment Results</h3>
        <button onClick={onRetake} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 16px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>Retake</button>
      </div>

      {/* Overall Score */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card text-center">
            <div style={{ fontSize: 48, fontWeight: 900, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{results.overallScore}%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Overall Career Readiness</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card text-center">
            <div style={{ fontSize: 24, marginBottom: 4 }}>🧠</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{results.personalityType}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Personality Type</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card text-center">
            <div style={{ fontSize: 24, marginBottom: 4 }}>💼</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{results.workStyle}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Work Style</div>
          </div>
        </div>
      </div>

      {/* Career Matches */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <h5 style={{ marginBottom: 16 }}>🎯 Top Career Matches</h5>
        <div className="row g-3">
          {results.careerMatches?.map((match, i) => (
            <div key={i} className="col-md-4">
              <div style={{ background: 'var(--bg)', border: `1px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 12, padding: 16, position: 'relative' }}>
                {i === 0 && <span className="badge-gradient" style={{ position: 'absolute', top: -8, right: 12, fontSize: 9 }}>BEST MATCH</span>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{match.career}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: COLORS[i] }}>{match.matchScore}%</div>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 8 }}>
                  <div style={{ height: '100%', width: `${match.matchScore}%`, background: COLORS[i], borderRadius: 2, transition: 'width 1s' }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px' }}>{match.description}</p>
                <div className="d-flex flex-wrap gap-1">
                  {match.requiredSkills?.map((s, j) => (
                    <span key={j} style={{ fontSize: 10, background: 'var(--gradient-soft)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '2px 7px', color: 'var(--text-muted)' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="glass-card" style={{ padding: 20, height: '100%' }}>
            <h5 style={{ marginBottom: 12, color: '#10b981' }}>✅ Your Strengths</h5>
            {results.strengths?.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < results.strengths.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <FiCheckCircle size={14} color="#10b981" />
                <span style={{ fontSize: 14 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="glass-card" style={{ padding: 20, height: '100%' }}>
            <h5 style={{ marginBottom: 12, color: 'var(--warning)' }}>📈 Improvement Plan</h5>
            {results.improvementPlan?.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: i < results.improvementPlan.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ background: 'var(--gradient)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 13 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Domain Scores Chart */}
      {results.topDomains && results.topDomains.length > 0 && (
        <div className="glass-card" style={{ padding: 24 }}>
          <h5 style={{ marginBottom: 16 }}>📊 Career Domain Scores</h5>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.topDomains} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="domain" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} labelStyle={{ color: 'var(--text)' }} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {results.topDomains.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  );
}

