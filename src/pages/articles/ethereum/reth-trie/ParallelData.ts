export const PARALLEL_STRATEGY = [
  {
    title: "Account별 storage work item",
    desc: "서로 다른 account의 storage trie는 별도 root를 가지므로 같은 base checkpoint에서 독립 계산할 수 있다.",
    color: "#8b5cf6",
  },
  {
    title: "Bounded worker execution",
    desc: "구현은 work size와 resource limits에 맞춰 worker 수와 parallel threshold를 선택해야 한다.",
    color: "#6366f1",
  },
  {
    title: "Deterministic account merge",
    desc: "storage root 결과를 원래 account key와 결합하고 account trie의 공통 paths는 결정적인 order로 처리한다.",
    color: "#10b981",
  },
] as const;
export const PARALLEL_BENEFIT = {
  opportunity:
    "서로 다른 account storage roots는 직접적인 state dependency가 없다.",
  constraint:
    "shared cache, storage readers, skewed work size와 scheduling overhead가 실제 처리량을 제한한다.",
  invariant:
    "순차·병렬 어느 경로든 동일한 storage roots와 최종 state_root를 반환해야 한다.",
} as const;
