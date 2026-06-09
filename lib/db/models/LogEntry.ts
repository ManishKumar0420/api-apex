import { Schema, model, Document, models } from "mongoose";
import { LogEntry as LogEntryType } from "@/lib/types";

/**
 * LOG ENTRY MODEL
 * ================
 * Stores API request/response logs for audit trail and debugging
 * 
 * Fields:
 * - level: Log severity (info, warn, error, debug)
 * - message: Log message
 * - context: Additional context data
 * - requestId: Unique request identifier for tracing
 * - duration: Response time in milliseconds
 */


const logEntrySchema = new Schema<LogEntryType>(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    level: {
      type: String,
      enum: ["info", "warn", "error", "debug"],
      default: "info"
    },
    message: {
      type: String,
      required: true
    },
    context: {
      type: Schema.Types.Mixed
    },
    requestId: {
      type: String,
      index: true
    },
    duration: Number
  },
  { collection: "logs" }
);

// TTL index to auto-delete logs after 30 days
logEntrySchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export const LogEntry = models.LogEntry || model<LogEntryType>("LogEntry", logEntrySchema);
