import express, { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { FlightDetails, PricePointsResponse } from '../types';
import validator from '../validators/flightDetails';

export default (logger: any, pool: any, calculatePricePoints: Function) => {
  const router = express.Router();

  router.post('/price-points', async (req: Request, res: Response): Promise<void> => {
    const requestId = req.get('X-Request-ID') || uuid();
    const startTime = Date.now();

    try {
      const flightData: FlightDetails = req.body;

      logger.info('Price points calculation request', {
        requestId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        route: `${flightData.DepartureAirportCode}-${flightData.ArrivalAirportCode}`,
        price: flightData.Price,
        currency: flightData.Currency
      });

      const { error, value } = validator.validate(req.body);

      if (error) {
        logger.warn('Validation failed', {
          requestId,
          error,
          flightData
        });

        const response = { success: false, error: error.message };

        res.status(400).json(response);
        return;
      }

      // Calculate price points
      const pricePoints = calculatePricePoints(flightData);

      const processingTime = Date.now() - startTime;

      logger.info('Price points calculated successfully', {
        requestId,
        processingTime,
        route: `${flightData.DepartureAirportCode}-${flightData.ArrivalAirportCode}`,
        pricePointsCount: pricePoints.length
      });

      const response: PricePointsResponse = { success: true, pricePoints };

      res.status(200).json(response);
    } catch (error) {
      const processingTime = Date.now() - startTime;

      logger.error('Error calculating price points', {
        requestId,
        processingTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        ip: req.ip
      });

      const response: PricePointsResponse = {
        success: false,
        error: 'Internal server error'
      };

      res.status(500).json(response);
    }
  });

  return router;
};

