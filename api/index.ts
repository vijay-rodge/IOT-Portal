import { createApp } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import { autoSeedIfEmpty } from '../server/src/seed/autoSeed.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await connectDB();
    await autoSeedIfEmpty();
  } catch (error: any) {
    console.error('[Serverless] MongoDB connection failed:', error);
    return res.status(500).json({
      success: false,
      message: 'MongoDB database connection failed in production.',
      error: error.message || 'Unknown database connection error',
      hints: [
        'Ensure MONGODB_URI environment variable is configured in Vercel Project Settings.',
        'Ensure MongoDB Atlas Network Access allows 0.0.0.0/0 (Access from Anywhere).'
      ]
    });
  }

  // Restore matched subpath if Vercel provided x-matched-path
  const matchedPath = req.headers['x-matched-path'] as string;
  if (matchedPath && req.url === '/api') {
    req.url = matchedPath;
  }

  // Delegate request to Express app
  return app(req as any, res as any);
}
