import mongoose from 'mongoose';
import { ENV } from './env.js';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async (): Promise<typeof mongoose> => {
  // If already connected, reuse connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Warn if production is attempting to connect to localhost
  if (
    ENV.NODE_ENV === 'production' &&
    (ENV.MONGODB_URI.includes('127.0.0.1') || ENV.MONGODB_URI.includes('localhost'))
  ) {
    console.error(
      '[Database] CRITICAL: Running in production but MONGODB_URI is still pointing to localhost! ' +
      'Please configure MONGODB_URI in your Vercel Project Settings with your MongoDB Atlas connection string.'
    );
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of hanging indefinitely
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(ENV.MONGODB_URI, opts)
      .then((m) => {
        console.log(`[Database] MongoDB Connected successfully: ${m.connection.host}/${m.connection.name}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('[Database] MongoDB connection error:', err.message || err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB disconnected');
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on('error', (err) => {
  console.error('[Database] MongoDB error event:', err);
});

