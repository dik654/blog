export const nodeTypesCode = `// Oasis 노드 유형
// 1. 밸리데이터 노드 (Validator)
//    - 합의 계층 참여, 블록 제안 & 투표
//    - 스테이킹 보증금 필요

// 2. 컴퓨트 노드 (Compute Worker)
//    - ParaTime 트랜잭션 실행
//    - 기밀 런타임은 SGX/TDX 필수

// 3. 키 매니저 노드 (Key Manager)
//    - 기밀 런타임의 암호화 키 관리
//    - SGX 엔클레이브 내 실행

// 4. 클라이언트 노드 (Client / Seed)
//    - 상태 조회, 트랜잭션 제출
//    - P2P 네트워크 연결 지원`;

export const nodeTypesAnnotations = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: '밸리데이터: 합의 참여' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: '컴퓨트 워커: TX 실행' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: '키 매니저: 키 관리' },
  { lines: [15, 17] as [number, number], color: 'violet' as const, note: '클라이언트: 조회/제출' },
];
