import express, { Router, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

import { rateLimiting, requestSizeLimiting } from './middlewares/security';
import errorHandlersFactory from './middlewares/errorHandlers';
import health from './routes/health';
import ready from './routes/ready';

export default (logger: any, apiV1: Router) => {
  const app = express();

  const { notFoundHandler, globalErrorHandler } = errorHandlersFactory(logger);

  app.use([
    // Security
    helmet(),
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(','),
      credentials: true,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
    }),
    rateLimiting,
    requestSizeLimiting,

    // Performance
    compression(),

    // Body parsing
    express.json({ limit: '10kb' }),
    express.urlencoded({ extended: true, limit: '10kb' }),
  ]);

  app.use('/health', health);
  app.use('/ready', ready);

  // API routes
  app.use('/api/v1', apiV1);

  app.use(notFoundHandler);
  app.use(globalErrorHandler);

  // Graceful shutdown
  const shutdown = () => {
    logger.info('Shutting down...');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
    process.exit(1);
  });

  return app;
};
