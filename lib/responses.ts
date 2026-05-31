import { NextResponse } from "next/server";
import { APIResponse } from "./types";
import { v4 as uuidv4 } from "uuid";

/**
 * API Response Helpers
 * ====================
 * Standardized response format for all API endpoints
 */

/**
 * Success response
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date(),
      requestId: uuidv4()
    },
    { status: statusCode }
  );
}

/**
 * Error response
 */
export function errorResponse(
  error: string,
  statusCode: number = 400
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      timestamp: new Date(),
      requestId: uuidv4()
    },
    { status: statusCode }
  );
}

/**
 * Validation error response
 */
export function validationError(
  field: string,
  message: string
): NextResponse<APIResponse> {
  return errorResponse(`${field}: ${message}`, 400);
}

/**
 * Not found response
 */
export function notFoundResponse(resource: string): NextResponse<APIResponse> {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Server error response
 */
export function serverErrorResponse(
  message: string = "Internal server error"
): NextResponse<APIResponse> {
  return errorResponse(message, 500);
}
