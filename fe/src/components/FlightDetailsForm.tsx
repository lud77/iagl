import './FlightDetailsForm.css';
import type { FlightDetailsExpanded } from '../types';
import { airportCodes } from '../airportCodes';
import validate from "../validators/flightData";

type Props = {
  flightDetails: FlightDetailsExpanded;
  setFlightDetails: React.Dispatch<React.SetStateAction<FlightDetailsExpanded>>;
  onSubmit: (data: FlightDetailsExpanded) => void;
};

const FlightDetailsForm = ({ flightDetails, setFlightDetails, onSubmit }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlightDetails((prev) => ({
      ...prev,
      [name]: name === 'Price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(flightDetails);
    if (errors.length > 0) {
      alert(errors.join("\n"));  // Replace with nicer UI later
      return;
    }
    onSubmit(flightDetails);
  };

  return (
    <form className="flight-details-form" onSubmit={handleSubmit}>
      <label>
        Departure Airport:
        <select name="DepartureAirportCode" value={flightDetails.DepartureAirportCode} onChange={handleChange} required>
          <option value="" disabled>Select departure</option>
          {airportCodes.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </label>

      <label>
        Arrival Airport:
        <select name="ArrivalAirportCode" value={flightDetails.ArrivalAirportCode} onChange={handleChange} required>
          <option value="" disabled>Select arrival</option>
          {airportCodes.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </label>

      <label>
        Departure Date:
        <input
          type="date"
          name="DepartureOnlyDate"
          value={flightDetails.DepartureOnlyDate}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Departure Time:
        <input
          type="time"
          name="DepartureOnlyTime"
          value={flightDetails.DepartureOnlyTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Arrival Date:
        <input
          type="date"
          name="ArrivalOnlyDate"
          value={flightDetails.ArrivalOnlyDate}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Arrival Time:
        <input
          type="time"
          name="ArrivalOnlyTime"
          value={flightDetails.ArrivalOnlyTime}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Price:
        <input type="number" step="0.01" name="Price" value={flightDetails.Price} onChange={handleChange} required />
      </label>

      <label>
        Currency:
        <select name="Currency" value={flightDetails.Currency} onChange={handleChange} required>
          <option value=""></option>
          <option value="GBP">GBP</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </label>

      <button type="submit">Calculate</button>
    </form>
  );
};

export default FlightDetailsForm;
