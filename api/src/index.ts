import config from 'config';
import { Pool } from 'pg';

import serverFactory from './server';
import loggerFactory from './utils/logger';
import pricePointsServiceFactory from './domain/pricePointsService';
import apiV1Factory from './routes/apiV1';
import rateRepositoryFactory from './dal/rateRepository';

const pool = new Pool(config.get('Database'));
const logger = loggerFactory('price-points-service');
const { fetchRateByRoute } = rateRepositoryFactory(logger, pool);

const ratesByRoute: Record<string, number> = config.get('RatesByRoute');
const { calculatePricePoints } = pricePointsServiceFactory(logger, fetchRateByRoute);

const apiV1 = apiV1Factory(logger, pool, calculatePricePoints);

const server = serverFactory(logger, pool, apiV1);

const port = process.env.API_PORT || 3000;

server.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`, {
    environment: process.env.NODE_ENV || 'development',
    port: port
  });
});
