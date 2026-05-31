/**
 * API ROUTE: POST /api/products
 * ==============================
 * AUTHENTICATION: JWT
 * 
 * Creates a new product
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
    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("POST", "/api/products", "JWT");

    const body = await request.json();
    const { name, description, price, stock } = body;

    // Validation
    if (!name || typeof name !== "string") {
      return validationError("name", "Must be a non-empty string");
    }
    if (!price || typeof price !== "number" || price <= 0) {
      return validationError("price", "Must be a positive number");
    }
    if (!Number.isInteger(stock) || stock < 0) {
      return validationError("stock", "Must be a non-negative integer");
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      description: description || "",
      price,
      stock,
      createdAt: new Date()
    };

    const responseTime = performance.now() - startTime;
    logger.logResponse("POST", "/api/products", 201, responseTime);
    logger.info("Product created", {
      productId: newProduct.id,
      name: newProduct.name
    });

    return successResponse(newProduct, 201);
  } catch (error) {
    logger.error("Error creating product", error as Error);
    return serverErrorResponse("Failed to create product");
  }
}
