export const TIMEOUT_CODE = `CometBFT 타임아웃 전략

설명용 예시(배포 기본값이 아님):
  timeout_propose   = 3s    (블록 제안 대기)
  timeout_prevote   = 1s    (Prevote 수집 대기)
  timeout_precommit = 1s    (Precommit 수집 대기)
  timeout_commit    = 1s    (커밋 후 대기)

라운드별 증가 공식:
  timeout(round) = base + round * increment
  예: timeout_propose(R=2) = 3s + 2 * 500ms = 4s

목적: 네트워크 지연 시 점진적 대기 증가
  → 너무 짧으면: 불필요한 nil 투표 증가
  → 너무 길면: 블록 생성 지연`;

export const TIMEOUT_ANNOTATIONS = [
  {
    lines: [3, 7] as [number, number],
    color: "sky" as const,
    note: "설명용 예시값",
  },
  {
    lines: [9, 11] as [number, number],
    color: "amber" as const,
    note: "동적 증가 공식",
  },
];

export const PERF_TABLE = [
  {
    param: "max_block_bytes",
    default_val: "consensus params",
    effect: "허용 크기 ↑ → 수용량 여지 ↑, 전파·검증 시간 ↑",
  },
  {
    param: "max_gas",
    default_val: "application/consensus params",
    effect: "블록당 실행 작업의 상한 설정",
  },
  {
    param: "timeout_propose",
    default_val: "config.toml",
    effect: "짧으면 빈 블록 ↑, 길면 지연 ↑",
  },
  { param: "timeout_commit", default_val: "config.toml", effect: "다음 height 진입 대기" },
  {
    param: "max_txs_bytes",
    default_val: "mempool config",
    effect: "로컬 mempool byte budget",
  },
  { param: "recheck",
    default_val: "mempool mode·config",
    effect: "commit 후 남은 TX 재검증 정책" },
] as const;

export const PARALLEL_CODE = `병렬 처리 최적화

1. 블록 전파 (PartSet)
   블록 → 설정된 크기의 part로 분할 → 점진적 Gossip
   → 대형 블록도 리프 해시로 점진적 검증

2. 투표 Gossip
   VoteSet에서 비트마스크로 수신 여부 추적
   → 이미 수집한 투표는 재전파하지 않음

3. ABCI 책임 분리
   Consensus | Mempool | Snapshot | Query 경로
   → 긴 query가 consensus 호출을 막지 않도록 연결·queue를 분리`;

export const PARALLEL_ANNOTATIONS = [
  {
    lines: [3, 4] as [number, number],
    color: "sky" as const,
    note: "PartSet 분할 전파",
  },
  {
    lines: [6, 7] as [number, number],
    color: "emerald" as const,
    note: "비트마스크 추적",
  },
  {
    lines: [9, 11] as [number, number],
    color: "amber" as const,
    note: "4개 ABCI 연결",
  },
];
