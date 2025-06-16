import type { FlightDetailsExpanded } from "../types";

const validate = (data: FlightDetailsExpanded): string[] => {
  const errors: string[] = [];

  if (!data.DepartureAirportCode) errors.push("Departure airport is required.");
  if (!data.ArrivalAirportCode) errors.push("Arrival airport is required.");
  if (data.DepartureAirportCode === data.ArrivalAirportCode) errors.push("Departure and arrival airports must differ.");

  const departure = new Date(`${data.DepartureOnlyDate}T${data.DepartureOnlyTime}`);
  const arrival = new Date(`${data.ArrivalOnlyDate}T${data.ArrivalOnlyTime}`);
  if (arrival <= departure) errors.push("Arrival must be after departure.");

  if (!data.Currency) errors.push("Currency is required.");
  if (data.Price <= 0) errors.push("Price must be greater than 0.");

  return errors;
};

export default validate;
