export const CALC_STEPS = [
  {
    condition: "gas_used == gas_target",
    formula: "next = parent_base_fee",
    detail: "편차가 없으므로 parent 값을 그대로 반환한다.",
    color: "#6366f1",
  },
  {
    condition: "gas_used > gas_target",
    formula: "increase = parent × excess ÷ target ÷ denominator",
    detail:
      "EIP의 integer division 순서를 지키고 increase가 0으로 절단되면 1 wei를 사용한다.",
    color: "#ef4444",
  },
  {
    condition: "gas_used < gas_target",
    formula: "decrease = parent × deficit ÷ target ÷ denominator",
    detail:
      "감소분에는 최소 1 규칙이 없으며 결과 conversion·subtraction은 overflow semantics를 명시해야 한다.",
    color: "#10b981",
  },
] as const;

export const ARITHMETIC_RULES = [
  {
    question: "왜 widened integer가 필요한가?",
    answer:
      "parent base fee와 gas delta는 각각 좁은 타입에 들어가도 곱은 그 범위를 넘을 수 있다. 계산 중간값을 넓히고 최종 narrowing을 명시적으로 검사한다.",
  },
  {
    question: "계산 순서를 바꿔도 되는가?",
    answer:
      "안 된다. 정수 나눗셈은 결합법칙이 성립하지 않으므로 곱셈·나눗셈 순서가 바뀌면 rounding 결과가 달라질 수 있다.",
  },
  {
    question: "가득 찬 block이면 언제 12.5%인가?",
    answer:
      "mainnet London parameters에서 gas used가 maximum이고 parent base fee가 division에 정확히 맞을 때의 상한 관계다. 작은 값에서는 integer rounding을 함께 봐야 한다.",
  },
] as const;
