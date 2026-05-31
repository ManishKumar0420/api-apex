import mongoose, { Mongoose } from "mongoose";

/**
 * MONGODB CONNECTION MANAGER
 * ===========================
 * 
 * Manages MongoDB connection with caching for performance.
 * Implements pattern: Single connection instance reused across requests
 * 
 * Features:
 * - Connection pooling
 * - Error handling
 * - Caching for serverless environments
 */

let cachedConnection: Mongoose | null = null;

export async function connectDB(): Promise<Mongoose> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  // Return cached connection if available
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 5
    });

    cachedConnection = connection;
    console.log("✅ Connected to MongoDB");
    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (cachedConnection) {
    await cachedConnection.disconnect();
    cachedConnection = null;
  }
}

export function getConnection(): Mongoose | null {
  return cachedConnection;
}
