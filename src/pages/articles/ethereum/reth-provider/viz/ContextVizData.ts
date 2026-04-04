export const C = { provider: '#6366f1', err: '#ef4444', ok: '#10b981', mem: '#f59e0b', db: '#8b5cf6', file: '#6b7280' };

export const STEPS = [
  {
    label: '모든 모듈이 상태에 접근해야 함',
    body: 'EVM 실행, RPC 쿼리, 동기화 등 모든 모듈이 블록체인 상태에 접근해야 합니다.',
  },
  {
    label: '문제: 시점별 상태가 다름',
    body: '최신(메모리), 과거(디스크), 고대(아카이브) 상태의 접근 패턴이 전부 다릅니다.',
  },
  {
    label: '문제: 통합 인터페이스 필요',
    body: 'Geth의 statedb는 구체 구현에 결합되어 테스트 시 Mock 주입이 어렵습니다.',
  },
  {
    label: '해결: StateProvider trait',
    body: 'account(), storage(), bytecode_by_hash() 3개 메서드로 모든 상태 접근을 추상화합니다.',
  },
  {
    label: '해결: 계층적 조회',
    body: 'BundleState(메모리) → MDBX(디스크) → StaticFiles(고대) 순으로 폴백 조회합니다.',
  },
];
