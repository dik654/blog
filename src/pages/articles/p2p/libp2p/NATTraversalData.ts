export const autonatCode = `// AutoNAT: NAT 타입 자동 탐지
//
// 1. 피어 A가 원격 피어 B에게 다이얼-백 요청
//    A → B: "내 주소 /ip4/1.2.3.4/tcp/4001 로 접속해봐"
//
// 2. B가 A에게 다이얼 시도 → 결과 보고
//    B → A: "성공" → A는 Public (직접 접근 가능)
//    B → A: "실패" → A는 Private (NAT 뒤)
//
// 3. 여러 피어에게 반복하여 일관된 결과 확인
//    NatStatus::Public(addr) | NatStatus::Private | NatStatus::Unknown
//
// 4. Private이면 Relay 등록 → Hole Punching 준비
//    autonat::Event::StatusChanged { old, new }`;

export const autonatAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '다이얼-백 요청' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '결과 판정 (Public/Private)' },
  { lines: [12, 13] as [number, number], color: 'amber' as const, note: 'Private → Relay 등록' },
];

export const relayCode = `// Circuit Relay v2
//
// NAT 뒤 피어 A, B가 Relay 서버 R을 경유:
//   A ─── R ─── B
//   /p2p-circuit/p2p/12D3KooWB
//
// Relay 제한 (v2):
//   - 최대 128 동시 예약
//   - 예약당 최대 120초 TTL
//   - 대역폭 제한: 128 KiB/s
//   - 데이터 전송 제한: 16 KiB/패킷
//
// A → R: Reserve (예약 요청)
// R → A: Reservation(Ok) + 릴레이 주소 발급
// B → R → A: 중계 연결 수립`;

export const relayAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'Circuit Relay 토폴로지' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: 'v2 리소스 제한' },
  { lines: [13, 15] as [number, number], color: 'amber' as const, note: 'Reserve → 연결 흐름' },
];

export const dcutrCode = `// DCUtR: Direct Connection Upgrade through Relay
//
// 전제: A, B 모두 Relay R에 연결된 상태
//
// 1. A → B (via R): Connect { addrs: [A의 관찰 외부 주소] }
// 2. B → A (via R): Connect { addrs: [B의 관찰 외부 주소] }
//
// 3. 동시 Dial (Simultaneous Open):
//    A → B: dial(B의 외부 주소)   ┐ 동시 실행
//    B → A: dial(A의 외부 주소)   ┘
//    → NAT 테이블에 아웃바운드 매핑 생성
//    → 상대 패킷이 이 매핑을 통해 인바운드 통과
//
// 4. 직접 연결 성공 → Relay 연결 종료
//    지연: ~100ms (Relay) → <10ms (Direct)`;

export const dcutrAnnotations = [
  { lines: [5, 6] as [number, number], color: 'sky' as const, note: '주소 교환 (via Relay)' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: 'Simultaneous Open' },
  { lines: [14, 15] as [number, number], color: 'amber' as const, note: '직접 연결 업그레이드' },
];
