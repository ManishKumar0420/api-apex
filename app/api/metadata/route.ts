/**
 * API ROUTE: GET /api/metadata
 * =============================
 * AUTHENTICATION: No Auth
 * 
 * Returns metadata about all available API endpoints
 * Used by the dashboard to display API information
 */

import { NextRequest } from "next/server";
import { successResponse, serverErrorResponse } from "@/lib/responses";
import { AuthType, HttpMethod } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    logger.logRequest("GET", "/api/metadata", "NONE");

    const apiMetadata = [
      {
        id: "users-list",
        name: "Get All Users",
        description: "Fetch list of all users in the system",
        method: HttpMethod.GET,
        path: "/api/users",
        authType: AuthType.JWT,
        requestSchema: {},
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              createdAt: { type: "string" }
            }
          }
        },
        chainableWith: ["products-list"]
      },
      {
        id: "users-create",
        name: "Create User",
        description: "Create a new user",
        method: HttpMethod.POST,
        path: "/api/users/create",
        authType: AuthType.JWT,
        requestSchema: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" }
          }
        },
        responseSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string" }
          }
        },
        chainableWith: ["products-list"]
      },
      {
        id: "users-update",
        name: "Update User",
        description: "Update an existing user by ID",
        method: HttpMethod.PUT,
        path: "/api/users/[id]",
        authType: AuthType.API_KEY,
        requestSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" }
          }
        },
        responseSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            updatedAt: { type: "string" }
          }
        },
        chainableWith: []
      },
      {
        id: "users-delete",
        name: "Delete User",
        description: "Delete a user by ID",
        method: HttpMethod.DELETE,
        path: "/api/users/[id]/delete",
        authType: AuthType.NONE,
        requestSchema: {},
        responseSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
            id: { type: "string" }
          }
        },
        chainableWith: []
      },
      {
        id: "products-list",
        name: "Get All Products",
        description: "Fetch list of all products",
        method: HttpMethod.GET,
        path: "/api/products",
        authType: AuthType.API_KEY,
        requestSchema: {},
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              price: { type: "number" },
              stock: { type: "integer" },
              createdAt: { type: "string" }
            }
          }
        },
        chainableWith: ["users-list"]
      },
      {
        id: "products-create",
        name: "Create Product",
        description: "Create a new product",
        method: HttpMethod.POST,
        path: "/api/products/create",
        authType: AuthType.JWT,
        requestSchema: {
          type: "object",
          required: ["name", "price", "stock"],
          properties: {
            name: { type: "string", example: "Laptop" },
            description: { type: "string" },
            price: { type: "number", example: 999.99 },
            stock: { type: "integer", example: 50 }
          }
        },
        responseSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            stock: { type: "integer" },
            createdAt: { type: "string" }
          }
        },
        chainableWith: []
      },
      {
        id: "products-get",
        name: "Get Single Product",
        description: "Get a product by ID",
        method: HttpMethod.GET,
        path: "/api/products/[id]",
        authType: AuthType.NONE,
        requestSchema: {},
        responseSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            stock: { type: "integer" },
            createdAt: { type: "string" }
          }
        },
        chainableWith: []
      },
      {
        id: "api-chain-test",
        name: "API Chain Test",
        description: "Test API chaining by fetching user then products",
        method: HttpMethod.POST,
        path: "/api/chain/test",
        authType: AuthType.JWT,
        requestSchema: {
          type: "object",
          properties: {
            userId: { type: "string", example: "1" },
            chainApis: {
              type: "array",
              items: { type: "string" },
              example: ["users-list", "products-list"]
            }
          }
        },
        responseSchema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            results: { type: "array" }
          }
        },
        chainableWith: []
      }
    ];

    const responseTime = performance.now() - startTime;
    logger.logResponse("GET", "/api/metadata", 200, responseTime);

    return successResponse(
      {
        totalApis: apiMetadata.length,
        apis: apiMetadata
      },
      200
    );
  } catch (error) {
    logger.error("Error fetching metadata", error as Error);
    return serverErrorResponse("Failed to fetch API metadata");
  }
}
