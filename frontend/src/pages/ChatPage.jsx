import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiPlus, FiTrash2, FiMessageSquare, FiZap } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatAPI } from '../services/api';

const SUGGESTED_PROMPTS = [
  '🎯 What careers suit a 10th pass student from rural area?',
  '🏛️ How to apply for PMKVY skill training program?',
  '💻 How to start learning IT without a computer at home?',
  '📚 Best free government scholarships for Class 12 students?',
  '🌾 What are good AgriTech career opportunities for farmers?',
  '🚀 How to start a small business with government support?',
  '📝 Help me prepare for SSC CGL examination',
  '🎓 Which vocational courses have best job prospects?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchSessions();
    // Welcome message
    setMessages([{
      role: 'assistant',
      content: `🙏 **Namaste! I'm CareerSaathi**, your AI Career Counselor powered by IBM Llama.

I'm here to help you with:
- 🎯 **Personalized career guidance** based on your background
- 🏛️ **Government schemes** like PMKVY, NSP, DDU-GKY
- 📚 **Free learning resources** from SWAYAM, NPTEL, YouTube
- 🗺️ **Step-by-step career roadmaps**
- 📝 **Resume & interview preparation**

Tell me about yourself — your education, interests, and career dreams — and I'll guide you! Or click one of the suggested prompts below to get started. 💪`,
      timestamp: new Date(),
    }]);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchSessions = async () => {
    try {
      const { data } = await chatAPI.getSessions();
      setSessions(data.sessions || []);
    } catch {}
  };

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setLoading(true);

    const userMessage = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data } = await chatAPI.send({ message: msg, sessionId, context: 'general' });
      setSessionId(data.sessionId);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date() }]);
      await fetchSessions();
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ **Sorry, I encountered an error.** Please check your connection and try again.\n\n*Error: ${err.response?.data?.message || err.message}*`, timestamp: new Date() }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, sessionId]);

  const loadSession = async (id) => {
    try {
      const { data } = await chatAPI.getSession(id);
      setSessionId(id);
      setMessages(data.session.messages.map(m => ({ ...m, timestamp: m.timestamp || new Date() })));
    } catch {}
  };

  const newChat = async () => {
    try {
      const { data } = await chatAPI.newSession('general');
      setSessionId(data.sessionId);
      setMessages([{ role: 'assistant', content: '✨ **New chat started!** How can I help you with your career today?', timestamp: new Date() }]);
    } catch {
      setSessionId(null);
      setMessages([{ role: 'assistant', content: '✨ **New chat started!** How can I help you today?', timestamp: new Date() }]);
    }
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await chatAPI.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (sessionId === id) newChat();
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', gap: 16 }}>
      {/* Chat History Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <button onClick={newChat} className="btn-gradient w-100 d-flex align-items-center justify-content-center gap-2" style={{ padding: '8px', fontSize: 13 }}>
                <FiPlus size={14} /> New Chat
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 8px', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Recent Chats</div>
              {sessions.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px', textAlign: 'center' }}>No previous chats</p>}
              {sessions.map(s => (
                <div key={s.id} onClick={() => loadSession(s.id)}
                  style={{ padding: '8px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2, background: s.id === sessionId ? 'var(--gradient-soft)' : 'transparent', border: s.id === sessionId ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent', position: 'relative' }}
                  className="d-flex align-items-start gap-2">
                  <FiMessageSquare size={13} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.messageCount} messages</div>
                  </div>
                  <button onClick={(e) => deleteSession(s.id, e)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: 2, cursor: 'pointer', opacity: 0.5 }}>
                    <FiTrash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 8px', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <FiMessageSquare size={15} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>CareerSaathi AI</div>
            <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}><FiZap size={10} /> IBM Llama · Always Online</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🤖</div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>CareerSaathi</span>
                </div>
              )}
              <div className={`chat-bubble ${msg.role === 'user' ? 'user' : 'assistant'}`} style={{ maxWidth: '75%' }}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    p: ({children}) => <p style={{ margin: '4px 0', fontSize: 14 }}>{children}</p>,
                    ul: ({children}) => <ul style={{ paddingLeft: 18, margin: '6px 0' }}>{children}</ul>,
                    li: ({children}) => <li style={{ fontSize: 14, marginBottom: 2 }}>{children}</li>,
                    strong: ({children}) => <strong style={{ color: 'var(--primary-light)' }}>{children}</strong>,
                    h3: ({children}) => <h3 style={{ fontSize: 15, margin: '8px 0 4px', color: 'var(--text-heading)' }}>{children}</h3>,
                    code: ({children}) => <code style={{ background: 'rgba(99,102,241,0.1)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>{children}</code>,
                  }}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <span style={{ fontSize: 14 }}>{msg.content}</span>
                )}
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🤖</div>
              <div className="chat-bubble assistant" style={{ padding: '12px 16px' }}>
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 20px 12px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Suggested Questions</div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {SUGGESTED_PROMPTS.slice(0, 4).map((p, i) => (
                <button key={i} onClick={() => sendMessage(p)}
                  style={{ background: 'var(--gradient-soft)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '7px 12px', fontSize: 12, color: 'var(--text)', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Ask your career question... (Press Enter to send, Shift+Enter for new line)"
              style={{ flex: 1, background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', color: 'var(--text)', fontSize: 14, resize: 'none', outline: 'none', maxHeight: 120, lineHeight: 1.5, fontFamily: 'inherit' }}
              rows={1} onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }} />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn-gradient"
              style={{ padding: '10px 16px', borderRadius: 12, height: 42, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, opacity: (!input.trim() || loading) ? 0.5 : 1 }}>
              <FiSend size={15} />
            </button>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
            Powered by IBM Llama · For guidance only · Verify from official sources
          </div>
        </div>
      </div>
    </div>
  );
}

