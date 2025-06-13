import { Request, Response, NextFunction } from 'express';
import { ServerError } from '../types';

export default (logger: any): any => {
  const globalErrorHandler = (
    err: ServerError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error('Unhandled error', {
      error: message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(statusCode).json({
      success: false,
      error: statusCode === 500 ? 'Internal server error' : message
    });
  };

  // 404
  const notFoundHandler = (req: Request, res: Response): void => {
    if (req.url === '/favicon.ico') {
      res.status(204).end();
      return;
    }

    logger.warn('Route not found', {
      url: req.url,
      method: req.method,
      ip: req.ip
    });

    res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  };

  return {
    globalErrorHandler,
    notFoundHandler
  };
};
