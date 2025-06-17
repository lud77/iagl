import PricePointsTable from './components/PricePointsTable';
import './App.css';
import type { APIResponse, FlightDetails, FlightDetailsExpanded, PricePoint } from './types';
import FlightDetailsForm from './components/FlightDetailsForm';
import { useMemo, useState } from 'react';
import { splitDateAndTime, joinDateAndTime } from './utils/DateAndTime';

const API_URL = "http://localhost:5000/api/v1/price-points";

const App = () => {
  const [ pricePoints, setPricePoints ] = useState<PricePoint[]>([]);

  const [currentDate, currentTime] = useMemo(() => {
    const now = new Date().toISOString();
    return splitDateAndTime(now);
  }, []);

  const [ flightDetails, setFlightDetails ] = useState<FlightDetailsExpanded>({
    DepartureAirportCode: '',
    ArrivalAirportCode: '',
    DepartureOnlyDate: currentDate,
    DepartureOnlyTime: currentTime,
    ArrivalOnlyDate: currentDate,
    ArrivalOnlyTime: currentTime,
    Price: 0,
    Currency: '',
  });

  const buildFlightDetailsForRequest = (data: FlightDetailsExpanded): FlightDetails => {
    return {
      DepartureAirportCode: data.DepartureAirportCode,
      ArrivalAirportCode: data.ArrivalAirportCode,
      DepartureTime: joinDateAndTime(data.DepartureOnlyDate, data.DepartureOnlyTime),
      ArrivalTime: joinDateAndTime(data.ArrivalOnlyDate, data.ArrivalOnlyTime),
      Price: data.Price,
      Currency: data.Currency,
    };
  };

  const handleSubmit = async (data: FlightDetailsExpanded) => {
    try {
      const flightDetailsForRequest: FlightDetails = buildFlightDetailsForRequest(data);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flightDetailsForRequest),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result: APIResponse = await response.json();

      if (!result.success) {
        alert(result.error || 'Unknown Error');
      }

      setPricePoints(result.pricePoints!);
    } catch (err) {
      console.log('Error while fetching price points', err);
      setPricePoints([]);
    }
  };

  return (
    <>
      <h1>Avios Cost Calculator</h1>
      <div className="container">
        <div className="flight-details-form-wrapper">
          <FlightDetailsForm
            flightDetails={flightDetails}
            setFlightDetails={setFlightDetails}
            onSubmit={handleSubmit} />
        </div>
        <div className="price-points-table-wrapper">
          <PricePointsTable pricePoints={pricePoints} currency={flightDetails.Currency} />
        </div>
      </div>
    </>
  )
}

export default App;
