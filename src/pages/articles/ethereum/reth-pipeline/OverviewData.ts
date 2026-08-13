export interface PipelineStageCard {
  id: string;
  label: string;
  role: string;
  detail: string;
  why: string;
  color: string;
}

export const PIPELINE_STAGES: readonly PipelineStageCard[] = [
  {
    id: "headers",
    label: "Headers",
    role: "canonical header range",
    detail: "피어에서 헤더 후보를 가져와 chain rules로 검증한다.",
    why: "뒤 단계가 신뢰할 parent·fork context와 body commitments를 만든다.",
    color: "#6366f1",
  },
  {
    id: "bodies",
    label: "Bodies",
    role: "transactions and withdrawals",
    detail: "헤더가 약속한 body를 받아 commitments를 다시 계산한다.",
    why: "네트워크 입력을 그대로 신뢰하지 않고 transactions·ommers·withdrawals의 일관성을 먼저 확인한다.",
    color: "#0ea5e9",
  },
  {
    id: "senders",
    label: "Senders",
    role: "signature recovery",
    detail:
      "각 signed transaction의 signing payload와 signature에서 sender를 복구한다.",
    why: "독립적인 복구 작업을 batch로 처리하되 결과 순서를 transaction numbering과 맞춘다.",
    color: "#10b981",
  },
  {
    id: "execution",
    label: "Execution",
    role: "fork-aware EVM",
    detail:
      "canonical block과 sender, 이전 state view를 사용해 순서대로 실행한다.",
    why: "receipts·requests·state changes를 만들고 consensus commitments 검증에 필요한 결과를 제공한다.",
    color: "#f59e0b",
  },
  {
    id: "merkle",
    label: "Merkle",
    role: "state-root verification",
    detail: "변경 경로와 기존 trie artifacts로 새 state root를 계산한다.",
    why: "계산한 root가 header commitment와 같아야 실행 결과를 canonical state로 채택할 수 있다.",
    color: "#ec4899",
  },
] as const;
