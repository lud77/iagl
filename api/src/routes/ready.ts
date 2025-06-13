import { Router, Request, Response } from 'express';

export default (pool: any) => {
  const router = Router();

  router.get('', async (_req: Request, res: Response) => {
    try {
      await pool.query('SELECT 1'); // liveness check

      res.json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (err) {
      res.status(503).send('Database is not ready');
    }
  });

  return router;
};
