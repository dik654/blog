export const C = { exec: '#6366f1', validate: '#f59e0b', abci: '#10b981', save: '#8b5cf6', event: '#0ea5e9', err: '#ef4444' };

export const STEPS = [
  {
    label: '왜 BlockExecutor가 필요한가',
    body: '합의가 완료된 블록을 실제로 적용해야 상태가 전진',
  },
  {
    label: '문제: 원자적 적용',
    body: 'ABCI 호출 + 상태 갱신 + DB 기록을',
  },
  {
    label: 'ApplyBlock 6단계 흐름',
    body: '① ValidateBlock — 헤더·커밋·증거 검증',
  },
  {
    label: 'ValidateBlock 상세',
    body: '헤더: ChainID, Height=LastBlockHeight+1, LastBlockID 일치',
  },
  {
    label: 'Commit 순서가 중요한 이유',
    body: 'Commit() → store.Save() 순서 필수',
  },
];
