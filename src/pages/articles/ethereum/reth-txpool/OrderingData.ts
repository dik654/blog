export interface OrderingDetail {
  name: string;
  key: string;
  detail: string;
  color: string;
}
export const ORDERING_IMPLS: readonly OrderingDetail[] = [
  {
    name: "Effective-tip policy",
    key: "tip(base_fee)",
    detail:
      "현재 base fee에서 proposer가 받을 수 있는 per-gas tip을 priority input으로 사용한다. 동률 처리와 age policy는 별도 규칙일 수 있다.",
    color: "#10b981",
  },
  {
    name: "Custom transaction policy",
    key: "PriorityValue",
    detail:
      "허용된 extension point 안에서 chain- or application-specific priority를 계산할 수 있지만 nonce와 protocol validity는 그대로 지켜야 한다.",
    color: "#f59e0b",
  },
  {
    name: "Bundle-aware builder policy",
    key: "simulation result",
    detail:
      "Atomic bundle revenue와 conflicts는 단일 transaction priority 이상의 모델이 필요하며 external builder layer가 simulation·selection을 책임진다.",
    color: "#6366f1",
  },
] as const;
