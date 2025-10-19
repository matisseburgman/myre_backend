# Myred Backend - Authentication System

Complete backend for the Myred iOS app with authentication, user management, and recipe APIs.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
1. Copy the example environment file:
```bash
cp config.env.example config.env
```

2. Edit `config.env` and add your values:
```env
# MongoDB Atlas Connection String
ATLAS_URI=mongodb+srv://username:password@cluster.mongodb.net/recipesData?retryWrites=true&w=majority

# JWT Secret (generate a strong secret key)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Port
PORT=3000
```

### 3. Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🧪 Testing

### Test Authentication Endpoints
```bash
# Install axios for testing
npm install axios

# Run the test script
node test-auth.js
```

### Manual Testing with curl

#### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/validate` | Validate token | Yes |
| GET | `/auth/me` | Get user profile | Yes |

### Recipe Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/recipes/random` | Get random recipe | No |
| GET | `/test` | API health check | No |
| GET | `/health` | Detailed health check | No |

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Tokens**: 7-day expiration with secure signing
- **Input Validation**: Email format and password requirements
- **Error Handling**: Comprehensive error responses
- **Token Verification**: Middleware for protected routes

## 🚀 GitHub Workflow

### Initial Setup
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit initial version
git commit -m "Add authentication system with JWT, user registration, login, and middleware"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/myred-backend.git
git branch -M main
git push -u origin main
```

### Daily Workflow
```bash
# Pull latest changes
git pull origin main

# Make your changes...

# Add and commit changes
git add .
git commit -m "Your commit message"

# Push to GitHub
git push origin main
```

## 🔧 Deployment (Railway)

1. **Connect to Railway**: Link your GitHub repository
2. **Set Environment Variables**:
   - `ATLAS_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `PORT` - Railway will set this automatically

3. **Deploy**: Railway will automatically deploy when you push to GitHub

## 📱 iOS App Integration

Your iOS app is configured to use these endpoints:
- Base URL: `https://myre-backend-production.up.railway.app`
- Login: `POST /auth/login`
- Register: `POST /auth/register`
- Validate: `GET /auth/validate`

## 🆘 Troubleshooting

### Common Issues:

1. **"JWT_SECRET not defined"**: Make sure you've added the JWT_SECRET to your config.env file
2. **"User already exists"**: The test user already exists, try logging in instead
3. **"Invalid token"**: Token might be expired or malformed
4. **Connection issues**: Check your MongoDB connection string

### Debug Commands:

```bash
# Check if server is running
curl http://localhost:3000/health

# Check server logs
npm run dev
```

## 📝 File Structure

```
myred_backend/
├── models/
│   ├── Recipe.js          # Recipe model
│   └── User.js            # User model with authentication
├── middleware/
│   └── auth.js             # JWT authentication middleware
├── routes/
│   └── authRoutes.js       # Authentication endpoints
├── server.js              # Main server file
├── recipesRoutes.js       # Recipe endpoints
├── package.json           # Dependencies
├── config.env             # Environment variables
├── test-auth.js           # Authentication test script
└── README.md              # This file
```

## 🎉 You're All Set!

Your backend now has:
- ✅ User registration and login
- ✅ JWT token authentication
- ✅ Secure password hashing
- ✅ Recipe API endpoints
- ✅ GitHub integration
- ✅ Railway deployment ready

The authentication system is fully integrated with your iOS app! 🚀
