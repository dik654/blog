export interface SyncMode {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}

export const SYNC_MODES: SyncMode[] = [
  {
    id: "pipeline",
    label: "Staged Pipeline",
    role: "큰 역사 범위를 단계별 처리",
    details:
      "Headers, Bodies, Sender Recovery, Execution, hashing, Merkle, history index 등 현재 DefaultStages를 순서대로 실행한다. " +
      "각 stage는 checkpoint와 unwind 경계를 가진다.",
    why: "긴 범위는 block 하나씩 tree에 넣는 것보다 같은 종류의 작업을 batch로 처리하는 편이 효율적이다.",
    color: "#6366f1",
  },
  {
    id: "backfill",
    label: "Backfill Sync",
    role: "큰 실행 gap에 Pipeline 위임",
    details:
      "Engine tree가 로컬 head와 목표 사이의 큰 gap을 발견하면 PipelineSync를 시작한다. " +
      "완료될 때까지 backfill이 canonical 전진을 맡고, 끝나면 live 경로로 소유권을 돌려준다.",
    why: "Backfill은 별도 데이터 포맷이 아니라 긴 범위를 처리하는 orchestration mode다.",
    color: "#0ea5e9",
  },
  {
    id: "live",
    label: "Live Sync",
    role: "실시간 블록 추적",
    details:
      "Head 근처에서는 Engine API 요청과 on-demand parent download로 새 block을 검증·실행한다. " +
      "forkchoiceUpdated가 canonical/safe/finalized 경계를 갱신하고 persistence가 이를 디스크에 반영한다.",
    why: "작은 gap과 reorg는 tree 형태로 처리하고, 범위가 커질 때만 backfill pipeline으로 전환한다.",
    color: "#10b981",
  },
];

export interface SyncComparison {
  aspect: string;
  pipeline: string;
  backfill: string;
  live: string;
}

export const SYNC_COMPARISONS: SyncComparison[] = [
  {
    aspect: "역할",
    pipeline: "Stage별 range 처리",
    backfill: "Pipeline 실행 조정",
    live: "Head·짧은 gap 처리",
  },
  {
    aspect: "입력",
    pipeline: "ERA1 또는 P2P blocks",
    backfill: "Engine이 정한 target",
    live: "Engine API·P2P parent",
  },
  {
    aspect: "상태 전진",
    pipeline: "Stage checkpoint",
    backfill: "Pipeline 소유권",
    live: "Engine tree + persistence",
  },
  {
    aspect: "오류 복구",
    pipeline: "Stage unwind",
    backfill: "target 재설정·재실행",
    live: "reorg·invalid branch 제거",
  },
];
