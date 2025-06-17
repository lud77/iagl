import { render, screen, fireEvent } from '@testing-library/react';
import FlightDetailsForm from './FlightDetailsForm';
import { describe, it, beforeEach, expect, vi } from 'vitest';

const mockSetFlightDetails = vi.fn();
const mockOnSubmit = vi.fn();
const validFlightDetails = {
  DepartureAirportCode: 'JFK',
  ArrivalAirportCode: 'LHR',
  DepartureOnlyDate: '2025-06-20',
  DepartureOnlyTime: '12:00',
  ArrivalOnlyDate: '2025-06-21',
  ArrivalOnlyTime: '06:00',
  Price: 500,
  Currency: 'USD',
};

vi.mock('../validators/flightData', () => ({
  default: () => [], // return no validation errors
}));

describe('FlightDetailsForm', () => {
  beforeEach(() => {
    render(
      <FlightDetailsForm
        flightDetails={validFlightDetails}
        setFlightDetails={mockSetFlightDetails}
        onSubmit={mockOnSubmit}
      />
    );
  });

  it('should render all form fields', () => {
    expect(screen.getByLabelText(/Departure Airport/i)).not.toBeNull();
    expect(screen.getByLabelText(/Arrival Airport/i)).not.toBeNull();
    expect(screen.getByLabelText(/Departure Date/i)).not.toBeNull();
    expect(screen.getByLabelText(/Arrival Date/i)).not.toBeNull();
    expect(screen.getByLabelText(/Price/i)).not.toBeNull();
  });

  it('should call onSubmit with valid data', () => {
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith(validFlightDetails);
  });

  it('should update form fields on change', () => {
    const priceInput = screen.getByLabelText(/Price/i);
    fireEvent.change(priceInput, { target: { value: '123.45' } });
    expect(mockSetFlightDetails).toHaveBeenCalled();
  });
});
