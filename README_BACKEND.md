# Backend Server Setup

This project includes a Node.js/Express backend server for handling authentication requests.

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Backend Server

### Start the server:
```bash
node server.js
```

The server will start on `http://localhost:3000` and display available endpoints.

### Available Endpoints:

#### 1. **POST /api/auth/signup**
Create a new user account.

**Request:**
```json
{
  "loginId": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Account created successfully! Please check your email to verify your account.",
  "user": {
    "id": "user-uuid",
    "email": "john@example.com"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Please enter a valid email address"
  }
}
```

#### 2. **POST /api/auth/signin**
Sign in with email and password.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Signed in successfully",
  "user": {
    "id": "user-uuid",
    "email": "john@example.com"
  },
  "session": { /* session data */ }
}
```

#### 3. **GET /api/health**
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-03-14T10:30:00.000Z"
}
```

## Configuration

Environment variables are loaded from `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server
PORT=3000
NODE_ENV=development
```

## Features

- ✓ User signup with validation
- ✓ User signin authentication
- ✓ Email validation
- ✓ Password strength validation (minimum 8 characters)
- ✓ CORS enabled for cross-origin requests
- ✓ Error handling and validation
- ✓ Uses Supabase for authentication
- ✓ Health check endpoint

## Running Frontend and Backend Together

### Terminal 1 - Start Backend:
```bash
node server.js
```

### Terminal 2 - Start Frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend will be available at `http://localhost:3000`

## Testing with cURL

### Signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "loginId": "testuser",
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

### Signin:
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

### Health Check:
```bash
curl http://localhost:3000/api/health
```

## Architecture

```
Frontend (React + Vite)
         ↓
   SignupForm Component
         ↓
Backend API (Express)
         ↓
   Supabase Auth
```

The frontend sends signup requests to the Node.js backend, which validates the data and communicates with Supabase Authentication services.
