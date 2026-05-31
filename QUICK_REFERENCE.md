# 📖 QUICK REFERENCE GUIDE

## 🚀 Getting Started (5 Minutes)

### 1. Install & Configure
```bash
# Install dependencies
npm install

# Create .env.local
MONGODB_URI=mongodb://localhost:27017/api-apex
JWT_SECRET=your_super_secret_jwt_key_change_this
API_KEY=test-api-key-12345
NODE_ENV=development
```

### 2. Start Server
```bash
npm run dev
# Visit http://localhost:3000/dashboard
```

### 3. Test APIs
- Click "Test API" on any endpoint
- View response and response time
- Check logs in "Logs" tab

---

## 🔌 API ENDPOINTS CHEAT SHEET

### Users CRUD
```
GET    /api/users              → JWT auth
POST   /api/users/create       → JWT auth
PUT    /api/users/[id]         → API Key auth
DELETE /api/users/[id]/delete  → No auth
```

### Products CRUD
```
GET  /api/products        → API Key auth
POST /api/products/create → JWT auth
GET  /api/products/[id]   → No auth
```

### Special Endpoints
```
GET  /api/metadata         → Get all APIs (No auth)
POST /api/chain/test       → Simple chain (JWT auth)
POST /api/chain/execute    → Dynamic chain (JWT auth)
```

---

## 🔐 AUTHENTICATION HEADERS

### API Key
```bash
curl -H "X-API-Key: test-api-key-12345" \
     http://localhost:3000/api/products
```

### JWT Token
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjUwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.wJZxlJpXqJbIqKRLX-WGqDrAr2cz5yGqL7K0E8j0P0w" \
     http://localhost:3000/api/users
```

### No Auth
```bash
curl http://localhost:3000/api/products/1
```

---

## 📋 REQUEST/RESPONSE EXAMPLES

### Create User (POST)
```json
Request:
POST /api/users/create
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response:
{
  "success": true,
  "data": {
    "id": "1234567890",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-05-31T10:30:45.123Z"
  },
  "timestamp": "2024-05-31T10:30:45.123Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Get Products (GET)
```json
Request:
GET /api/products
X-API-Key: test-api-key-12345

Response:
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "stock": 50,
      "createdAt": "2024-05-31T10:30:00Z"
    },
    {
      "id": "2",
      "name": "Mouse",
      "price": 29.99,
      "stock": 200
    }
  ],
  "timestamp": "2024-05-31T10:30:45.123Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### Chain APIs (POST)
```json
Request:
POST /api/chain/execute
Authorization: Bearer <JWT_TOKEN>

{
  "chains": [
    {
      "apiId": "users-list",
      "extractFrom": "0.id"
    },
    {
      "apiId": "products-list"
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "stepsExecuted": 2,
    "results": [
      {
        "step": 1,
        "apiId": "users-list",
        "data": [
          { "id": "1", "name": "John Doe", "email": "john@example.com" }
        ]
      },
      {
        "step": 2,
        "apiId": "products-list",
        "data": [
          { "id": "1", "name": "Laptop", "price": 999.99 }
        ]
      }
    ],
    "totalExecutionTime": 45
  },
  "timestamp": "2024-05-31T10:30:45.123Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440002"
}
```

---

## 🔗 API CHAINING PATTERNS

### Pattern 1: Simple Chain
```
Step 1: Get all users        → [{ id: "1", name: "John" }, ...]
Step 2: Get products         → [{ id: "1", name: "Laptop" }, ...]
Result: Combined data
```

### Pattern 2: Extract & Use
```
Step 1: Get users extract "0.id"      → "1"
Step 2: Get products where userId="1" → [{ ... }, ...]
Result: Products for first user
```

### Pattern 3: Multi-Level
```
Step 1: Get users              → Extract "0.id"
Step 2: Get user's products    → Extract "0.price"
Step 3: Check price inventory  → Final result
Result: Complete data chain
```

---

## 📝 COMMON CURL COMMANDS

### Test User Creation
```bash
curl -X POST http://localhost:3000/api/users/create \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjUwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.wJZxlJpXqJbIqKRLX-WGqDrAr2cz5yGqL7K0E8j0P0w" \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'
```

### Test Product List
```bash
curl http://localhost:3000/api/products \
  -H "X-API-Key: test-api-key-12345"
```

### Test API Chaining
```bash
curl -X POST http://localhost:3000/api/chain/execute \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjUwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.wJZxlJpXqJbIqKRLX-WGqDrAr2cz5yGqL7K0E8j0P0w" \
  -H "Content-Type: application/json" \
  -d '{
    "chains": [
      {"apiId":"users-list","extractFrom":"0.id"},
      {"apiId":"products-list"}
    ]
  }'
```

---

## 🛠️ TROUBLESHOOTING

### Issue: "next is not recognized"
**Solution:** Run `npm install` again or check PATH

### Issue: MongoDB Connection Error
**Solution:** 
```bash
# Start MongoDB
mongod

# Check MONGODB_URI in .env.local
MONGODB_URI=mongodb://localhost:27017/api-apex
```

### Issue: JWT Auth Not Working
**Solution:** Use the test JWT token provided in docs:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjUwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.wJZxlJpXqJbIqKRLX-WGqDrAr2cz5yGqL7K0E8j0P0w
```

### Issue: CORS Errors
**Solution:** This is a same-origin app, CORS shouldn't be an issue. Check browser console for actual error.

---

## 📚 FILE LOCATIONS QUICK MAP

```
lib/
  ├── types.ts             ← TypeScript definitions
  ├── auth.ts              ← Authentication logic
  ├── logger.ts            ← Logger system
  ├── responses.ts         ← Response helpers
  └── db/
      ├── connection.ts    ← MongoDB connection
      └── models/
          ├── User.ts      ← User schema
          ├── APIEndpoint.ts
          ├── SampleData.ts
          └── LogEntry.ts

app/
  ├── api/
  │   ├── users/           ← User CRUD
  │   ├── products/        ← Product CRUD
  │   ├── metadata/        ← API docs
  │   └── chain/           ← Chaining
  └── dashboard/
      └── page.tsx         ← Main dashboard

components/
  ├── Logger.tsx           ← Logger UI
  ├── APICard.tsx          ← API test card
  └── APIChaining.tsx      ← Chain UI
```

---

## 🎯 DEVELOPMENT WORKFLOW

### 1. Create New API Endpoint
```typescript
// app/api/custom/route.ts
import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      return authErrorResponse(auth.error);
    }

    logger.logRequest("GET", "/api/custom", "JWT");

    // Your logic here
    const data = { message: "Hello" };

    const responseTime = performance.now() - startTime;
    logger.logResponse("GET", "/api/custom", 200, responseTime);

    return successResponse(data);
  } catch (error) {
    logger.error("Error", error as Error);
    return serverErrorResponse("Failed");
  }
}
```

### 2. Add Authentication
```typescript
// For JWT
const auth = await checkAuth(request, AuthType.JWT);

// For API Key
const auth = await checkAuth(request, AuthType.API_KEY);

// For public
const auth = await checkAuth(request, AuthType.NONE);
```

### 3. Add Logging
```typescript
const logger = new AppLogger(requestId);
logger.info("User details fetched");
logger.warn("Slow operation detected");
logger.error("Database error", error);
```

---

## 📊 RESPONSE TIME TIPS

**Good Response Times:**
- Simple GET: 10-50ms
- POST with validation: 20-100ms
- Chain of 2-3 APIs: 50-200ms

**If Slow:**
1. Check database queries
2. Verify network latency
3. Profile with logger (see response times)
4. Check dashboard logs for delays

---

## 🔄 COMMON PATTERNS

### Error Handling Pattern
```typescript
try {
  // Do something
  return successResponse(result);
} catch (error) {
  logger.error("Operation failed", error as Error);
  return serverErrorResponse("Failed to complete operation");
}
```

### Validation Pattern
```typescript
if (!input || typeof input !== "string") {
  return validationError("field", "Must be a non-empty string");
}
```

### Auth Check Pattern
```typescript
const auth = await checkAuth(request, AuthType.JWT);
if (!auth.authenticated) {
  return authErrorResponse(auth.error);
}
```

---

## 🚀 DEPLOYMENT

### Build
```bash
npm run build
```

### Run Production
```bash
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

---

## 📞 SUPPORT RESOURCES

1. **DOCUMENTATION.md** - Complete technical docs
2. **CODE_WALKTHROUGHS.md** - Code explanations
3. **README.md** - Quick start guide
4. **This file** - Quick reference

---

## 💡 PRO TIPS

✅ Use dashboard for testing (easier than cURL)
✅ Check logs to understand request flow
✅ Test with different auth methods
✅ Use API chaining for complex workflows
✅ Monitor response times for performance
✅ Save useful cURL commands as aliases

---

Happy coding! 🎉
