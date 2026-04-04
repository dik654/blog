export const C = {
  store: '#6366f1', update: '#10b981', api: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Store 초기화 완료 → Update 요청 시작',
    body: 'Store가 준비되면 Beacon API에 finality_update를 요청한다.\n이것이 Helios의 첫 번째 동기화 단계.',
  },
  {
    label: '첫 Update 적용',
    body: 'finality_update는 최신 finalized_header를 포함한다.\n검증 통과 시 store.finalized_header를 갱신.',
  },
];
