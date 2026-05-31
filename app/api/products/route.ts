/**
 * API ROUTE: GET /api/products
 * =============================
 * AUTHENTICATION: API Key
 * 
 * Fetches all products
 * This endpoint demonstrates:
 * - API Key authentication
 * - Array response with metadata
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
    // Check API Key authentication
    const auth = await checkAuth(request, AuthType.API_KEY);
    if (!auth.authenticated) {
      logger.warn("Unauthorized access to products");
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("GET", "/api/products", "API_KEY");

    const products = [
      {
        id: "1",
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        stock: 50,
        createdAt: new Date()
      },
      {
        id: "2",
        name: "Mouse",
        description: "Wireless mouse",
        price: 29.99,
        stock: 200,
        createdAt: new Date()
      },
      {
        id: "3",
        name: "Keyboard",
        description: "Mechanical keyboard",
        price: 149.99,
        stock: 75,
        createdAt: new Date()
      }
    ];

    const responseTime = performance.now() - startTime;
    logger.logResponse("GET", "/api/products", 200, responseTime);

    return successResponse(products, 200);
  } catch (error) {
    logger.error("Error fetching products", error as Error);
    return serverErrorResponse("Failed to fetch products");
  }
}
