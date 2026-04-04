export const STEPS = [
  {
    label: '1. 부모 가중치 누적',
    body: 'out = ts.ParentWeight().Int',
  },
  {
    label: '2. 총 파워 조회',
    body: 'PowerActor에서 QualityAdjPower 로드',
  },
  {
    label: '3. log2P 계산',
    body: 'log2P = tpow.BitLen() - 1',
  },
  {
    label: '4. WinCount 보너스',
    body: 'totalJ = Σ(블록들의 WinCount)',
  },
];

export const FORMULA_PARTS = [
  { text: 'W(ts)', color: '#6366f1', desc: '최종 가중치' },
  { text: 'parentWeight', color: '#8b5cf6', desc: '부모 누적' },
  { text: 'log₂(totalPower)', color: '#10b981', desc: '파워 기여' },
  { text: 'winBonus', color: '#f59e0b', desc: 'WinCount 보상' },
];

export const STEP_REFS: Record<number, string> = {
  0: 'lotus-weight',
  1: 'lotus-weight',
  2: 'lotus-weight',
  3: 'lotus-weight',
};
