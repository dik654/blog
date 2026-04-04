export const CHECKS = [
  { label: 'Sanity', sub: 'nil 체크', color: '#6366f1' },
  { label: 'Height', sub: '부모보다 높은지', color: '#8b5cf6' },
  { label: 'Timestamp', sub: '미래 블록 거부', color: '#3b82f6' },
  { label: 'Weight', sub: '부모 가중치 일치', color: '#10b981' },
  { label: 'VRF', sub: '선출 증명 검증', color: '#f59e0b' },
  { label: 'WinPoSt', sub: '저장 증명 검증', color: '#ef4444' },
];

export const STEPS = [
  {
    label: '1. blockSanityChecks()',
    body: 'ElectionProof, Ticket, BlockSig, BLSAggregate가 nil이 아닌지 확인',
  },
  {
    label: '2. 높이 + 타임스탬프 검증',
    body: 'h.Height > baseTs.Height() — 부모보다 반드시 높아야 함',
  },
  {
    label: '3. 부모 가중치 일치 검증',
    body: 'store.Weight(ctx, baseTs) 계산 결과와',
  },
  {
    label: '4. VRF 선출 증명 검증',
    body: 'DrawRandomnessFromBase()로 VRF 입력 생성',
  },
  {
    label: '5. WinningPoSt 증명 검증',
    body: 'GetSectorsForWinningPoSt()로 챌린지 섹터 선정',
  },
  {
    label: '6. 비동기 병렬 실행',
    body: 'async.Err()로 6개 검증을 goroutine으로 병렬 수행',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'lotus-filecoin-ec',
  1: 'lotus-filecoin-ec',
  2: 'lotus-weight',
  3: 'lotus-filecoin-ec',
  4: 'lotus-filecoin-ec',
  5: 'lotus-filecoin-ec',
};
