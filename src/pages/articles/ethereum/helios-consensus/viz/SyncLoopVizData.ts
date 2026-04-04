/** SyncLoop Viz — 색상 상수 + step 정의 */

export const C = {
  store: '#6366f1',    // Store 모듈 (인디고)
  opt: '#3b82f6',      // OptimisticUpdate (블루)
  fin: '#10b981',      // FinalityUpdate (에메랄드)
  lcu: '#f59e0b',      // LightClientUpdates (앰버)
  err: '#ef4444',      // 에러/경고 (레드)
  recover: '#8b5cf6',  // 복구 (보라)
};

export const STEPS = [
  {
    label: 'Sync Loop 전체 구조 — 12초 주기 폴링-검증-적용 순환',
    body: 'Store를 중심으로 Beacon API 폴링 → Update 수신 → validate 검증 → apply 적용이 반복된다.\n한 번의 루프가 12초(1 슬롯). 검증 실패 시 해당 Update만 건너뛰고 루프는 계속된다.',
  },
  {
    label: '3가지 API 엔드포인트 — 빈도가 다른 이유',
    body: 'OptimisticUpdate: 매 12초, 최신 헤더 (reorg 가능).\nFinalityUpdate: ~6.4분, finalized 헤더 (되돌릴 수 없음).\nLightClientUpdates: ~27시간, 새 위원회 포함.\n한 API로 통합하면 불필요한 데이터 전송 — 경량 클라이언트 취지에 반함.',
  },
  {
    label: 'Finality 추적 — finalized_header가 전진하는 과정',
    body: 'FinalityUpdate 수신마다 슬롯 비교: 새 slot > 현재 slot이면 교체.\nfinalized는 항상 전진만 함 (후퇴 불가 — Casper FFG 보장).\n각 교체마다 state_root 갱신 → 이후 상태 증명의 기준이 된다.',
  },
  {
    label: '에러 복구 — 4가지 시나리오별 대응',
    body: 'BLS 실패: 해당 Update 건너뜀, 루프 계속.\n네트워크 단절: 기존 Store 유지, 오래되지만 안전.\nperiod 경계 미스: 서명 검증 불가 → 마지막 체크포인트로 warm start.\n장시간 오프라인: WS 만료 → 새 체크포인트로 cold start.',
  },
];
