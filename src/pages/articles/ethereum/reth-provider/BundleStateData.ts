export const BUNDLE_ROLES = [
  {
    name: "changed accounts",
    desc: "실행 중 만난 account의 original·present info와 상태 전이를 누적한다.",
    color: "#10b981",
  },
  {
    name: "changed storage",
    desc: "접근한 slot의 previous·present value를 account별로 보관해 후속 transaction과 revert가 사용한다.",
    color: "#0ea5e9",
  },
  {
    name: "new bytecode",
    desc: "실행에서 생성된 code를 hash로 참조해 overlay lookup에 제공한다.",
    color: "#f59e0b",
  },
  {
    name: "revert information",
    desc: "block boundary별 이전 값을 남겨 unwind·reorg에서 역방향으로 적용할 수 있게 한다.",
    color: "#ef4444",
  },
] as const;
