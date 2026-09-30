import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const app = createApp();

    const server = app.listen(ENV.PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 IoT Knowledge Portal API Server running`);
      console.log(`📡 URL: http://localhost:${ENV.PORT}`);
      console.log(`🌐 Mode: ${ENV.NODE_ENV}`);
      console.log(`🎯 Client: ${ENV.CLIENT_URL}`);
      console.log(`===============================================`);
    });

    // Graceful shutdown
    const handleShutdown = () => {
      console.log('\n[Server] Shutting down gracefully...');
      server.close(() => {
        console.log('[Server] HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
