export const EVIDENCE_CODE = `비잔틴 장애 탐지 → 슬래싱 흐름

1. 이중 서명 탐지 (Double Voting)
   ┌──────────────────────────────────────┐
   │ 같은 Height/Round에서 다른 블록에 투표 │
   │ → ErrVoteConflictingVotes 발생       │
   │ → DuplicateVoteEvidence 생성         │
   └──────────────────────────────────────┘

2. 증거 수집 & 검증
   ┌──────────────────────────────────────┐
   │ EvidencePool에 증거 저장              │
   │ MaxAge 이내의 증거만 유효             │
   │ 투표 서명 + 밸리데이터 주소 검증       │
   └──────────────────────────────────────┘

3. 블록에 포함 & 슬래싱
   ┌──────────────────────────────────────┐
   │ 제안자가 블록 Evidence 필드에 포함     │
   │ FinalizeBlock → Misbehavior[] 전달   │
   │ 앱이 슬래싱/Jailing 로직 실행          │
   └──────────────────────────────────────┘

핵심 파라미터:
  MaxEvidenceAge     = 100000 블록 (~2일)
  MaxBytes           = 1MB (블록당 최대 증거 크기)
  EvidencePool 크기  = 제한 없음 (만료 시 자동 정리)`;

export const EVIDENCE_ANNOTATIONS = [
  { lines: [3, 7] as [number, number], color: 'rose' as const, note: 'Double Voting 탐지' },
  { lines: [9, 13] as [number, number], color: 'sky' as const, note: '증거 풀 관리' },
  { lines: [15, 19] as [number, number], color: 'amber' as const, note: '슬래싱 실행' },
];

export const BFT_THRESHOLD_CODE = `BFT 안전성 임계값 분석

전체 밸리데이터 파워: N
비잔틴 밸리데이터:    f

안전성 조건: f < N/3
  → 2/3+ 정직 노드가 동일 블록에 투표해야 커밋
  → 1/3 이상 비잔틴이면 네트워크 정지 (Safety 우선)

예시 (N=100):
  정직:  67+ → 블록 커밋 가능
  비잔틴: 33  → 커밋 차단 가능 (Liveness 실패)
  비잔틴: 34+ → Safety 위반 가능 (이중 커밋)

이더리움 비교:
  CometBFT: Safety 우선 (포크 불가, 정지 가능)
  Casper:   Liveness 우선 (포크 가능, 정지 불가)`;

export const BFT_THRESHOLD_ANNOTATIONS = [
  { lines: [5, 6] as [number, number], color: 'emerald' as const, note: '핵심 안전성 조건' },
  { lines: [8, 11] as [number, number], color: 'amber' as const, note: '임계값 시나리오' },
];
