/**
 * API ROUTE: POST /api/chain/test
 * ================================
 * AUTHENTICATION: JWT
 * 
 * Demonstrates API Chaining
 * This endpoint shows how one API's response becomes the input for another API
 * 
 * Example Flow:
 * 1. Call GET /api/users (returns users)
 * 2. Use user ID from response in next call
 * 3. Call GET /api/products with that ID
 * 4. Return combined results
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/responses";
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
      logger.warn("Unauthorized chain request");
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("POST", "/api/chain/test", "JWT");

    const body = await request.json();
    const { userId, chainApis } = body;

    // Step 1: Fetch user details
    logger.debug("Step 1: Fetching user details", { userId });

    const userData = {
      id: userId || "1",
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date()
    };

    // Step 2: Fetch products related to user (simulated)
    logger.debug("Step 2: Fetching user products", { userId });

    const products = [
      {
        id: "1",
        name: "Laptop",
        price: 999.99,
        stock: 50,
        purchasedBy: userId || "1"
      },
      {
        id: "2",
        name: "Mouse",
        price: 29.99,
        stock: 200,
        purchasedBy: userId || "1"
      }
    ];

    // Step 3: Combine results
    const chainedResult = {
      user: userData,
      products: products,
      chainSequence: ["users-list", "products-list"],
      executedAt: new Date()
    };

    const responseTime = performance.now() - startTime;
    logger.logResponse("POST", "/api/chain/test", 200, responseTime);
    logger.info("API chain completed successfully", {
      steps: 2,
      responseTimeMs: responseTime
    });

    return successResponse(chainedResult, 200);
  } catch (error) {
    logger.error("Error in API chain", error as Error);
    return serverErrorResponse("Failed to execute API chain");
  }
}
