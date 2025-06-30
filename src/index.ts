import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

// CORS origins - add your domains here
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
  'https://your-frontend-domain.com',
  'https://your-frontend-domain.vercel.app',
  // Add Swagger UI origins
  'https://editor.swagger.io',
  'https://petstore.swagger.io',
  'https://swagger.io',
  // frontend vercel domain 
  'https://todo-frontend-sigma-one.vercel.app',
  // Allow localhost for development
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined values


// Security middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman, or direct API calls)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log the rejected origin for debugging
      console.log('CORS rejected origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Setup Swagger Documentation
try {
  // Load Swagger document
  const swaggerPath = path.join(__dirname, 'swagger', 'swagger.yaml');
  const swaggerDocument = YAML.load(swaggerPath);

  // Update the servers based on environment
  swaggerDocument.servers = [
    {
      url: process.env.NODE_ENV === 'production'
        ? process.env.API_URL || 'https://todobackend.buyinbytes.com'
        : `http://localhost:${PORT}`,
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ];

  // Swagger UI options
  const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TaskMaster Pro API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
  };

  // Setup Swagger UI
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerOptions));

  console.log('✅ Swagger documentation loaded successfully');
} catch (error) {
  console.error('❌ Error setting up Swagger:', error);
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TaskMaster Pro API Server',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      todos: '/api/todos',
      stats: '/api/todos/api/stats',
      documentation: '/api-docs',
      health: '/health',
    },
    features: [
      'CRUD Operations',
      'Priority Levels',
      'Categories',
      'Due Dates',
      'Search & Filter',
      'Statistics',
      'Rate Limiting',
      'CORS Protection',
    ],
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/todos', todoRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      documentation: '/api-docs',
      todos: '/api/todos',
      health: '/health',
    },
  });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
      console.log(`🌐 CORS enabled for origins:`);
      allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });