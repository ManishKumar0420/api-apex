/**
 * API ROUTE: POST /api/users/create
 * ==================================
 * AUTHENTICATION: JWT
 * 
 * Creates a new user with validation and saves to database
 * This endpoint demonstrates:
 * - Request validation
 * - Database persistence
 * - Error handling
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse, validationError } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";
import { User } from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/connection";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    // Connect to database
    await connectDB();

    // Check JWT authentication
    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      logger.warn("Unauthorized create attempt");
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("POST", "/api/users/create", "JWT");

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

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      logger.warn("User already exists", { email });
      return serverErrorResponse("User with this email already exists");
    }

    // Create user in database
    const newUser = new User({
      email: email.toLowerCase(),
      password: "hashed_password_placeholder", // In production, hash the password
      apiKey: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      jwtSecret: Math.random().toString(36).substr(2)
    });

    await newUser.save();

    const responseTime = performance.now() - startTime;
    logger.logResponse("POST", "/api/users/create", 201, responseTime);
    logger.info("User created successfully in database", {
      userId: newUser._id,
      email: newUser.email
    });

    return successResponse(
      {
        id: newUser._id,
        email: newUser.email,
        apiKey: newUser.apiKey,
        createdAt: newUser.createdAt
      },
      201
    );
  } catch (error) {
    logger.error("Error creating user", error as Error);
    return serverErrorResponse("Failed to create user");
  }
}
