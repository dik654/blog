/** 동일 기간·단일 상품·동일 가격·가정 수요의 계산입니다. 관측 자료가 아닙니다. */
export function sale(quantity: number, marginalCost = 7, intercept = 13, slope = 1) {
  const price = intercept - slope * quantity;
  return { quantity, price, revenue: price * quantity, cost: marginalCost * quantity,
    profit: (price - marginalCost) * quantity, marginalRevenue: intercept - 2 * slope * quantity };
}
export function optimum(marginalCost = 7, intercept = 13, slope = 1, capacity = intercept / slope) {
  const quantity = Math.min(capacity, Math.max(0, (intercept - marginalCost) / (2 * slope)));
  const result = sale(quantity, marginalCost, intercept, slope);
  return { ...result, marginalCost, elasticity: quantity > 0 ? -result.price / (slope * quantity) : null,
    markup: result.price > 0 ? (result.price - marginalCost) / result.price : null };
}
export function welfare(quantity: number) {
  const s = sale(quantity), consumer = quantity * (13 - s.price) / 2;
  const producer = s.profit, total = consumer + producer;
  return { ...s, consumer, producer, total, lost: 18 - total };
}
