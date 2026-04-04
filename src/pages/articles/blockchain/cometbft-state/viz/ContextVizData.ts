export const C = { state: '#10b981', block: '#6366f1', evidence: '#f59e0b', db: '#8b5cf6', err: '#ef4444' };

export const STEPS = [
  {
    label: '왜 영구 상태가 필요한가',
    body: '합의 엔진이 "지금 어디까지 진행했는지" 영구 저장해야',
  },
  {
    label: '문제: 세 가지 저장 패턴',
    body: '블록 · 상태 · 증거를 각각 다른 패턴으로 저장하고 조회',
  },
  {
    label: 'State 구조체',
    body: 'LastBlockHeight, LastBlockID',
  },
  {
    label: 'BlockStore (LevelDB)',
    body: '블록 높이 → 파트 단위 저장 (큰 블록은 분할)',
  },
  {
    label: 'EvidencePool',
    body: '비잔틴 증거(이중 투표, 경량 클라이언트 공격) 수집',
  },
];
