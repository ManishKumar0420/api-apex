import mongoose, { Mongoose } from "mongoose";
import DBConnectionInterface from "../interfaces/DBConnectionInterface";

type CachedType = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: CachedType | undefined;
}

export class MongooseConnection implements DBConnectionInterface {
  private mongoUri: string;
  private cached: CachedType;

  constructor() {
    this.mongoUri = process.env.MONGODB_URI!;

    if (!this.mongoUri) {
      throw new Error("MONGODB_URI is missing");
    }

    if (!globalThis.mongooseCache) {
      globalThis.mongooseCache = {
        conn: null,
        promise: null,
      };
    }

    this.cached = globalThis.mongooseCache;
  }

  async connect(): Promise<Mongoose> {
    if (this.cached.conn) {
      return this.cached.conn;
    }

    if (!this.cached.promise) {
      this.cached.promise = mongoose.connect(this.mongoUri, {
        bufferCommands: false,
      });
    }

    this.cached.conn = await this.cached.promise;

    return this.cached.conn;
  }

  async disconnect(): Promise<void> {
    if (this.cached.conn) {
      await mongoose.disconnect();

      this.cached.conn = null;
      this.cached.promise = null;
    }
  }
}
