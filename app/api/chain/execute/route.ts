/**
 * API ROUTE: POST /api/chain/execute
 * ===================================
 * AUTHENTICATION: JWT
 * 
 * Dynamic API Chaining Executor
 * Allows executing multiple APIs in sequence where output of one
 * becomes the input for the next
 * 
 * Example Request:
 * {
 *   "chains": [
 *     { "apiId": "users-list", "params": {} },
 *     { "apiId": "products-list", "params": {}, "extractFrom": "0.id" }
 *   ]
 * }
 */

import { NextRequest } from "next/server";
import { checkAuth, authErrorResponse } from "@/lib/auth";
import { successResponse, serverErrorResponse } from "@/lib/responses";
import { AuthType } from "@/lib/types";
import { AppLogger, generateRequestId } from "@/lib/logger";

interface ChainStep {
  apiId: string;
  params?: Record<string, any>;
  extractFrom?: string; // JSON path to extract data from previous response
}

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const logger = new AppLogger(requestId);
  const startTime = performance.now();

  try {
    const auth = await checkAuth(request, AuthType.JWT);
    if (!auth.authenticated) {
      return authErrorResponse(auth.error || "Unauthorized");
    }

    logger.logRequest("POST", "/api/chain/execute", "JWT");

    const body = await request.json();
    const { chains } = body as { chains: ChainStep[] };

    if (!chains || !Array.isArray(chains) || chains.length === 0) {
      return serverErrorResponse("Invalid chain configuration");
    }

    const results: any[] = [];
    let previousData: any = null;

    // Execute each API in the chain
    for (let i = 0; i < chains.length; i++) {
      const step = chains[i];
      logger.debug(`Executing chain step ${i + 1}/${chains.length}`, {
        apiId: step.apiId
      });

      // Simulate API execution with data transformation
      let stepData: any;

      if (step.apiId === "users-list") {
        stepData = [
          { id: "1", name: "John Doe", email: "john@example.com" },
          { id: "2", name: "Jane Smith", email: "jane@example.com" }
        ];
      } else if (step.apiId === "products-list") {
        stepData = [
          { id: "1", name: "Laptop", price: 999.99, stock: 50 },
          { id: "2", name: "Mouse", price: 29.99, stock: 200 }
        ];
      } else if (step.apiId === "products-get") {
        // Use extracted data from previous response
        const productId = step.extractFrom ? extractValue(previousData, step.extractFrom) : "1";
        stepData = {
          id: productId,
          name: "Laptop",
          price: 999.99,
          stock: 50
        };
      } else {
        stepData = { message: `Mock response for ${step.apiId}` };
      }

      previousData = stepData;
      results.push({
        step: i + 1,
        apiId: step.apiId,
        data: stepData
      });
    }

    const responseTime = performance.now() - startTime;
    logger.logResponse("POST", "/api/chain/execute", 200, responseTime);
    logger.info("Chain execution completed", {
      stepsExecuted: chains.length,
      totalTimeMs: responseTime
    });

    return successResponse(
      {
        success: true,
        stepsExecuted: chains.length,
        results: results,
        totalExecutionTime: responseTime,
        completedAt: new Date()
      },
      200
    );
  } catch (error) {
    logger.error("Error executing chain", error as Error);
    return serverErrorResponse("Failed to execute API chain");
  }
}

/**
 * Helper to extract value from object using JSON path
 * Simple implementation for demo purposes
 */
function extractValue(obj: any, path: string): any {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (Array.isArray(current)) {
      const index = parseInt(key, 10);
      current = current[index];
    } else {
      current = current?.[key];
    }
  }

  return current;
}
