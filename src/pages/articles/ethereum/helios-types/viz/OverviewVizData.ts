/** OverviewViz — 색상 상수 + step 정의 */

export const C = {
  cl: '#6366f1',        // CL 합의 레이어 (인디고)
  el: '#f59e0b',        // EL 실행 레이어 (앰버)
  verify: '#10b981',    // 검증 (에메랄드)
  bridge: '#06b6d4',    // 연결 (시안)
};

export const STEPS = [
  {
    label: 'CL 타입 vs EL 타입 — 인코딩과 목적이 다르다',
    body: 'CL(합의 레이어): SSZ 인코딩, slot 기반, BeaconBlockHeader 5필드(112B).\nEL(실행 레이어): RLP 인코딩, block number 기반, Header 15필드.\nHelios는 CL 타입을 직접 다루고, EL 타입은 alloy가 처리한다.',
  },
  {
    label: 'Helios 데이터 흐름 — CL에서 받고, 검증하고, EL에 접근한다',
    body: 'CL 타입(header, committee)으로 체인 상태를 추적.\nstate_root를 기준으로 Merkle 증명을 검증.\nEL 타입(account, storage)은 검증된 root 아래에서 읽는다.',
  },
];
