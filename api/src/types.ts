export interface FlightDetails {
  DepartureAirportCode: string;
  ArrivalAirportCode: string;
  DepartureTime: string;
  ArrivalTime: string;
  Price: number;
  Currency: string;
}

export interface PricePoint {
  cashDiscount: number;
  aviosPoints: number;
}

export interface PricePointsResponse {
  success: boolean;
  error?: string;
  pricePoints?: PricePoint[];
}

export interface ServerError extends Error {
  statusCode?: number;
}
