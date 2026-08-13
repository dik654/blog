export const DESIGN_CHOICES = [
  {
    id: "base",
    title: "protocol base fee",
    problem:
      "사용자마다 다음 block의 clearing price를 따로 추정하면 과다·과소 입찰이 생긴다.",
    solution:
      "부모 block의 gas usage로 다음 base fee를 결정하고 이 부분은 burn한다.",
    color: "#ef4444",
  },
  {
    id: "elastic",
    title: "elastic block space",
    problem:
      "짧은 수요 spike를 hard target 하나로 즉시 거부하면 inclusion이 불연속적으로 나빠진다.",
    solution:
      "chain parameters가 target과 maximum의 비율을 정하고 base fee가 target 복귀 신호를 만든다.",
    color: "#f59e0b",
  },
  {
    id: "integer",
    title: "consensus integer arithmetic",
    problem:
      "나눗셈 순서와 rounding이 client마다 다르면 같은 parent에서 다른 next base fee가 나온다.",
    solution:
      "widened·checked integer arithmetic과 EIP에 정해진 division order, increase minimum을 그대로 따른다.",
    color: "#10b981",
  },
] as const;

export const FEE_COMPONENTS = [
  {
    label: "base fee",
    desc: "protocol이 계산하고 burn하는 block-wide minimum",
    color: "#6366f1",
  },
  {
    label: "priority fee",
    desc: "fee cap 안에서 block beneficiary에 지급되는 tip",
    color: "#10b981",
  },
  {
    label: "max fee",
    desc: "sender가 gas 한 단위에 지불할 수 있는 cap",
    color: "#f59e0b",
  },
] as const;
