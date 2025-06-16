import type { PricePoint } from "../types";

const PricePointItem = ({ cashDiscount, aviosPoints }: PricePoint) => {
  return (
    <div>
      <span>Discount: {cashDiscount}</span>
      <span>Avios: {aviosPoints}</span>
    </div>
  );
};

export default PricePointItem;
