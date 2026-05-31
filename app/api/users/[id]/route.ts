/**
 * API ROUTE: PUT /api/users/[id]
 * ===============================
 * AUTHENTICATION: API Key
 * 
 * Updates a user by ID
 * This endpoint demonstrates:
 * - Dynamic route parameters
 * - API Key authentication
 * - Update operations
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse, notFoundResponse, validationError } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    const { id } = params;

    // Check API Key authentication
    const auth = await checkAuth(request, AuthType.API_KEY);
    if (!auth.authenticated) {
      logger.warn("Unauthorized update attempt");
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("PUT", `/api/users/${id}`, "API_KEY");

    // Parse request body
    const body = await request.json();
    const { name, email } = body;

    // Validation
    if (name && (typeof name !== "string" || name.trim().length === 0)) {
      return validationError("name", "Must be a non-empty string");
    }

    if (email && !email.includes("@")) {
      return validationError("email", "Must be a valid email address");
    }

    // Simulated update (in real app, would check if user exists)
    if (id === "invalid") {
      logger.warn("User not found", { userId: id });
      return notFoundResponse("User");
    }

    const updatedUser = {
      id,
      name: name || "John Doe",
      email: email || "john@example.com",
      updatedAt: new Date()
    };

    const responseTime = performance.now() - startTime;
    logger.logResponse("PUT", `/api/users/${id}`, 200, responseTime);
    logger.info("User updated successfully", { userId: id });

    return successResponse(updatedUser, 200);
  } catch (error) {
    logger.error("Error updating user", error as Error);
    return serverErrorResponse("Failed to update user");
  }
}
