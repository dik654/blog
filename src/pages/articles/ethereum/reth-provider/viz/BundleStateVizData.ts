export const C = {
  state: '#10b981', reverts: '#ef4444', contracts: '#f59e0b',
  account: '#6366f1',
};

export const STEPS = [
  {
    label: 'BundleState 핵심 3개 필드',
    body: 'state(계정 변경 HashMap), reverts(블록별 되돌리기), contracts(바이트코드) 3필드입니다.',
  },
  {
    label: 'BundleAccount 상세',
    body: 'info/original_info로 변경 전후를 기록하고 변경된 슬롯만 보관하여 메모리 효율적입니다.',
  },
  {
    label: 'from_revm() → into_plain_state()',
    body: 'from_revm()으로 revm 결과를 변환 후 into_plain_state()로 DB 기록 순서에 맞게 정렬합니다.',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'bundle-state', 1: 'bundle-state', 2: 'bundle-state',
};
