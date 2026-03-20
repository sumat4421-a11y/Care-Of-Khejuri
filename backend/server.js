const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_USERNAME'];
const missingEnvVars = requiredEnvVars.filter((envKey) => !process.env[envKey]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

if (!process.env.ADMIN_PASSWORD_HASH && !process.env.ADMIN_PASSWORD) {
  console.error('Missing admin password configuration. Set ADMIN_PASSWORD_HASH in .env.');
  process.exit(1);
}

if (!process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD) {
  console.warn('Using legacy ADMIN_PASSWORD. Migrate to ADMIN_PASSWORD_HASH for production security.');
}

const mongoUri = process.env.MONGODB_URI;
if (/[<>]/.test(mongoUri) || /<username>|<password>|<cluster-url>/.test(mongoUri)) {
  console.error('Invalid MONGODB_URI in .env. Replace placeholder values and URL-encode special password characters (e.g. @ as %40).');
  process.exit(1);
}

const app = express();

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server and same-origin requests without an Origin header.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS policy: origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/api', apiLimiter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const connectDatabase = async () => {
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected successfully');
};

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/events', require('./routes/events'));
app.use('/api/stories', require('./routes/stories'));

// Health check
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const statusCode = dbConnected ? 200 : 503;

  res.status(statusCode).json({
    status: dbConnected ? 'OK' : 'DEGRADED',
    message: dbConnected ? 'Server is healthy' : 'Server is running but database is disconnected',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : err.message,
    ...(isProduction ? {} : { error: err.message }),
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

startServer();
