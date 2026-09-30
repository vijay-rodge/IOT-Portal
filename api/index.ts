import { createApp } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let isDbConnected = false;
const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
  } catch (error: any) {
    console.error('Serverless DB connection failed:', error);
    return res.status(500).json({
      success: false,
      message: 'MongoDB connection failed in production.',
      error: error.message || 'Unknown database error',
      troubleshooting: [
        'Check that MONGODB_URI is set in your Vercel Project Settings > Environment Variables.',
        'In MongoDB Atlas, ensure Network Access allows 0.0.0.0/0 (Access from Anywhere).',
        'Verify your Atlas database username and password (special characters must be URL-encoded).',
        'Verify your Atlas cluster connection string includes the database name (e.g. /iot_knowledge_portal).'
      ]
    });
  }

  // Delegate request to Express app
  return app(req as any, res as any);
}
