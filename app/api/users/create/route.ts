/**
 * API ROUTE: POST /api/users
 * ===========================
 * AUTHENTICATION: JWT
 * 
 * Creates a new user with validation
 * This endpoint demonstrates:
 * - Request validation
 * - Error handling
 * - Data creation
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse, validationError } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    // Check JWT authentication
    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      logger.warn("Unauthorized create attempt");
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("POST", "/api/users", "JWT");

    // Parse request body
    const body = await request.json();
    const { name, email } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      logger.warn("Validation failed: Invalid name");
      return validationError("name", "Must be a non-empty string");
    }

    if (!email || !email.includes("@")) {
      logger.warn("Validation failed: Invalid email");
      return validationError("email", "Must be a valid email address");
    }

    // Simulated user creation
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      createdAt: new Date()
    };

    const responseTime = performance.now() - startTime;
    logger.logResponse("POST", "/api/users", 201, responseTime);
    logger.info("User created successfully", {
      userId: newUser.id,
      email: newUser.email
    });

    return successResponse(newUser, 201);
  } catch (error) {
    logger.error("Error creating user", error as Error);
    return serverErrorResponse("Failed to create user");
  }
}
