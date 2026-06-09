import { Schema, model, Document, models } from "mongoose";

/**
 * PRODUCT MODEL
 * ==============
 * Stores product information for the API
 * 
 * Fields:
 * - name: Product name
 * - description: Product description
 * - price: Product price
 * - stock: Stock quantity
 * - createdAt/updatedAt: Timestamps
 */

interface ProductDocument extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

export const Product = models.Product || model<ProductDocument>("Product", productSchema);
