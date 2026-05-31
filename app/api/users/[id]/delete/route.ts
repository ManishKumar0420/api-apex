/**
 * API ROUTE: DELETE /api/users/[id]
 * ==================================
 * AUTHENTICATION: No Auth
 * 
 * Deletes a user by ID
 * This endpoint demonstrates:
 * - Public endpoint (no auth)
 * - Delete operations
 * - ID parameter handling
 */

import { NextRequest } from "next/server";
import { successResponse, serverErrorResponse, notFoundResponse } from "@/lib/responses";
import { AppLogger, generateRequestId } from "@/lib/logger";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    const { id } = params;

    logger.logRequest("DELETE", `/api/users/${id}`, "NONE");

    // Simulated deletion
    if (id === "invalid") {
      logger.warn("User not found for deletion", { userId: id });
      return notFoundResponse("User");
    }

    const responseTime = performance.now() - startTime;
    logger.logResponse("DELETE", `/api/users/${id}`, 200, responseTime);
    logger.info("User deleted successfully", { userId: id });

    return successResponse(
      {
        message: "User deleted successfully",
        id
      },
      200
    );
  } catch (error) {
    logger.error("Error deleting user", error as Error);
    return serverErrorResponse("Failed to delete user");
  }
}
