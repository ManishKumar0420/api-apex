/**
 * API ROUTE: POST /api/products/create
 * =====================================
 * AUTHENTICATION: JWT
 * 
 * Creates a new product and saves to database
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse, validationError } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";
import { Product } from "@/lib/db/models/Product";
import { connectDB } from "@/lib/db/connection";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    // Connect to database
    await connectDB();

    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("POST", "/api/products/create", "JWT");

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

    // Create product in database
    const newProduct = new Product({
      name,
      description: description || "",
      price,
      stock
    });

    await newProduct.save();

    const responseTime = performance.now() - startTime;
    logger.logResponse("POST", "/api/products/create", 201, responseTime);
    logger.info("Product created in database", {
      productId: newProduct._id,
      name: newProduct.name,
      price: newProduct.price
    });

    return successResponse(
      {
        id: newProduct._id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        stock: newProduct.stock,
        createdAt: newProduct.createdAt
      },
      201
    );
  } catch (error) {
    logger.error("Error creating product", error as Error);
    return serverErrorResponse("Failed to create product");
  }
}
