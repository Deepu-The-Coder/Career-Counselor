# 🎯 CareerSaathi — AI Career Counselor for Rural Youth

> **Powered by IBM Llama (Watsonx.ai) | MERN Stack | Built for Hackathons & Production**

[![IBM Watsonx](https://img.shields.io/badge/IBM-Watsonx.ai-blue?logo=ibm)](https://www.ibm.com/watsonx)
[![IBM Llama](https://img.shields.io/badge/IBM-Llama%203.0-purple?logo=ibm)](https://www.ibm.com/Llama)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)](https://www.mongodb.com/mern-stack)

---

## 📖 Overview

**CareerSaathi** is an AI-powered career counseling platform that empowers rural youth across India by providing:

- 🤖 **AI Career Chat** — IBM Llama-powered conversational counseling in simple language
- 🎯 **Career Assessment** — Discover your perfect career match with AI analysis
- 🗺️ **Personalized Roadmaps** — Step-by-step career paths from your current position to your goal
- 🏛️ **Government Schemes** — PMKVY, NSP, DDU-GKY, Mudra, and 100+ schemes
- 📚 **Learning Resources** — SWAYAM, NPTEL, DIKSHA, and curated free courses
- 📝 **Resume Assistant** — AI-powered review, ATS optimization, and interview prep
- 👨‍👩‍👧 **Family Dashboard** — Career guidance for every family member
- 🌾 **Rural Opportunities** — Local jobs, AgriTech careers, and skill centers

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Bootstrap 5, Framer Motion, React Router 6 |
| **Backend** | Node.js 18+, Express.js, JWT Auth, bcrypt |
| **AI** | IBM Watsonx.ai SDK, IBM Llama 3.0 (8B Instruct) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Security** | Helmet, express-mongo-sanitize, rate-limiting, CORS |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## 📁 Project Structure

```
career-counselor/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Watsonx.ai integration
│   │   ├── utils/          # DB connection
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth & Theme context
│   │   ├── pages/          # All page components
│   │   ├── services/       # API client (Axios)
│   │   ├── App.jsx         # Routes
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)
- IBM Cloud account with Watsonx.ai access
- Git

---

### 1. Clone and Setup

```bash
git clone https://github.com/your-username/career-counselor.git
cd career-counselor
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/career-counselor
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# IBM Watsonx.ai
IBM_CLOUD_API_KEY=your_ibm_cloud_api_key
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
IBM_WATSONX_PROJECT_ID=your_watsonx_project_id
IBM_LLAMA_MODEL_ID=ibm/llama-3-8b-instruct

FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

The default `.env` points to `/api` which proxies to your backend via Vite.

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔑 IBM Watsonx.ai Setup

### Step 1: Create IBM Cloud Account
1. Go to [cloud.ibm.com](https://cloud.ibm.com) and create a free account
2. Navigate to **Watsonx.ai** → **Launch**

### Step 2: Get API Key
1. Click your profile → **Manage → Access (IAM)**
2. **API Keys → Create an IBM Cloud API Key**
3. Copy the key → paste into `.env` as `IBM_CLOUD_API_KEY`

### Step 3: Create Watsonx Project
1. In Watsonx.ai, go to **Projects → Create Project**
2. Give it a name and copy the **Project ID**
3. Paste into `.env` as `IBM_WATSONX_PROJECT_ID`

### Step 4: Get Watsonx URL
- Default: `https://us-south.ml.cloud.ibm.com`
- Change region if your account is in EU or AP

### Step 5: Test Connection
```bash
curl http://localhost:5000/api/health
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### AI Chat
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/chat/send` | Send message (AI responds) |
| POST | `/api/chat/new` | Create new chat session |
| GET | `/api/chat/sessions` | Get all chat sessions |
| GET | `/api/chat/sessions/:id` | Get session messages |
| DELETE | `/api/chat/sessions/:id` | Delete session |

### Assessment
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/assessment/questions` | Get assessment questions |
| POST | `/api/assessment/submit` | Submit & get AI results |
| GET | `/api/assessment/latest` | Get latest assessment |

### Roadmap
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/roadmap/generate` | Generate AI roadmap |
| GET | `/api/roadmap` | Get all roadmaps |
| PATCH | `/api/roadmap/milestone` | Update milestone status |

### Schemes & Resources
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/schemes` | Get government schemes |
| GET | `/api/schemes/:id` | Get scheme details |
| GET | `/api/resources` | Get learning resources |

### Resume
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/resume/review` | AI resume review |
| GET | `/api/resume/interview-questions` | Get interview questions |
| GET | `/api/resume/suggestions` | Get resume suggestions |

---

## 🚀 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy!

### Backend → Render

1. Go to [Render](https://render.com) → **New Web Service**
2. Connect GitHub repo, set root to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all environment variables from `.env`
6. Set `NODE_ENV=production`
7. Deploy!

### Database → MongoDB Atlas

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with password
3. Whitelist all IPs (`0.0.0.0/0`) for Render
4. Copy connection string to `MONGODB_URI`

### Post-Deployment
- Update `FRONTEND_URL` in backend env to your Vercel URL
- Update `VITE_API_URL` in frontend env to your Render URL

---

## 🔒 Security Features

- 🔐 JWT authentication with 7-day expiry
- 🔑 Password hashing with bcrypt (12 rounds)
- 🛡️ Helmet security headers
- 🚫 MongoDB sanitization (NoSQL injection prevention)
- ⏱️ Rate limiting (100 req/15min; 30 AI req/min)
- 🔄 CORS restricted to frontend URL
- 📦 Input validation with Joi

---

## 🎨 UI Features

- 🌙 Dark/Light mode toggle (persisted)
- 📱 Fully responsive (mobile-first)
- ✨ Framer Motion page transitions and animations
- 💎 Glassmorphism card design
- 🎯 Blue-Purple gradient theme
- 💬 AI chat with markdown rendering
- 📊 Career match charts (Recharts)
- ⏳ Loading skeletons and typing indicators
- 📲 Progressive Web App (PWA) ready

---

## 🤖 IBM Llama Model

This application uses **IBM Llama 3.0 8B Instruct** (`ibm/llama-3-8b-instruct`):

- **Context**: Career counseling for rural Indian youth
- **Language**: Simple, encouraging, practical guidance
- **Safety**: No job guarantees, directs to official sources
- **Localization**: Indian government schemes, free resources, regional context
- **Domains**: Government jobs, IT, Agriculture, Entrepreneurship, Vocational

### AGENT_INSTRUCTIONS Config

Edit `backend/src/services/watsonx.service.js` → `AGENT_INSTRUCTIONS` to customize:
- Agent personality
- Career domains covered
- Safety rules
- Localization focus
- Career guidance style

---

## 🧪 Testing

```bash
# Test API health
curl http://localhost:5000/api/health

# Test with demo user
# Register at http://localhost:5173/register
# Use: email: demo@test.com / password: password123
```

---

## 📊 Supported Government Schemes

| Scheme | Category | Link |
|--------|---------|------|
| PMKVY | Skill Development | pmkvyofficial.org |
| National Scholarship Portal | Scholarships | scholarships.gov.in |
| Startup India | Entrepreneurship | startupindia.gov.in |
| PM Mudra Yojana | Micro Finance | mudra.org.in |
| DDU-GKY | Rural Skill | aajeevika.gov.in |
| NAPS | Apprenticeship | apprenticeshipindia.gov.in |
| PM YASASVI | OBC Scholarship | yet.nta.ac.in |
| Agriculture Infrastructure Fund | AgriTech | agriinfra.dac.gov.in |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License — Free to use and modify.

---

## 🙏 Acknowledgments

- **IBM Watsonx.ai** and **IBM Llama** for the AI backbone
- **Government of India** for open scheme data
- **SWAYAM, NPTEL, DIKSHA** for free education resources
- All rural youth of India who inspired this project

---

*Built with ❤️ for Rural India's Youth | Powered by IBM Llama AI*

