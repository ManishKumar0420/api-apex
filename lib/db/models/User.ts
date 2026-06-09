import { Schema, model, Document, models } from "mongoose";
import { User as IUser } from "@/lib/types";

/**
 * USER MODEL
 * ===========
 * Stores user credentials and authentication tokens
 * 
 * Fields:
 * - email: User email for login
 * - password: Hashed password (would be hashed in production)
 * - apiKey: API Key for header-based auth
 * - jwtSecret: Secret for JWT generation
 * - createdAt/updatedAt: Timestamps
 */



const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    apiKey: {
      type: String,
      default: () => `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },
    jwtSecret: {
      type: String,
      default: () => Math.random().toString(36).substr(2)
    }
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", userSchema);
