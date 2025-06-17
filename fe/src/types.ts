export interface FlightDetails {
  DepartureAirportCode: string;
  ArrivalAirportCode: string;
  DepartureTime: string;
  ArrivalTime: string;
  Price: number;
  Currency: string;
}
export interface FlightDetailsExpanded {
  DepartureAirportCode: string;
  ArrivalAirportCode: string;
  DepartureOnlyDate: string;
  DepartureOnlyTime: string;
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
