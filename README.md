# 🚀 API APEX - Advanced API Testing & Chaining Platform

A comprehensive API testing platform built with **Next.js 16**, **TypeScript**, **MongoDB**, and **Tailwind CSS**. Create, test, and chain APIs with modern UI, real-time logging, and multiple authentication methods.

## ✨ Features

- 🔌 **CRUD API Endpoints** - Pre-built endpoints for testing (Users, Products)
- 🔐 **Three Authentication Methods**
  - No Authentication (public)
  - API Key (header-based)
  - JWT (token-based)
- 📊 **Real-time Logger** with modern UI, filtering, and request tracing
- 🎨 **Interactive Testing Dashboard** - Test all APIs in one place
- 🔗 **API Chaining** - Chain multiple APIs where output of one becomes input for next
- ⏱️ **Performance Metrics** - Track response times for each API call
- 💾 **MongoDB Integration** - Persistent data storage
- 📝 **Comprehensive Documentation** - Full code explanations

## 🚀 Quick Start

### 1. Clone & Install
```bash
cd api-apex
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/api-apex
JWT_SECRET=your_super_secret_jwt_key_change_this
API_KEY=test-api-key-12345
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000/dashboard**

### 4. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
api-apex/
├── app/
│   ├── api/              # API endpoints
│   │   ├── users/        # User CRUD APIs
│   │   ├── products/     # Product CRUD APIs
│   │   ├── metadata/     # API documentation
│   │   └── chain/        # API chaining endpoints
│   └── dashboard/        # Main testing dashboard (page.tsx)
├── components/
│   ├── Logger.tsx        # Real-time logger UI
│   ├── APICard.tsx       # Individual API test card
│   └── APIChaining.tsx   # API chaining interface
├── lib/
│   ├── types.ts          # TypeScript definitions
│   ├── auth.ts           # Authentication middleware
│   ├── logger.ts         # Logger system
│   ├── responses.ts      # Response helpers
│   └── db/               # Database models & connection
└── DOCUMENTATION.md      # Complete documentation
```

## 🔌 Available APIs

### Users Endpoints
- `GET /api/users` - Get all users (JWT)
- `POST /api/users/create` - Create user (JWT)
- `PUT /api/users/[id]` - Update user (API Key)
- `DELETE /api/users/[id]/delete` - Delete user (No Auth)

### Products Endpoints
- `GET /api/products` - Get all products (API Key)
- `POST /api/products/create` - Create product (JWT)
- `GET /api/products/[id]` - Get single product (No Auth)

### Utility Endpoints
- `GET /api/metadata` - Get all API documentation (No Auth)
- `POST /api/chain/test` - Test API chaining (JWT)
- `POST /api/chain/execute` - Execute dynamic chain (JWT)

## 🔐 Authentication

### No Authentication
```bash
curl http://localhost:3000/api/products/1
```

### API Key
```bash
curl -H "X-API-Key: test-api-key-12345" \
     http://localhost:3000/api/products
```

### JWT Token
```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
     http://localhost:3000/api/users
```

**Test JWT:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjUwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.wJZxlJpXqJbIqKRLX-WGqDrAr2cz5yGqL7K0E8j0P0w`

## 📊 Dashboard Features

### 1. API Testing
- Test each endpoint individually
- View request/response format
- See response times
- View detailed responses

### 2. API Chaining
- Create chains of multiple APIs
- Extract data from responses
- Pass data between APIs
- View combined results

### 3. Real-time Logger
- View all API requests/responses
- Filter by log level
- See request IDs for tracing
- Monitor response times
- Auto-refresh capability

## 🔗 API Chaining Example

**Scenario:** Get first user, then get their products

**Request:**
```json
POST /api/chain/execute
{
  "chains": [
    { "apiId": "users-list", "extractFrom": "0.id" },
    { "apiId": "products-get", "extractFrom": "id" }
  ]
}
```

**Process:**
1. Execute `users-list` → get array of users
2. Extract first user's ID using `0.id`
3. Execute `products-get` with extracted ID
4. Return combined results

## 📚 Documentation

For detailed documentation including:
- Complete architecture overview
- Code examples & walkthroughs
- Database schema descriptions
- Advanced usage patterns

See: [DOCUMENTATION.md](./DOCUMENTATION.md)

## 🛠️ Tech Stack

- **Framework:** Next.js 16.2.6
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT & API Key
- **Logging:** Pino
- **Styling:** Tailwind CSS
- **UI Components:** React 19

## 📝 Code Examples

### Create a New API Endpoint
```typescript
// app/api/posts/route.ts
import { checkAuth } from "@/lib/auth";
import { successResponse } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);

  const auth = await checkAuth(request, AuthType.JWT);
  if (!auth.authenticated) {
    return authErrorResponse(auth.error);
  }

  logger.logRequest("POST", "/api/posts", "JWT");
  
  const body = await request.json();
  // ... process request ...
  
  return successResponse(result, 201);
}
```

### Using the Logger
```typescript
const logger = new AppLogger(requestId);

logger.info("Operation started", { operationType: "user_creation" });
logger.debug("Fetching from database", { query: "..." });
logger.warn("Slow query detected", { duration: 500 });
logger.error("Database error", error);
```

## 🎯 Next Steps

1. **Explore Dashboard** - Visit `/dashboard` to test APIs
2. **Read Documentation** - Check [DOCUMENTATION.md](./DOCUMENTATION.md)
3. **Create Custom APIs** - Add your own endpoints
4. **Connect Database** - Set up MongoDB for persistence
5. **Deploy** - Deploy to Vercel or your hosting

## 📋 API Response Format

All endpoints return standardized format:
```json
{
  "success": true,
  "data": { /* actual data */ },
  "timestamp": "2024-05-31T10:30:45.123Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env.local`

### JWT Not Working
- Verify `JWT_SECRET` is set in `.env.local`
- Use test token provided in docs

### API Key Not Working
- Check `API_KEY` matches in `.env.local`
- Verify header is `X-API-Key`

## 📞 Support

For issues or questions:
1. Check [DOCUMENTATION.md](./DOCUMENTATION.md)
2. Review code comments in relevant files
3. Check `.env.local` configuration

## 📄 License

This project is open source and available under the MIT License.
