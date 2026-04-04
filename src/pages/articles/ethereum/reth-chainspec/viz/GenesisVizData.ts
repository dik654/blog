export const C = {
  spec: '#6366f1', genesis: '#10b981', header: '#f59e0b',
  hash: '#8b5cf6',
};

export const STEPS = [
  {
    label: 'MAINNET — LazyLock으로 한 번만 초기화',
    body: 'include_str!("mainnet.json") — 컴파일 타임 임베딩\nserde_json::from_str() 로 Genesis 파싱\n💡 런타임 파일 I/O 없이 바이너리에 포함',
  },
  {
    label: 'make_genesis_header — 조건부 필드',
    body: 'London 활성 → base_fee_per_gas = INITIAL_BASE_FEE\nShanghai 활성 → withdrawals_root = empty\nCancun 활성 → blob_gas_used, excess_blob_gas\n하드포크별 조건 분기로 제네시스 헤더 구성',
  },
  {
    label: 'state_root 계산 → alloc 기반',
    body: 'state_root_ref_unhashed(&genesis.alloc)\nalloc의 모든 계정 잔액으로 MPT 구성\n잘못된 alloc → 다른 state_root → 피어 연결 불가',
  },
  {
    label: 'SealedHeader::new(header, GENESIS_HASH)',
    body: '미리 알려진 제네시스 해시로 검증\nMAINNET_GENESIS_HASH 상수와 비교\n💡 OnceLock 캐싱 — 한 번 계산 후 재사용',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'mainnet-spec', 1: 'make-genesis', 2: 'make-genesis',
  3: 'mainnet-spec',
};
