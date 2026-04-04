export const TIMEOUT_CODE = `Tendermint 타임아웃 전략

기본 타임아웃 설정:
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
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: '기본 타임아웃' },
  { lines: [9, 11] as [number, number], color: 'amber' as const, note: '동적 증가 공식' },
];

export const PERF_TABLE = [
  { param: 'max_block_bytes', default_val: '22020096 (21MB)', effect: '블록 크기 ↑ → TPS ↑, 전파 시간 ↑' },
  { param: 'max_gas', default_val: '-1 (무제한)', effect: '가스 제한 → TX 수 상한 설정' },
  { param: 'timeout_propose', default_val: '3s', effect: '짧으면 빈 블록 ↑, 길면 지연 ↑' },
  { param: 'timeout_commit', default_val: '1s', effect: '블록 간격 하한 결정' },
  { param: 'max_txs_bytes', default_val: '1073741824 (1GB)', effect: '멤풀 최대 크기' },
  { param: 'recheck', default_val: 'true', effect: '블록 후 CheckTx 재검증' },
] as const;

export const PARALLEL_CODE = `병렬 처리 최적화

1. 블록 전파 (PartSet)
   블록 → 4KB 파트 분할 → 병렬 Gossip
   → 대형 블록도 리프 해시로 점진적 검증

2. 투표 Gossip
   VoteSet에서 비트마스크로 수신 여부 추적
   → 이미 수집한 투표는 재전파하지 않음

3. ABCI 동시 연결 (4개)
   Consensus | Mempool | Snapshot | Query
   → 합의 진행 중에도 CheckTx 병렬 실행`;

export const PARALLEL_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'PartSet 분할 전파' },
  { lines: [6, 7] as [number, number], color: 'emerald' as const, note: '비트마스크 추적' },
  { lines: [9, 11] as [number, number], color: 'amber' as const, note: '4개 ABCI 연결' },
];
