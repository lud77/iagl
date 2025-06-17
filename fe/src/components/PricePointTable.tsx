import type { PricePoint } from "../types";

const PricePointsTable = ({ pricePoints, currency }: { pricePoints: PricePoint[], currency: string }) => {
  if (pricePoints.length == 0) return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
      <tbody>
        <tr><td>No data selected.</td></tr>
      </tbody>
    </table>
  );

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Discount %</th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Cash Discount</th>
          <th style={{ textAlign: "left", borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Avios</th>
        </tr>
      </thead>
      <tbody>
        {pricePoints.map(({ discountRate, cashDiscount, aviosPoints }) => (
          <tr key={discountRate}>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>{Math.round(discountRate * 100)}%</td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
              {new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cashDiscount)}
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>{aviosPoints.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PricePointsTable;
