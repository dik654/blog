export const servicesCode = `// 합의 계층 핵심 서비스 7종
// 1. 합의 서비스: CometBFT BFT 합의
//    - 즉시 완결성 (블록 커밋 = 최종 확정)
//    - 1/3 미만 비잔틴 허용

// 2. 비콘 서비스: VRF 기반 랜덤성 & 에포크 관리

// 3. 스테이킹 서비스: PoS 보증금 & 보상 분배
//    - 최소 보증금: 100 ROSE
//    - 슬래싱: 이중 서명 시 보증금 몰수

// 4. 레지스트리 서비스: 노드 & 런타임 등록 관리
// 5. 스케줄러 서비스: 위원회 구성 & 역할 배정
// 6. 거버넌스 서비스: 업그레이드 & 파라미터 변경
// 7. 루트해시 서비스: ParaTime 상태 커밋 & 검증`;

export const servicesAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'CometBFT 합의' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: '경제 시스템' },
  { lines: [13, 17] as [number, number], color: 'amber' as const, note: '네트워크 & 상태 관리' },
];
