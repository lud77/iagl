export interface FlightDetailsExpanded {
  DepartureAirportCode: string;
  ArrivalAirportCode: string;
  DepartureTime: string;
  DepartureOnlyDate: string;
  DepartureOnlyTime: string;
  ArrivalTime: string;
  ArrivalOnlyDate: string;
  ArrivalOnlyTime: string;
  Price: number;
  Currency: string;
}

export interface PricePoint {
  discountRate: number;
  cashDiscount: number;
  aviosPoints: number;
}
