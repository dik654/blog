export const TIP_CASES = [
  {
    type: "fee cap에 여유가 있음",
    expression: "min(priority_cap, fee_cap − base_fee)",
    result: "priority cap까지 tip으로 낼 수 있다.",
    color: "#10b981",
  },
  {
    type: "fee cap 여유가 작음",
    expression: "fee_cap − base_fee < priority_cap",
    result: "남은 fee-cap 여유만 effective tip이 된다.",
    color: "#f59e0b",
  },
  {
    type: "base fee가 fee cap을 넘음",
    expression: "fee_cap < base_fee",
    result: "이 base fee 문맥에서는 executable priority를 만들 수 없다.",
    color: "#ef4444",
  },
  {
    type: "legacy transaction",
    expression: "gas_price − base_fee",
    result: "London 이후 block에서는 gas price가 base fee를 충족해야 한다.",
    color: "#6366f1",
  },
] as const;

export const ORDERING_BOUNDARIES = [
  "effective tip은 후보 priority의 한 입력이지 transaction dependency 전체를 대체하지 않는다.",
  "sender nonce chain에서 앞선 transaction이 빠지면 뒤 transaction은 tip이 높아도 포함할 수 없다.",
  "gas limit, blob gas, invalidation과 block constraints를 적용한 뒤 실제 beneficiary value를 비교한다.",
  "private bundles와 builder bids는 public txpool의 per-gas tip ordering과 다른 경로를 사용할 수 있다.",
] as const;
