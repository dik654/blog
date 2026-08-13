export interface DesignChoice {
  id: string;
  title: string;
  problem: string;
  solution: string;
  color: string;
}
export const DESIGN_CHOICES: readonly DesignChoice[] = [
  {
    id: "nonce",
    title: "Sender nonce dependency",
    problem:
      "미래 nonce는 단독으로 실행할 수 없지만 앞선 nonce가 도착하면 eligible해질 수 있다.",
    solution:
      "sender chain을 유지하고 canonical nonce와 gap 변화 때 descendants를 다시 분류한다.",
    color: "#ef4444",
  },
  {
    id: "fees",
    title: "Dynamic fee eligibility",
    problem: "fee cap이 현재 base fee를 감당하는지는 새 head마다 달라진다.",
    solution:
      "invalid로 폐기하는 조건과 일시적으로 non-executable한 조건을 구분해 repricing한다.",
    color: "#f59e0b",
  },
  {
    id: "resources",
    title: "Type-aware resource policy",
    problem:
      "blob transactions는 execution payload와 별도로 sidecar data와 blob-specific limits를 동반한다.",
    solution:
      "transaction type별 validation·replacement·retention policy를 적용하고 설정된 count/size limits를 enforce한다.",
    color: "#10b981",
  },
] as const;
