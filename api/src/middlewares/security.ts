import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// max 50 requests per 10 minutes from an ip
const rateLimiting = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false
});

// 2kb max per request as price calculations should be small
const requestSizeLimiting = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = req.get('content-length');
  const maxSize = 1024 * 2;

  if (contentLength && parseInt(contentLength) > maxSize) {
    res.status(413).json({
      success: false,
      error: 'Request entity too large'
    });
    return;
  }

  next();
};

export {
  rateLimiting,
  requestSizeLimiting
};
