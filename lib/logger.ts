import pino, { Logger as PinoLogger } from "pino";
import { v4 as uuidv4 } from "uuid";
import { LogEntry } from "@/lib/db/models/LogEntry";
import { connectDB } from "@/lib/db/connection";

/**
 * LOGGER SYSTEM FOR API TESTING PLATFORM
 * ========================================
 * 
 * This is a comprehensive logging solution that:
 * - Logs all API requests and responses
 * - Tracks performance metrics (response times)
 * - Stores logs in MongoDB for later retrieval
 * - Provides real-time log viewing in UI
 * - Includes request IDs for tracing
 * 
 * Features:
 * - Pino logger for high-performance logging
 * - Request ID generation for request tracking
 * - Context-aware logging
 * - Multiple log levels (debug, info, warn, error)
 * - Structured logging with JSON output
 * - Database persistence for audit trail
 */

// Configure pino logger
const logger: PinoLogger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname"
    }
  }
});

/**
 * Generates unique request ID for tracing
 */
export function generateRequestId(): string {
  return uuidv4();
}

/**
 * Logger class that wraps pino with custom functionality
 */
export class AppLogger {
  private requestId: string;

  constructor(requestId?: string) {
    this.requestId = requestId || generateRequestId();
  }

  /**
   * Save log to database
   */
  private async saveToDatabase(level: string, message: string, context?: Record<string, any>) {
    try {
      await connectDB();
      await LogEntry.create({
        timestamp: new Date(),
        level: level as "info" | "warn" | "error" | "debug",
        message,
        context,
        requestId: this.requestId,
        duration: context?.responseTimeMs
      });
    } catch (dbError) {
      // Fallback: just log to console if DB fails
      console.error("Failed to save log to database:", dbError);
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context?: Record<string, any>) {
    logger.info(
      {
        requestId: this.requestId,
        ...context
      },
      message
    );
    // Save to database asynchronously
    this.saveToDatabase("info", message, context).catch(err => 
      console.error("Error saving info log:", err)
    );
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | Record<string, any>) {
    const errorContext = {
      requestId: this.requestId,
      error: error instanceof Error ? error.message : error
    };
    logger.error(errorContext, message);
    
    // Save to database asynchronously
    this.saveToDatabase("error", message, errorContext).catch(err => 
      console.error("Error saving error log:", err)
    );
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: Record<string, any>) {
    logger.warn(
      {
        requestId: this.requestId,
        ...context
      },
      message
    );
    
    // Save to database asynchronously
    this.saveToDatabase("warn", message, context).catch(err => 
      console.error("Error saving warn log:", err)
    );
  }

  /**
   * Debug level logging
   */
  debug(message: string, context?: Record<string, any>) {
    logger.debug(
      {
        requestId: this.requestId,
        ...context
      },
      message
    );
    
    // Save to database asynchronously
    this.saveToDatabase("debug", message, context).catch(err => 
      console.error("Error saving debug log:", err)
    );
  }

  /**
   * API Request logging with timing
   */
  logRequest(method: string, path: string, auth?: string) {
    this.info(`${method} ${path}`, {
      type: "REQUEST",
      method,
      path,
      authType: auth || "NONE"
    });
  }

  /**
   * API Response logging with performance metrics
   */
  logResponse(
    method: string,
    path: string,
    statusCode: number,
    responseTime: number,
    dataSize?: number
  ) {
    this.info(`${method} ${path} - ${statusCode}`, {
      type: "RESPONSE",
      method,
      path,
      statusCode,
      responseTimeMs: responseTime,
      dataSizeBytes: dataSize
    });
  }

  /**
   * Get the request ID for this logger instance
   */
  getRequestId(): string {
    return this.requestId;
  }
}

/**
 * In-memory log storage for dashboard (production would use database)
 */
export class InMemoryLogStore {
  private logs: Map<string, any[]> = new Map();
  private maxLogsPerRequest = 100;

  addLog(requestId: string, log: any) {
    if (!this.logs.has(requestId)) {
      this.logs.set(requestId, []);
    }

    const logs = this.logs.get(requestId)!;
    logs.push({
      ...log,
      timestamp: new Date()
    });

    // Keep only recent logs
    if (logs.length > this.maxLogsPerRequest) {
      logs.shift();
    }
  }

  getLogs(requestId: string): any[] {
    return this.logs.get(requestId) || [];
  }

  getAllLogs(): Map<string, any[]> {
    return this.logs;
  }

  clearLogs(requestId: string) {
    this.logs.delete(requestId);
  }
}

// Global log store instance
export const logStore = new InMemoryLogStore();

/**
 * Global logger instance
 */
export const globalLogger = new AppLogger();

export default logger;
