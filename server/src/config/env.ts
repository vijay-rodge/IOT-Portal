import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iot_knowledge_portal',
  
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'iot_portal_super_secure_access_token_secret_2026_xYz987',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'iot_portal_super_secure_refresh_token_secret_2026_aBc123',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@iotportal.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminPass123!',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Portal Administrator',
};
