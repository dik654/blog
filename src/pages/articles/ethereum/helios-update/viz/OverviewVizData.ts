export const C = {
  opt: '#3b82f6',     // 파랑 — Optimistic (빠름, 위험)
  fin: '#10b981',     // 녹색 — Finality (느림, 확정)
  loop: '#6366f1',    // 인디고 — Update Loop 전체
  reth: '#ef4444',    // 빨강 — Reth 비교
  muted: '#94a3b8',   // 회색 — 보조 텍스트
};

export const STEPS = [
  {
    label: 'Update Loop — 부트스트랩 이후 즉시 시작되는 순환',
    body: '부트스트랩은 한 시점의 스냅샷이다. 체인은 매 12초 새 블록이 생긴다.\nHelios는 Beacon API에서 Update를 폴링해 Store를 계속 갱신한다.\n이 순환이 멈추면 Helios는 과거에 머문다.',
  },
  {
    label: 'OptimisticUpdate vs FinalityUpdate — 속도와 확정성의 트레이드오프',
    body: 'Optimistic: 매 12초, 빠르지만 reorg 가능. eth_getBlockByNumber("latest")에 사용.\nFinality: ~12.8분, 느리지만 되돌릴 수 없음(2/3 stake). eth_getBalance, eth_call에 사용.\n두 타입을 병행해서 빠른 추적 + 안전한 상태 증명을 동시에 달성.',
  },
  {
    label: '처리 파이프라인 — validate → apply → best_valid_update',
    body: '1) validate_update(): 슬롯 순서 검사 + BLS 서명 검증.\n2) apply_update(): Store에 헤더 반영 + 위원회 교체.\n3) best_valid_update: 같은 슬롯에 여러 update 도착 시 최선 선택.\n검증 없이 적용하면 악의적 헤더를 수용할 수 있다.',
  },
];
