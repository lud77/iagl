import { render, screen } from '@testing-library/react';
import PricePointsTable from './PricePointsTable';
import { describe, it, expect } from 'vitest';

const sampleData = [
  { discountRate: 0.1, cashDiscount: 50, aviosPoints: 12000 },
  { discountRate: 0.2, cashDiscount: 100, aviosPoints: 20000 },
];

describe('PricePointsTable', () => {
  it('should show "No data selected" when pricePoints is empty', () => {
    render(<PricePointsTable pricePoints={[]} currency="USD" />);
    expect(screen.getByText(/No data selected/i)).not.toBeNull();
  });

  it('should render table headers correctly', () => {
    render(<PricePointsTable pricePoints={sampleData} currency="GBP" />);
    expect(screen.getByText(/Discount %/i)).not.toBeNull();
    expect(screen.getByText(/Cash Discount/i)).not.toBeNull();
    expect(screen.getByText(/Avios/i)).not.toBeNull();
  });

  it('should render each price point row with correct data', () => {
    render(<PricePointsTable pricePoints={sampleData} currency="EUR" />);

    expect(screen.getByText('10%')).not.toBeNull();
    expect(screen.getByText('20%')).not.toBeNull();

    expect(screen.getByText(/€50/)).not.toBeNull(); // cash amounts
    expect(screen.getByText(/€100/)).not.toBeNull();

    expect(screen.getByText('12,000')).not.toBeNull(); // point cost
    expect(screen.getByText('20,000')).not.toBeNull();
  });
});
