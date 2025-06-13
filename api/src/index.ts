import config from 'config';

import serverFactory from './server';
import loggerFactory from './utils/logger';
import pricePointsServiceFactory from './domain/pricePointsService';
import apiV1Factory from './routes/apiV1';

const logger = loggerFactory('price-points-service');

const ratesByRoute: Record<string, number> = config.get('RatesByRoute');
const { calculatePricePoints } = pricePointsServiceFactory(logger, ratesByRoute);

const apiV1 = apiV1Factory(logger, calculatePricePoints);

const server = serverFactory(logger, apiV1);

const port = process.env.API_PORT || 3000;

server.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`, {
    environment: process.env.NODE_ENV || 'development',
    port: port
  });
});
