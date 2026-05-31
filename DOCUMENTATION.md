# API APEX - Complete Documentation

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [File Structure](#file-structure)
5. [Core Concepts](#core-concepts)
6. [API Endpoints](#api-endpoints)
7. [Authentication System](#authentication-system)
8. [Logger System](#logger-system)
9. [Dashboard Features](#dashboard-features)
10. [API Chaining](#api-chaining)
11. [Code Examples](#code-examples)
12. [Database Schema](#database-schema)

---

## Project Overview

**API APEX** is an advanced API testing and chaining platform built with Next.js 16, TypeScript, and MongoDB. It provides:

- ✅ **CRUD API Endpoints** with full authentication
- ✅ **Three Authentication Methods** (No Auth, API Key, JWT)
- ✅ **Real-time Logger** with modern UI
- ✅ **Interactive Testing Dashboard** for all APIs
- ✅ **API Chaining** - Chain multiple APIs where output of one becomes input for the next
- ✅ **Response Time Tracking** for performance monitoring
- ✅ **MongoDB Integration** for data persistence

---

## Architecture

### Tech Stack
```
┌─────────────────────────────────────────────┐
│         Frontend Layer (React 19)            │
│  - API Cards with Testing Interface          │
│  - Real-time Logger Component                │
│  - API Chaining Interface                    │
│  - Modern Tailwind UI                        │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│      Next.js 16 App Router                   │
│  - API Routes (/app/api/*)                   │
│  - Server Components                         │
│  - Authentication Middleware                 │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│     Utility & Business Logic Layer           │
│  - Authentication (JWT, API Key)             │
│  - Logger System (Pino)                      │
│  - Response Formatting                       │
│  - Type Definitions (TypeScript)             │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│      MongoDB Database Layer                  │
│  - User Model                                │
│  - APIEndpoint Metadata                      │
│  - SampleData (CRUD)                         │
│  - Logs (TTL indexes)                        │
└─────────────────────────────────────────────┘
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

All required packages:
- `next@16.2.6` - React framework
- `mongoose@9.6.2` - MongoDB ODM
- `jsonwebtoken@9.1.2` - JWT authentication
- `bcryptjs@2.4.3` - Password hashing
- `pino@9.4.0` - Logger
- `uuid@10.0.0` - ID generation

### Step 2: Configure Environment Variables

Create `.env.local`:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/api-apex

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this

# API Key
API_KEY=test-api-key-12345

# Environment
NODE_ENV=development
```

### Step 3: Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000/dashboard`

### Step 4: Build for Production
```bash
npm run build
npm start
```

---

## File Structure

```
api-apex/
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   ├── route.ts                 # GET /api/users (JWT auth)
│   │   │   ├── create/route.ts          # POST /api/users/create (JWT)
│   │   │   └── [id]/
│   │   │       ├── route.ts             # PUT /api/users/[id] (API Key)
│   │   │       └── delete/route.ts      # DELETE /api/users/[id] (No auth)
│   │   ├── products/
│   │   │   ├── route.ts                 # GET /api/products (API Key)
│   │   │   ├── create/route.ts          # POST /api/products (JWT)
│   │   │   └── [id]/route.ts            # GET /api/products/[id] (No auth)
│   │   ├── metadata/route.ts            # GET /api/metadata - API Docs
│   │   └── chain/
│   │       ├── test/route.ts            # POST /api/chain/test - Demo chain
│   │       └── execute/route.ts         # POST /api/chain/execute - Dynamic chain
│   ├── dashboard/
│   │   └── page.tsx                     # Main testing dashboard
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Home page
│   ├── Provider.tsx                     # React Query provider
│   └── globals.css                      # Global styles
├── components/
│   ├── Logger.tsx                       # Real-time logger UI
│   ├── APICard.tsx                      # Individual API test card
│   └── APIChaining.tsx                  # API chaining interface
├── lib/
│   ├── types.ts                         # TypeScript types & enums
│   ├── auth.ts                          # Authentication middleware
│   ├── logger.ts                        # Logger system
│   ├── responses.ts                     # API response helpers
│   └── db/
│       ├── connection.ts                # MongoDB connection manager
│       └── models/
│           ├── User.ts                  # User schema
│           ├── APIEndpoint.ts           # API metadata schema
│           ├── SampleData.ts            # CRUD data schema
│           └── LogEntry.ts              # Log entry schema
├── models/
│   └── APIModel.ts                      # Business logic model
├── test/
│   └── test-api-model.ts                # Test file
├── .env.local                           # Environment configuration
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript config
├── next.config.ts                       # Next.js config
└── README.md                            # Documentation
```

---

## Core Concepts

### 1. **Authentication Types**

#### Enum: `AuthType`
```typescript
enum AuthType {
  NONE = "none",           // Public endpoint
  API_KEY = "apiKey",      // Header: X-API-Key
  JWT = "jwt"              // Header: Authorization: Bearer <token>
}
```

#### Implementation in Endpoints
```typescript
// No Auth - Public
export async function GET(request: NextRequest) {
  return successResponse(data);
}

// API Key Auth
const auth = await checkAuth(request, AuthType.API_KEY);
if (!auth.authenticated) {
  return authErrorResponse(auth.error);
}

// JWT Auth
const auth = await checkAuth(request, AuthType.JWT);
if (!auth.authenticated) {
  return authErrorResponse(auth.error);
}
```

### 2. **Request ID Tracking**

Every request gets a unique ID for tracing:
```typescript
const requestId = generateRequestId(); // UUID
const logger = new AppLogger(requestId);
logger.logRequest("GET", "/api/users", "JWT");
```

### 3. **Response Format**

All responses follow standardized format:
```typescript
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  requestId: string;
}
```

Example:
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "John Doe", "email": "john@example.com" }
  ],
  "timestamp": "2024-05-31T10:30:45.123Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 4. **Performance Tracking**

All endpoints track response time:
```typescript
const startTime = performance.now();
// ... execute operation ...
const responseTime = performance.now() - startTime;
logger.logResponse("GET", "/api/users", 200, responseTime);
```

---

## API Endpoints

### Users Endpoints

#### 1. Get All Users
```
GET /api/users
Auth: JWT Required
Response: 200ms average
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-05-31T10:30:00Z"
    }
  ]
}
```

#### 2. Create User
```
POST /api/users/create
Auth: JWT Required
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com"
}
```

**Response:** `201 Created`

#### 3. Update User
```
PUT /api/users/[id]
Auth: API Key Required
```

**Headers:**
```
X-API-Key: test-api-key-12345
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

#### 4. Delete User
```
DELETE /api/users/[id]/delete
Auth: None (Public)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "User deleted successfully",
    "id": "1"
  }
}
```

### Products Endpoints

#### 1. Get All Products
```
GET /api/products
Auth: API Key Required
```

#### 2. Create Product
```
POST /api/products/create
Auth: JWT Required
```

**Request Body:**
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "stock": 50
}
```

#### 3. Get Single Product
```
GET /api/products/[id]
Auth: None (Public)
```

### Metadata Endpoint

#### Get All APIs Documentation
```
GET /api/metadata
Auth: None (Public)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalApis": 8,
    "apis": [
      {
        "id": "users-list",
        "name": "Get All Users",
        "description": "Fetch list of all users",
        "method": "GET",
        "path": "/api/users",
        "authType": "jwt",
        "requestSchema": {},
        "responseSchema": { ... },
        "chainableWith": ["products-list"]
      }
    ]
  }
}
```

---

## Authentication System

### How It Works

1. **Client sends request with credentials**
   - API Key: `X-API-Key` header
   - JWT: `Authorization: Bearer <token>` header

2. **Server validates credentials**
   ```typescript
   const { type, credentials } = extractAuthFromRequest(request);
   
   if (type === AuthType.API_KEY) {
     const isValid = validateAPIKey(credentials);
   } else if (type === AuthType.JWT) {
     const payload = validateJWT(credentials);
   }
   ```

3. **Request proceeds or is rejected**

### JWT Token

**Payload:**
```json
{
  "userId": "123",
  "email": "user@example.com",
  "iat": 1650000000,
  "exp": 1650086400
}
```

**Valid for 24 hours** from issuance.

**Test Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjUwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.wJZxlJpXqJbIqKRLX-WGqDrAr2cz5yGqL7K0E8j0P0w
```

### API Key

**Format:** `test-api-key-12345` (configurable in `.env.local`)

**Usage:**
```
curl -H "X-API-Key: test-api-key-12345" http://localhost:3000/api/products
```

---

## Logger System

### Architecture

```typescript
class AppLogger {
  info(message, context)     // Info level
  warn(message, context)     // Warning level
  error(message, error)      // Error level
  debug(message, context)    // Debug level
  logRequest(method, path)   // API request logging
  logResponse(method, path, status, time)  // API response logging
}
```

### Log Storage

**In-Memory Store:**
```typescript
InMemoryLogStore {
  addLog(requestId, log)          // Add log entry
  getLogs(requestId)              // Get logs for request
  getAllLogs()                    // Get all logs
  clearLogs(requestId)            // Clear request logs
}
```

### Usage Example

```typescript
const logger = new AppLogger(requestId);

// Log request
logger.logRequest("GET", "/api/users", "JWT");

// Process...

// Log response with timing
logger.logResponse("GET", "/api/users", 200, 45);

// Log business events
logger.info("User created successfully", {
  userId: user.id,
  email: user.email
});

// Log errors
logger.error("Database connection failed", dbError);
```

### Dashboard Logger UI

The logger component displays:
- ✅ Log level badges (info, warn, error, debug)
- ✅ Request ID for tracing
- ✅ Response time metrics
- ✅ Contextual data (expandable)
- ✅ Timestamps
- ✅ Live auto-refresh
- ✅ Filter by log level

---

## Dashboard Features

### 1. **API Testing Interface**

Each API endpoint is displayed as an interactive card:

**Features:**
- Method badge (GET, POST, PUT, DELETE)
- Auth type indicator
- Request body editor (for POST/PUT)
- Authentication method selector
- Test button
- Response time display
- Response viewer (JSON)
- Chainable APIs indicator

**Workflow:**
1. Select authentication method
2. Edit request body (if needed)
3. Click "Test API"
4. View response and timing

### 2. **API Chaining**

Chain multiple APIs where output becomes input for next API:

**Features:**
- Add/remove chain steps
- Select API endpoint for each step
- JSON path extraction (e.g., "0.id")
- Execute entire chain
- View combined results

**Example Chain:**
```
Step 1: GET /api/users → returns array
  Extract: "0.id" → gets first user's ID
  
Step 2: GET /api/products?userId=1 → returns products
  Extract: "0.id" → gets first product's ID
  
Step 3: GET /api/products/1 → returns product details
```

### 3. **Configuration**

- **Default Authentication:** Select default auth method for all API tests
- **Response Delay:** Simulate network delay (0-5000ms)
- **Info Panel:** Tips and instructions

### 4. **Tabs**

- **🔌 APIs:** Test individual endpoints
- **🔗 Chaining:** Chain multiple APIs
- **📋 Logs:** View real-time logs

---

## API Chaining

### Simple Chaining Example

**Endpoint:** `POST /api/chain/test`

**Request:**
```json
{
  "userId": "1",
  "chainApis": ["users-list", "products-list"]
}
```

**Process:**
```
1. Fetch user with ID "1"
2. Fetch products for that user
3. Return combined data
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "products": [
      { "id": "1", "name": "Laptop", "price": 999.99 },
      { "id": "2", "name": "Mouse", "price": 29.99 }
    ],
    "chainSequence": ["users-list", "products-list"],
    "executedAt": "2024-05-31T10:30:00Z"
  }
}
```

### Dynamic Chaining Example

**Endpoint:** `POST /api/chain/execute`

**Request:**
```json
{
  "chains": [
    {
      "apiId": "users-list",
      "params": {},
      "extractFrom": "0.id"
    },
    {
      "apiId": "products-get",
      "params": {},
      "extractFrom": "price"
    }
  ]
}
```

**How it works:**
1. Execute first API → gets array of users
2. Extract "0.id" (first user's ID)
3. Execute second API with extracted ID
4. Extract "price" from response
5. Return all results

---

## Code Examples

### Example 1: Creating a Simple CRUD Endpoint

```typescript
// app/api/posts/route.ts
import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    // Check authentication
    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("POST", "/api/posts", "JWT");

    // Parse request
    const body = await request.json();
    const { title, content } = body;

    // Validate
    if (!title || !content) {
      return errorResponse("title and content are required");
    }

    // Create post (in real app, save to DB)
    const post = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date()
    };

    // Log response
    const responseTime = performance.now() - startTime;
    logger.logResponse("POST", "/api/posts", 201, responseTime);

    return successResponse(post, 201);
  } catch (error) {
    logger.error("Error creating post", error as Error);
    return serverErrorResponse("Failed to create post");
  }
}
```

### Example 2: Using Logger in Complex Operations

```typescript
export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);

  try {
    logger.logRequest("GET", "/api/analytics", "JWT");

    // Step 1: Fetch users
    logger.debug("Fetching users from database");
    const users = await fetchUsers();
    logger.debug(`Retrieved ${users.length} users`);

    // Step 2: Calculate statistics
    logger.debug("Calculating statistics");
    const stats = calculateStats(users);
    logger.debug("Statistics calculated", { totalUsers: stats.total });

    // Step 3: Format response
    const analytics = {
      users: stats,
      timestamp: new Date()
    };

    const responseTime = performance.now() - startTime;
    logger.logResponse("GET", "/api/analytics", 200, responseTime);
    logger.info("Analytics report generated", {
      totalRecords: stats.total,
      responseTimeMs: responseTime
    });

    return successResponse(analytics);
  } catch (error) {
    logger.error("Error generating analytics", error as Error);
    return serverErrorResponse("Failed to generate analytics");
  }
}
```

### Example 3: Authentication Integration

```typescript
// Using API Key Auth
export async function GET(request: NextRequest) {
  const auth = await checkAuth(request, AuthType.API_KEY);
  
  if (!auth.authenticated) {
    return authErrorResponse(auth.error);
  }
  
  return successResponse({ message: "Authenticated with API Key" });
}

// Using JWT Auth
export async function POST(request: NextRequest) {
  const auth = await checkAuth(request, AuthType.JWT);
  
  if (!auth.authenticated) {
    return authErrorResponse(auth.error);
  }

  // auth.payload contains user info
  const { userId, email } = auth.payload!;
  
  return successResponse({
    message: "Authenticated with JWT",
    user: { userId, email }
  });
}
```

---

## Database Schema

### User Collection

```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  apiKey: string,
  jwtSecret: string,
  createdAt: Date,
  updatedAt: Date
}
```

### APIEndpoint Collection

```typescript
{
  _id: ObjectId,
  name: string (unique),
  description: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  path: string (unique),
  authType: "none" | "apiKey" | "jwt",
  requestSchema: object,
  responseSchema: object,
  chainableWith: [string],
  createdAt: Date,
  updatedAt: Date
}
```

### SampleData Collection

```typescript
{
  _id: ObjectId,
  userId: string (indexed),
  apiId: string (indexed),
  data: object,
  createdAt: Date,
  updatedAt: Date
}
```

### LogEntry Collection

```typescript
{
  _id: ObjectId,
  timestamp: Date (TTL index - expires in 30 days),
  level: "info" | "warn" | "error" | "debug",
  message: string,
  context: object,
  requestId: string (indexed),
  duration: number (milliseconds),
}
```

---

## Testing the Platform

### Using cURL

**Test GET endpoint (No Auth):**
```bash
curl http://localhost:3000/api/products/1
```

**Test with API Key:**
```bash
curl -H "X-API-Key: test-api-key-12345" \
     http://localhost:3000/api/products
```

**Test with JWT:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:3000/api/users
```

**Test POST:**
```bash
curl -X POST \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     -H "Content-Type: application/json" \
     -d '{"name": "Jane Doe", "email": "jane@example.com"}' \
     http://localhost:3000/api/users/create
```

### Using Dashboard

1. Navigate to `/dashboard`
2. Select authentication method
3. Adjust response delay
4. Click "Test API" on any endpoint
5. View response and timing
6. Use "Chaining" tab to chain APIs
7. Check "Logs" tab for real-time logs

---

## Summary

**API APEX** provides a complete testing platform for API development with:

✅ **Full CRUD Operations** with multiple auth methods
✅ **Real-time Logging** with performance metrics
✅ **Interactive Dashboard** for easy API testing
✅ **API Chaining** for complex workflows
✅ **TypeScript** for type safety
✅ **MongoDB** for data persistence
✅ **Modern UI** with Tailwind CSS
✅ **Production-ready** code structure

For questions or issues, check the code comments in each file!
