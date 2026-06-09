/**
 * API ROUTE: GET /api/users
 * ==========================
 * AUTHENTICATION: JWT
 * 
 * Fetches all users from database
 * This endpoint demonstrates:
 * - JWT authentication
 * - Database retrieval
 * - Error handling
 * - Standardized response format
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";
import { User } from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    // Connect to database
    await connectDB();

    // Check JWT authentication
    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      logger.warn("Unauthorized access attempt");
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("GET", "/api/users", "JWT");

    // Fetch users from database
    const users = await User.find().select("-password -jwtSecret").lean();

    const responseTime = performance.now() - startTime;
    logger.logResponse("GET", "/api/users", 200, responseTime);

    return successResponse(users, 200);
  } catch (error) {
    logger.error("Error fetching users", error as Error);
    return serverErrorResponse("Failed to fetch users");
  }
}
