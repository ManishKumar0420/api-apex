/**
 * API ROUTE: GET /api/products/[id]
 * ==================================
 * AUTHENTICATION: No Auth
 *
 * Gets a single product from database by ID
 */

import { NextRequest } from "next/server";
import {
  successResponse,
  serverErrorResponse,
  notFoundResponse,
} from "@/lib/responses";
import { AppLogger, generateRequestId } from "@/lib/logger";
import { Product } from "@/lib/db/models/Product";
import { connectDB } from "@/lib/db/connection";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    // Connect to database
    await connectDB();

    // Next.js 15 requires awaiting params
    const { id } = await params;

    logger.logRequest("GET", `/api/products/${id}`, "NONE");

    // Find product in database
    const product = await Product.findById(id).lean();

    if (!product) {
      logger.warn("Product not found", { productId: id });
      return notFoundResponse("Product");
    }

    const responseTime = performance.now() - startTime;

    logger.logResponse("GET", `/api/products/${id}`, 200, responseTime);

    return successResponse(product, 200);
  } catch (error) {
    logger.error("Error fetching product", error as Error);
    return serverErrorResponse("Failed to fetch product");
  }
}
