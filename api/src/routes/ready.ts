import { Router, Request, Response } from 'express';

const router = Router();

router.get('', (req: Request, res: Response) => {
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
