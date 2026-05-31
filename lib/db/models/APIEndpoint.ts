import { Schema, model, Document, models } from "mongoose";
import { APIEndpoint } from "@/lib/types";

/**
 * API ENDPOINT MODEL
 * ===================
 * Stores metadata about API endpoints available for testing
 * 
 * Fields:
 * - name: Display name of the API
 * - description: What the API does
 * - method: HTTP method (GET, POST, etc)
 * - path: API endpoint path
 * - authType: Required authentication (none, apiKey, jwt)
 * - requestSchema: Expected request payload schema
 * - responseSchema: Response payload schema
 * - chainableWith: IDs of other APIs this can chain with
 */

interface APIEndpointDocument extends APIEndpoint, Document {}

const apiEndpointSchema = new Schema<APIEndpointDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      required: true
    },
    path: {
      type: String,
      required: true,
      unique: true
    },
    authType: {
      type: String,
      enum: ["none", "apiKey", "jwt"],
      default: "none"
    },
    requestSchema: {
      type: Schema.Types.Mixed,
      default: {}
    },
    responseSchema: {
      type: Schema.Types.Mixed,
      default: {}
    },
    chainableWith: [String]
  },
  { timestamps: true }
);

export const APIEndpoint =
  models.APIEndpoint || model<APIEndpointDocument>("APIEndpoint", apiEndpointSchema);
