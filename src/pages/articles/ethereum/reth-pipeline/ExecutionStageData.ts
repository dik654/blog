export interface ExecutionInvariant {
  aspect: string;
  detail: string;
}
export const EXECUTION_INVARIANTS: readonly ExecutionInvariant[] = [
  {
    aspect: "canonical ordering",
    detail:
      "같은 block의 transaction은 이전 transaction 결과를 볼 수 있으므로 protocol order를 유지한다.",
  },
  {
    aspect: "fork-aware environment",
    detail:
      "ChainSpec과 block fields로 활성 EVM rules, withdrawals와 requests 처리를 결정한다.",
  },
  {
    aspect: "overlay isolation",
    detail:
      "미완료 batch의 state changes를 즉시 canonical state로 노출하지 않고 검증·commit 경계까지 격리한다.",
  },
  {
    aspect: "recoverable persistence",
    detail:
      "결과와 checkpoint를 일관된 경계에서 기록하고 unwind가 사용할 history를 storage policy 안에서 보존한다.",
  },
] as const;
