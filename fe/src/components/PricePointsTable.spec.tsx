import { render, screen } from '@testing-library/react';
import PricePointsTable from './PricePointsTable';
import { describe, it, expect } from 'vitest';

const sampleData = [
  { discountRate: 0.1, cashDiscount: 50, aviosPoints: 12000 },
  { discountRate: 0.2, cashDiscount: 100, aviosPoints: 20000 },
];

describe('PricePointsTable', () => {
  it('shows "No data selected" when pricePoints is empty', () => {
    render(<PricePointsTable pricePoints={[]} currency="USD" />);
    expect(screen.getByText(/No data selected/i)).not.toBeNull();
  });

  it('renders table headers correctly', () => {
    render(<PricePointsTable pricePoints={sampleData} currency="USD" />);
    expect(screen.getByText(/Discount %/i)).not.toBeNull();
    expect(screen.getByText(/Cash Discount/i)).not.toBeNull();
    expect(screen.getByText(/Avios/i)).not.toBeNull();
  });

  it('renders each price point row with correct data', () => {
    render(<PricePointsTable pricePoints={sampleData} currency="USD" />);

    // 10% and 20% should appear
    expect(screen.getByText('10%')).not.toBeNull();
    expect(screen.getByText('20%')).not.toBeNull();

    // Cash amounts formatted as currency

    expect(screen.getByText(/\$50/)).not.toBeNull();
    expect(screen.getByText(/\$100/)).not.toBeNull();

    // Avios
    expect(screen.getByText('12,000')).not.toBeNull();
    expect(screen.getByText('20,000')).not.toBeNull();
  });
});
