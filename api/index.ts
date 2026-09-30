import { createApp } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let isDbConnected = false;
const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure MongoDB connection is reused across serverless invocations
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (error) {
      console.error('Serverless DB connection failed:', error);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
      });
    }
  }

  // Delegate request to Express app
  return app(req as any, res as any);
}
