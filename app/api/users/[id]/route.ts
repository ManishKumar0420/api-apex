/**
 * API ROUTE: PUT /api/users/[id]
 * ===============================
 * AUTHENTICATION: API Key
 * 
 * Updates a user in database by ID
 * This endpoint demonstrates:
 * - Dynamic route parameters
 * - API Key authentication
 * - Update operations
 * - Database persistence
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse, notFoundResponse, validationError } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";
import { User } from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/connection";

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
    // Connect to database
    await connectDB();

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
    const { email } = body;

    // Validation
    if (email && !email.includes("@")) {
      return validationError("email", "Must be a valid email address");
    }

    // Find and update user in database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email: email ? email.toLowerCase() : undefined },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      logger.warn("User not found", { userId: id });
      return notFoundResponse("User");
    }

    const responseTime = performance.now() - startTime;
    logger.logResponse("PUT", `/api/users/${id}`, 200, responseTime);
    logger.info("User updated successfully in database", { userId: id });

    return successResponse({
      id: updatedUser._id,
      email: updatedUser.email,
      updatedAt: updatedUser.updatedAt
    }, 200);
  } catch (error) {
    logger.error("Error updating user", error as Error);
    return serverErrorResponse("Failed to update user");
  }
}
