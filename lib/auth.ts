import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { AuthType, JWTPayload } from "./types";
import { AppLogger } from "./logger";

/**
 * AUTHENTICATION MIDDLEWARE
 * ==========================
 * 
 * Supports three authentication methods:
 * 1. NO AUTH - Public endpoints
 * 2. API KEY - Simple header-based authentication
 * 3. JWT - Token-based authentication
 * 
 * Usage:
 * - Extract auth type from request
 * - Validate credentials
 * - Attach user info to request context
 */

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const API_KEY = process.env.API_KEY || "api-key";

/**
 * Extract authentication credentials from request
 */
export function extractAuthFromRequest(
  request: NextRequest
): { type: AuthType; credentials?: string } {
  const authHeader = request.headers.get("Authorization");
  const apiKey = request.headers.get("X-API-Key");

  if (!authHeader && !apiKey) {
    return { type: AuthType.NONE };
  }

  if (apiKey) {
    return { type: AuthType.API_KEY, credentials: apiKey };
  }

  if (authHeader?.startsWith("Bearer ")) {
    return { type: AuthType.JWT, credentials: authHeader.slice(7) };
  }

  return { type: AuthType.NONE };
}

/**
 * Validate API Key authentication
 */
export function validateAPIKey(key: string): boolean {
  return key === API_KEY;
}

/**
 * Validate JWT token and extract payload
 */
export function validateJWT(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate JWT token
 */
export function generateJWT(userId: string, email: string): string {
  return jwt.sign(
    {
      userId,
      email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
    },
    JWT_SECRET,
    { algorithm: "HS256" }
  );
}

/**
 * Middleware to check authentication
 */
export async function checkAuth(
  request: NextRequest,
  requiredAuth: AuthType
): Promise<{
  authenticated: boolean;
  error?: string;
  payload?: JWTPayload;
}> {
  const logger = new AppLogger();

  // If no auth required, always pass
  if (requiredAuth === AuthType.NONE) {
    return { authenticated: true };
  }

  const { type, credentials } = extractAuthFromRequest(request);

  // Auth type must match required type
  if (type !== requiredAuth) {
    logger.warn("Authentication type mismatch", {
      required: requiredAuth,
      provided: type
    });
    return {
      authenticated: false,
      error: `Expected ${requiredAuth} authentication`
    };
  }

  if (!credentials) {
    return { authenticated: false, error: "Missing credentials" };
  }

  // Validate API Key
  if (type === AuthType.API_KEY) {
    const isValid = validateAPIKey(credentials);
    if (!isValid) {
      logger.warn("Invalid API key");
      return { authenticated: false, error: "Invalid API key" };
    }
    return { authenticated: true };
  }

  // Validate JWT
  if (type === AuthType.JWT) {
    const payload = validateJWT(credentials);
    if (!payload) {
      logger.warn("Invalid JWT token");
      return { authenticated: false, error: "Invalid or expired JWT token" };
    }
    return { authenticated: true, payload };
  }

  return { authenticated: false, error: "Unknown authentication type" };
}

/**
 * Response helper for authentication errors
 */
export function authErrorResponse(message: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date()
    },
    { status: 401 }
  );
}

/**
 * Response helper for forbidden errors
 */
export function forbiddenResponse(message: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date()
    },
    { status: 403 }
  );
}
