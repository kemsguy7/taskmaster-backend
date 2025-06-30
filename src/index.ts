import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API Server',
    version: '1.0.0',
    endpoints: {
      todos: '/api/todos',
      stats: '/api/todos/api/stats',
      docs: '/api/docs'
    }
  });
});

app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Todo API Documentation',
    version: '1.0.0',
    endpoints: [
      {
        method: 'GET',
        path: '/api/todos',
        description: 'Get all todos',
        query: {
          completed: 'boolean - filter by completion status',
          priority: 'string - filter by priority (low, medium, high)',
          category: 'string - filter by category',
          search: 'string - search in title and description'
        }
      },
      {
        method: 'GET',
        path: '/api/todos/:id',
        description: 'Get a specific todo by ID'
      },
      {
        method: 'POST',
        path: '/api/todos',
        description: 'Create a new todo',
        body: {
          title: 'string (required)',
          description: 'string (optional)',
          priority: 'string (optional) - low, medium, high',
          category: 'string (optional)',
          dueDate: 'string (optional) - ISO date'
        }
      },
      {
        method: 'PUT',
        path: '/api/todos/:id',
        description: 'Update a todo',
        body: {
          title: 'string (optional)',
          description: 'string (optional)',
          completed: 'boolean (optional)',
          priority: 'string (optional)',
          category: 'string (optional)',
          dueDate: 'string (optional)'
        }
      },
      {
        method: 'DELETE',
        path: '/api/todos/:id',
        description: 'Delete a todo'
      },
      {
        method: 'GET',
        path: '/api/todos/api/stats',
        description: 'Get todo statistics'
      }
    ]
  });
});

app.use('/api/todos', todoRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
