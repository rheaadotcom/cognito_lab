const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Route files
const auth = require('./routes/auth');
const experiments = require('./routes/experiment');
const responseRoutes = require('./routes/response');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/experiments', experiments);
app.use('/api/v1', responseRoutes); // Mounts /api/v1/responses and /api/v1/results/:experimentId

// Basic API Versioning route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CognitoLab API is running',
    version: '1.0.0'
  });
});

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

module.exports = app;
