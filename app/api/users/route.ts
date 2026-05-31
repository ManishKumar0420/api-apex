/**
 * API ROUTE: GET /api/users
 * ==========================
 * AUTHENTICATION: JWT
 * 
 * Fetches all users (simulated data)
 * This endpoint demonstrates:
 * - JWT authentication
 * - Error handling
 * - Standardized response format
 */

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
    // Check JWT authentication
    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      logger.warn("Unauthorized access attempt");
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("GET", "/api/users", "JWT");

    // Simulated user data
    const users = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date()
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        createdAt: new Date()
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        createdAt: new Date()
      }
    ];

    const responseTime = performance.now() - startTime;
    logger.logResponse("GET", "/api/users", 200, responseTime);

    return successResponse(users, 200);
  } catch (error) {
    logger.error("Error fetching users", error as Error);
    return serverErrorResponse("Failed to fetch users");
  }
}
