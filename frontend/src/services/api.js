import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// Profile
export const profileAPI = {
  get: () => API.get('/profile'),
  update: (data) => API.put('/profile', data),
  saveScheme: (schemeId) => API.post('/profile/save-scheme', { schemeId }),
  removeScheme: (schemeId) => API.delete(`/profile/scheme/${schemeId}`),
};

// Chat
export const chatAPI = {
  send: (data) => API.post('/chat/send', data),
  newSession: (context) => API.post('/chat/new', { context }),
  getSessions: () => API.get('/chat/sessions'),
  getSession: (id) => API.get(`/chat/sessions/${id}`),
  deleteSession: (id) => API.delete(`/chat/sessions/${id}`),
};

// Assessment
export const assessmentAPI = {
  getQuestions: () => API.get('/assessment/questions'),
  submit: (responses) => API.post('/assessment/submit', { responses }),
  getLatest: () => API.get('/assessment/latest'),
};

// Roadmap
export const roadmapAPI = {
  generate: (careerPath) => API.post('/roadmap/generate', { careerPath }),
  getAll: () => API.get('/roadmap'),
  updateMilestone: (data) => API.patch('/roadmap/milestone', data),
};

// Schemes
export const schemesAPI = {
  getAll: (params) => API.get('/schemes', { params }),
  getById: (id) => API.get(`/schemes/${id}`),
};

// Resources
export const resourcesAPI = {
  getAll: (params) => API.get('/resources', { params }),
};

// Resume
export const resumeAPI = {
  review: (data) => API.post('/resume/review', data),
  getInterviewQuestions: (role, level) => API.get('/resume/interview-questions', { params: { role, level } }),
  getSuggestions: () => API.get('/resume/suggestions'),
};

// Family
export const familyAPI = {
  getMembers: () => API.get('/family/members'),
  getStats: () => API.get('/family/stats'),
};
