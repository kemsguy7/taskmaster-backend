# TaskMaster Pro - Backend API

A comprehensive RESTful API for advanced todo management with priority levels, categories, due dates, search capabilities, and statistics.

## 🚀 Features

- **CRUD Operations** - Create, Read, Update, Delete todos
- **Priority System** - Low, Medium, High priority levels with color coding
- **Category Organization** - Organize todos by categories (work, personal, etc.)
- **Due Date Management** - Set and track due dates
- **Advanced Search & Filter** - Search by title/description, filter by status, priority, category
- **Statistics Dashboard** - Analytics on completion rates, priority distribution, categories
- **Data Validation** - Comprehensive input validation with MongoDB schemas
- **Error Handling** - Robust error handling with descriptive messages
- **Rate Limiting** - API protection against abuse
- **CORS Security** - Configurable cross-origin resource sharing
- **API Documentation** - Interactive Swagger UI documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Documentation**: Swagger UI with YAML configuration
- **Security**: Helmet, CORS, Rate Limiting
- **Development**: ts-node-dev for hot reloading

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd todo-backend
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todoapp (you can use your mongo connection string)
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:5000
NODE_ENV=development
```

### 3. Database Setup
**Option A: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Recommended)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env` file

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api/todos` | Get all todos (with filters) |
| POST | `/api/todos` | Create new todo |
| GET | `/api/todos/:id` | Get specific todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| GET | `/api/todos/api/stats` | Get statistics |

### Query Parameters for GET /api/todos
- `completed` - Filter by completion status (true/false)
- `priority` - Filter by priority (low/medium/high)
- `category` - Filter by category
- `search` - Search in title and description

## 🗂️ Project Structure
```
backend/
├── src/
│   ├── swagger/
│   │   └── swagger.yaml       # API documentation
│   ├── models/
│   │   └── Todo.ts           # MongoDB schema
│   ├── routes/
│   │   └── todos.ts          # Route handlers
│   ├── types/
│   │   └── Todo.ts           # TypeScript interfaces
│   ├── middleware/
│   │   └── errorHandler.ts   # Error handling
│   └── index.ts              # Main server file
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 📜 Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm test         # Run tests (when implemented)
```

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/todoapp` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `API_URL` | API base URL | `http://localhost:5000` |
| `NODE_ENV` | Environment | `development` |

## 🚀 Deployment

### Railway/Render/Heroku
1. Connect your repository
2. Set environment variables:
   - `MONGODB_URI` (use MongoDB Atlas)
   - `FRONTEND_URL` (your frontend domain)
   - `NODE_ENV=production`
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 CORS Configuration

Update `allowedOrigins` in `src/index.ts` to add your domains:
```typescript
const allowedOrigins = [
  'http://localhost:5173',        // Vite dev server
  'https://yourdomain.com',       // Your production domain
  'https://yourapp.vercel.app',   // Deployment platform
];
```

## 📊 Database Schema

### Todo Model
```typescript
{
  title: String (required, max 100 chars)
  description: String (max 500 chars)
  completed: Boolean (default: false)
  priority: String (low/medium/high, default: medium)
  category: String (default: general)
  dueDate: Date (optional)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check network access settings in MongoDB Atlas
- Verify username/password in connection string

**CORS Errors:**
- Add your frontend domain to `allowedOrigins` array
- Ensure credentials are properly configured

**Port Conflicts:**
- Change the `PORT` environment variable
- Check if another service is using port 5000

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request


**Built with ❤️ using TypeScript, Express, and MongoDB**