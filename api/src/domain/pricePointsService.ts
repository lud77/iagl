import { FlightDetails, PricePoint } from "../types";

const DISCOUNT_RATES = [.2, .5, .7, 1];

export default (logger: any, rates: Record<string, number>) => {
  const getRateByRoute = (route: string): number => {
    if (rates[route] != null) return rates[route];
    return rates['-'];
  };

  // Compute amount of Avios for discount amount
  // e.g. £20 : X Avios = £0.02 : 1 Avios
  // => X Avios = 1 Avios * (£20 / £0.02)
  // => X Avios = cashDiscount / Rate
  const cashToAvios = (cashAmount: number, aviosRate: number): number => Math.ceil(cashAmount / aviosRate);

  const calculatePricePoints = (flightData: FlightDetails): PricePoint[] => {
    const {
      DepartureAirportCode: depCode,
      ArrivalAirportCode: arrCode,
      Price: price
    } = flightData;

    const route = `${depCode}-${arrCode}`;
    const rate = getRateByRoute(route);

    logger.info('Calculating price points', { route, price, rate });

    const pricePoints = DISCOUNT_RATES.map((discountRate) => {
      const cashDiscount = Math.round(price * discountRate * 100) / 100; // Amount of discount rounded to 2 decimals

      const aviosPoints = cashToAvios(cashDiscount, rate);

      return { cashDiscount, aviosPoints };
    })

    logger.debug('Price points calculated', { route, pricePoints });

    return pricePoints;
  };

  return {
    getRateByRoute,
    cashToAvios,
    calculatePricePoints
  };
};

