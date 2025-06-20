import pricePointsFactory from './pricePointsService';
import { FetchRateByRoute, FlightDetails } from '../types';

const mockLogger = {
  info: jest.fn(),
  debug: jest.fn(),
};

const rates: Record<string, number> = {
  'LHR-JFK': 0.03,
  '-': 0.02,
};

const fetchRateByRouteMock = async (route: string): Promise<number | null> => {
  return rates[route];
};

const flightData: FlightDetails = {
  DepartureAirportCode: 'LHR',
  ArrivalAirportCode: 'JFK',
  DepartureTime: '2025-07-01T10:00:00Z',
  ArrivalTime: '2025-07-01T14:00:00Z',
  Price: 100,
  Currency: 'GBP',
};

const service = pricePointsFactory(mockLogger, fetchRateByRouteMock);

describe('getRateByRoute', () => {
  it('should return the rate when route exists', async () => {
    expect(await service.getRateByRoute('LHR-JFK')).toBe(0.03);
  });

  it('should return the fallback rate when route is unknown', async () => {
    expect(await service.getRateByRoute('XXX-YYY')).toBe(0.02);
  });
});

describe('cashToAvios', () => {
  it('should compute ceiling of cash divided by rate', async () => {
    expect(await service.cashToAvios(30, 0.03)).toBe(1000);
  });

  it('should round up even for non-integer result', async () => {
    expect(await service.cashToAvios(29.9, 0.03)).toBe(997);
  });
});

describe('calculatePricePoints', () => {
  it('should return four price points with correct discount and Avios', async () => {
    expect(await service.calculatePricePoints(flightData)).toEqual([
      { discountRate: .2, cashDiscount: 20, aviosPoints: 667 },
      { discountRate: .5, cashDiscount: 50, aviosPoints: 1667 },
      { discountRate: .7, cashDiscount: 70, aviosPoints: 2334 },
      { discountRate: 1, cashDiscount: 100, aviosPoints: 3334 },
    ]);
  });

  it('should log calculation steps with route and results', async () => {
    await service.calculatePricePoints(flightData);
    expect(mockLogger.info).toHaveBeenCalledWith('Calculating price points', {
      route: 'LHR-JFK',
      price: 100,
      rate: 0.03,
    });
    expect(mockLogger.debug).toHaveBeenCalledWith('Price points calculated', {
      route: 'LHR-JFK',
      pricePoints: [
        { discountRate: .2, cashDiscount: 20, aviosPoints: 667 },
        { discountRate: .5, cashDiscount: 50, aviosPoints: 1667 },
        { discountRate: .7, cashDiscount: 70, aviosPoints: 2334 },
        { discountRate: 1, cashDiscount: 100, aviosPoints: 3334 },
      ],
    });
  });
});
