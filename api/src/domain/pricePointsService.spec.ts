import pricePointsFactory from './pricePointsService';
import { FlightDetails } from '../types';

const mockLogger = {
  info: jest.fn(),
  debug: jest.fn(),
};

const rates = {
  'LHR-JFK': 0.03,
  '-': 0.02,
};

const flightData: FlightDetails = {
  DepartureAirportCode: 'LHR',
  ArrivalAirportCode: 'JFK',
  DepartureTime: '2025-07-01T10:00:00Z',
  ArrivalTime: '2025-07-01T14:00:00Z',
  Price: 100,
  Currency: 'GBP',
};

const service = pricePointsFactory(mockLogger, rates);

describe('getRateByRoute', () => {
  test('should return the exact rate when route exists', () => {
    expect(service.getRateByRoute('LHR-JFK')).toBe(0.03);
  });

  test('should return the fallback rate when route is unknown', () => {
    expect(service.getRateByRoute('XXX-YYY')).toBe(0.02);
  });
});

describe('cashToAvios', () => {
  test('should compute ceiling of cash divided by rate', () => {
    expect(service.cashToAvios(30, 0.03)).toBe(1000);
  });

  test('should round up even for non-integer result', () => {
    expect(service.cashToAvios(29.9, 0.03)).toBe(997);
  });
});

describe('calculatePricePoints', () => {
  test('should return four price points with correct discount and Avios', () => {
    expect(service.calculatePricePoints(flightData)).toEqual([
      { cashDiscount: 20, aviosPoints: 667 },
      { cashDiscount: 50, aviosPoints: 1667 },
      { cashDiscount: 70, aviosPoints: 2334 },
      { cashDiscount: 100, aviosPoints: 3334 },
    ]);
  });

  test('should log calculation steps with route and results', () => {
    service.calculatePricePoints(flightData);
    expect(mockLogger.info).toHaveBeenCalledWith('Calculating price points', {
      route: 'LHR-JFK',
      price: 100,
      rate: 0.03,
    });
    expect(mockLogger.debug).toHaveBeenCalledWith('Price points calculated', {
      route: 'LHR-JFK',
      pricePoints: [
        { cashDiscount: 20, aviosPoints: 667 },
        { cashDiscount: 50, aviosPoints: 1667 },
        { cashDiscount: 70, aviosPoints: 2334 },
        { cashDiscount: 100, aviosPoints: 3334 },
      ],
    });
  });
});
