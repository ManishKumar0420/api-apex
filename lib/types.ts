// ============================================
// TYPE DEFINITIONS FOR API TESTING PLATFORM
// ============================================

/**
 * Authentication types for API endpoints
 */
export enum AuthType {
  NONE = "none",
  API_KEY = "apiKey",
  JWT = "jwt"
}

/**
 * HTTP methods supported
 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH"
}

/**
 * API endpoint metadata stored in database
 */
export interface APIEndpoint {
  _id: string;
  name: string;
  description: string;
  method: HttpMethod;
  path: string;
  authType: AuthType;
  requestSchema: Record<string, any>;
  responseSchema: Record<string, any>;
  chainableWith?: string[]; // IDs of other APIs this can chain with
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User entity for authentication
 */
export interface User {
  _id: string;
  email: string;
  password: string;
  apiKey: string;
  jwtSecret: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sample data for CRUD operations
 */
export interface SampleData {
  _id: string;
  userId: string;
  apiId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Log entry for API requests and responses
 */
export interface LogEntry {
  _id: string;
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context?: Record<string, any>;
  requestId?: string;
  duration?: number; // in milliseconds
}

/**
 * API Response format
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  requestId: string;
}

/**
 * Authentication payload in JWT
 */
export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Dashboard API Test Request
 */
export interface APITestRequest {
  apiId: string;
  authMethod: AuthType;
  authToken?: string;
  payload?: Record<string, any>;
  responseDelay?: number; // in milliseconds
  chainWith?: {
    apiId: string;
    extractFrom: string; // JSON path to extract data
  };
}

/**
 * Dashboard API Test Response
 */
export interface APITestResponse {
  apiId: string;
  statusCode: number;
  responseTime: number;
  data: any;
  error?: string;
  chainedApis?: APITestResponse[];
}
