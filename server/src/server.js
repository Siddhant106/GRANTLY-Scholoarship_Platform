const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// 1. Initialize Database & Cache Connections
connectDB();
connectRedis();

// 2. Global Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Health Check & Root Status Endpoints (For Evaluators & Deployment Monitors)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    success: true,
    service: 'Grantly Backend API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Grantly Scholarship Platform API is running',
    status: 'healthy',
    version: '1.0.0',
  });
});

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ai', aiRoutes);

// 5. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;