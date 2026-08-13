export interface ExExConcept {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}

export const EXEX_CONCEPTS: readonly ExExConcept[] = [
  {
    id: "notification",
    label: "Notification",
    role: "canonical delta",
    details:
      "Committed는 새 chain, Reverted는 제거할 old chain, Reorged는 old와 new를 함께 전달한다.",
    why: "block number 하나보다 rollback과 apply의 방향을 명시적으로 보존한다.",
    color: "#6366f1",
  },
  {
    id: "manager",
    label: "Manager + WAL",
    role: "delivery·replay·capacity",
    details:
      "알림을 WAL과 내부 buffer에 보존하고 각 ExEx가 받을 준비가 됐을 때 순서대로 전달한다.",
    why: "in-process라고 해서 delivery와 recovery가 자동으로 무손실이 되는 것은 아니다.",
    color: "#0ea5e9",
  },
  {
    id: "context",
    label: "ExExContext",
    role: "typed node access",
    details:
      "notification stream, event sender와 full-node components에 대한 typed access를 제공한다.",
    why: "확장이 쓰는 권한과 의존성이 생성자 경계에 드러난다.",
    color: "#10b981",
  },
  {
    id: "finished-height",
    label: "FinishedHeight",
    role: "checkpoint·pruning gate",
    details:
      "처리 완료한 block num/hash를 보고하며 이후에는 그보다 큰 높이의 알림을 받는다.",
    why: "가장 느린 ExEx의 진행 상태가 안전한 replay와 prune 경계를 결정한다.",
    color: "#f59e0b",
  },
] as const;
