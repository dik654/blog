export const STAGES = [
  { label: 'LoadTipSet', sub: '부모 로드', color: '#6366f1' },
  { label: 'Lookback', sub: '과거 상태 조회', color: '#8b5cf6' },
  { label: 'CreateHeader', sub: 'BLS/Secpk 분류', color: '#3b82f6' },
  { label: 'signBlock', sub: '워커 키 서명', color: '#10b981' },
  { label: 'FullBlock', sub: '조립 완료', color: '#f59e0b' },
];

export const STEPS = [
  {
    label: '1. 부모 TipSet 로드',
    body: 'sm.ChainStore().LoadTipSet(ctx, bt.Parents)',
  },
  {
    label: '2. Lookback 상태에서 워커 주소 조회',
    body: 'GetLookbackTipSetForRound() — 과거 에폭의 상태 루트 획득',
  },
  {
    label: '3. CreateBlockHeader — 메시지 처리',
    body: 'BLS 메시지 → 서명을 BLSAggregate로 집계 (1개 집계 서명)',
  },
  {
    label: '4. signBlock — 워커 키로 서명',
    body: 'next.SigningBytes() → 서명 대상 바이트 직렬화',
  },
  {
    label: '5. FullBlock 조립 반환',
    body: '&types.FullBlock{ — Header: next,',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'lotus-mine',
  1: 'lotus-mine',
  2: 'lotus-mine',
  3: 'lotus-mine',
  4: 'lotus-mine',
};
