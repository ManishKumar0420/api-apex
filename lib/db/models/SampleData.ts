import { Schema, model, Document, models } from "mongoose";
import { SampleData } from "@/lib/types";

/**
 * SAMPLE DATA MODEL (FOR CRUD)
 * =============================
 * Stores sample data used in CRUD operations
 * 
 * Fields:
 * - userId: Owner of the data
 * - apiId: Which API endpoint this data is for
 * - data: The actual data payload
 * - createdAt/updatedAt: Timestamps
 */

interface SampleDataDocument extends SampleData, Document {}

const sampleDataSchema = new Schema<SampleDataDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    apiId: {
      type: String,
      required: true,
      index: true
    },
    data: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

export const SampleData =
  models.SampleData || model<SampleDataDocument>("SampleData", sampleDataSchema);
