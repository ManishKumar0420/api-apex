import { Schema, model, Document, models } from "mongoose";
import { SampleData as SampleDataType } from "@/lib/types";

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



const sampleDataSchema = new Schema<SampleDataType>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    apiId: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

export const SampleData =
  models.SampleData || model<SampleDataType>("SampleData", sampleDataSchema);
