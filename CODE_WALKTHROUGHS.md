# Code Walkthroughs

This document provides concise walkthroughs for the main systems in the project.

1) Authentication (JWT & API Key)
--------------------------------

- Location: `lib/auth.ts`
- JWT: `generateJWT(userId, email)` creates a 24-hour token using `process.env.JWT_SECRET`.
- Validation: `validateJWT(token)` returns `JWTPayload | null` after verifying the token.
- API Key: `validateAPIKey(key)` compares against `process.env.API_KEY` (or user record).
- Usage: Each API route calls `checkAuth(request, requiredAuthType)` which returns `{ authenticated, payload?, error? }`.

Example flow:

1. Client includes `Authorization: Bearer <JWT>` or `X-API-Key: <key>` header.
2. Route handler calls `checkAuth` with the expected `AuthType`.
3. If authenticated, the handler proceeds; otherwise returns `authErrorResponse()`.

2) Logger System
----------------

- Location: `lib/logger.ts`
- `AppLogger` class wraps `pino` and provides methods: `info()`, `warn()`, `error()`, `debug()`, `logRequest()`, `logResponse()`.
- `generateRequestId()` creates UUIDs for tracing.
- `InMemoryLogStore` stores recent logs for UI display; `logStore.getAllLogs()` used by UI.
- Endpoints call `const logger = new AppLogger(requestId)` and log request/response with durations.

3) API Chaining Executor
------------------------

- Location: `app/api/chain/execute/route.ts` and `components/APIChaining.tsx`.
- The executor accepts an array of `ChainStep` objects with `apiId`, `params?`, and `extractFrom?`.
- Execution loop:
	- For each step, resolve the API by `apiId` (from `APIEndpoint` metadata or in-memory map).
	- Execute the API (internal fetch) with provided params and any injected values extracted from previous responses.
	- Use `extractValue(obj, path)` helper to pull values using dot/array path like `0.items.0.id`.
	- Collect each step's response and timing into the aggregated result.

4) Response Formatting
----------------------

- Location: `lib/responses.ts`
- Helpers: `successResponse(data, statusCode)`, `errorResponse(message, status)`, `validationError(errors)`.
- Standard format returned: `{ success: boolean, data?: any, error?: string, timestamp: string, requestId?: string }`.

5) CRUD Endpoints
------------------

- Location: `app/api/users/*` and `app/api/products/*`.
- Patterns used across endpoints:
	- `const requestId = generateRequestId(); const logger = new AppLogger(requestId);`
	- `await connectDB()` (if interacting with DB)
	- `checkAuth(request, AuthType.X)` to validate access
	- Input validation, then DB read/write
	- `logger.logResponse(...)` and `return successResponse(data)`

6) Dashboard & Components
-------------------------

- Location: `app/dashboard/page.tsx`, `components/APICard.tsx`, `components/APIChaining.tsx`, `components/Logger.tsx`.
- Dashboard fetches `/api/metadata` and renders a 3-tab UI: APIs, Chaining, Logs.
- `APICard` provides request editor, auth selector, and a "Test" button that performs fetch and shows response time.
- `APIChainingComponent` builds chains and POSTs to `/api/chain/execute`.
- `Logger` subscribes to `logStore` (or polls) and displays recent logs with filters.

If you want, I can expand any section with code references and exact line numbers.
