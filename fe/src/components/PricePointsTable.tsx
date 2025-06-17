import './PricePointsTable.css';
import type { PricePoint } from "../types";

const PricePointsTable = ({ pricePoints, currency }: { pricePoints: PricePoint[], currency: string }) => {
  if (pricePoints.length == 0) return (
    <table className="price-points-table">
      <tbody>
        <tr><td>No data selected.</td></tr>
      </tbody>
    </table>
  );

  return (
    <table className="price-points-table">
      <thead>
        <tr>
          <th>Discount %</th>
          <th>Cash Discount</th>
          <th>Avios</th>
        </tr>
      </thead>
      <tbody>
        {pricePoints.map(({ discountRate, cashDiscount, aviosPoints }, i) => (
          <tr key={i}>
            <td>{Math.round(discountRate * 100)}%</td>
            <td>
              {new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cashDiscount)}
            </td>
            <td>{aviosPoints.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PricePointsTable;
