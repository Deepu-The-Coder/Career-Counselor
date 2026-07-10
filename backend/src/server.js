require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./utils/db');
const dns = require('dns')
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Route imports
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const chatRoutes = require('./routes/chat.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const roadmapRoutes = require('./routes/roadmap.routes');
const schemesRoutes = require('./routes/schemes.routes');
const resourcesRoutes = require('./routes/resources.routes');
const resumeRoutes = require('./routes/resume.routes');
const familyRoutes = require('./routes/family.routes');

const app = express();

// Trust proxy headers when running behind a load balancer or reverse proxy (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL ,
  'https://career-counselor-silk.vercel.app'
];
if (process.env.ADDITIONAL_ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ADDITIONAL_ALLOWED_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean));
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

// AI endpoints get relaxed limit
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: 'AI rate limit reached. Please wait a moment.' },
});
app.use('/api/chat', aiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/family', familyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Career Counselor API is running', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Career Counselor Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📡 API: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
