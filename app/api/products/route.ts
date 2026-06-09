/**
 * API ROUTE: GET /api/products
 * =============================
 * AUTHENTICATION: API Key
 * 
 * Fetches all products from database
 * This endpoint demonstrates:
 * - API Key authentication
 * - Database retrieval
 * - Array response with metadata
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";
import { Product } from "@/lib/db/models/Product";
import { connectDB } from "@/lib/db/connection";

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    // Connect to database
    await connectDB();

    // Check API Key authentication
    const auth = await checkAuth(request, AuthType.API_KEY);
    if (!auth.authenticated) {
      logger.warn("Unauthorized access to products");
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("GET", "/api/products", "API_KEY");

    // Fetch products from database
    const products = await Product.find().lean();

    const responseTime = performance.now() - startTime;
    logger.logResponse("GET", "/api/products", 200, responseTime);

    return successResponse(products, 200);
  } catch (error) {
    logger.error("Error fetching products", error as Error);
    return serverErrorResponse("Failed to fetch products");
  }
}
