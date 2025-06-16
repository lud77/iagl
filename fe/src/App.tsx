import PricePointsTable from './components/PricePointTable';
import './App.css'
import type { FlightDetailsExpanded, PricePoint } from './types';
import FlightDetailsForm from './components/FlightDetailsForm';
import { useState } from 'react';

const App = () => {
  const pricePoints: PricePoint[] = [{ discountRate: .2, cashDiscount: 10, aviosPoints: 20 }];
  const [ flightDetails, setFlightDetails ] = useState<FlightDetailsExpanded>({
    DepartureAirportCode: '',
    ArrivalAirportCode: '',
    DepartureTime: '',
    DepartureOnlyDate: '',
    DepartureOnlyTime: '',
    ArrivalTime: '',
    ArrivalOnlyDate: '',
    ArrivalOnlyTime: '',
    Price: 0,
    Currency: '',
  });

  return (
    <>
      <h1>Avios Cost Calculator</h1>
      <div className="container">
        <div className="flight-details-form-wrapper">
          <FlightDetailsForm
            flightDetails={flightDetails!}
            setFlightDetails={setFlightDetails}
            onSubmit={(flightData: FlightDetailsExpanded): void => {
              console.log('Flight Data', flightData);
            }
          } />
        </div>
        <div className="price-points-table-wrapper">
          <PricePointsTable pricePoints={pricePoints} currency={'FRA'} />
        </div>
      </div>
    </>
  )
}

export default App;
