export const C = {
  trait: '#6366f1', latest: '#10b981', mdbx: '#f59e0b', static: '#6b7280',
};

export const STEPS = [
  {
    label: 'StateProvider trait 3개 메서드',
    body: 'account(), storage(), bytecode_by_hash() 3개 메서드로 모든 상태 접근을 추상화합니다.',
  },
  {
    label: 'LatestStateProviderRef 구현',
    body: 'MDBX 읽기 tx + StaticFile 조합으로 PlainAccountState 테이블에서 계정을 조회합니다.',
  },
  {
    label: 'MockProvider 주입 가능',
    body: 'trait 추상화로 테스트 시 실제 DB 없이 MockProvider를 주입할 수 있습니다.',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'provider-trait', 1: 'provider-trait', 2: 'provider-trait',
};
