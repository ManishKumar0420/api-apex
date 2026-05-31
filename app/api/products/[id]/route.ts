/**
 * API ROUTE: GET /api/products/[id]
 * ==================================
 * AUTHENTICATION: No Auth
 * 
 * Gets a single product by ID
 */

import { NextRequest } from "next/server";
import { successResponse, serverErrorResponse, notFoundResponse } from "@/lib/responses";
import { AppLogger, generateRequestId } from "@/lib/logger";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    const { id } = params;

    logger.logRequest("GET", `/api/products/${id}`, "NONE");

    // Simulated product lookup
    const products: Record<string, any> = {
      "1": {
        id: "1",
        name: "Laptop",
        description: "High-performance laptop",
        price: 999.99,
        stock: 50,
        createdAt: new Date()
      },
      "2": {
        id: "2",
        name: "Mouse",
        description: "Wireless mouse",
        price: 29.99,
        stock: 200,
        createdAt: new Date()
      }
    };

    const product = products[id];

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
