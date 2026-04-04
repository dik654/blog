export const C = {
  problem: '#ef4444', helios: '#6366f1', oram: '#10b981', dandelion: '#f59e0b',
};

export const STEPS = [
  {
    label: '문제: RPC 서버에 프라이버시 노출',
    body: 'MetaMask → Infura/Alchemy 요청 시 IP, 조회 주소, TX 전부 노출.\nRPC 서버가 사용자 활동을 완전히 프로파일링할 수 있다.',
  },
  {
    label: 'Helios — 응답 검증 (위변조 차단)',
    body: 'Sync Committee BLS 서명으로 블록 헤더 검증.\nMerkle-Patricia 증명으로 상태 응답 검증. RPC 신뢰 불필요.',
  },
  {
    label: 'ORAM — 쿼리 프라이버시 (조회 패턴 은닉)',
    body: '실제 쿼리 1개 + 더미 K개를 배치 전송.\n서버 시점: K+1개 중 진짜 구별 불가. Pr(식별) = 1/(K+1).',
  },
  {
    label: 'Dandelion++ — TX 프라이버시 (발신자 익명화)',
    body: 'Stem: 단일 피어로 3~5홉 전달. Fluff: 전체 가십 전환.\n관찰자가 TX 발신 노드를 특정할 수 없다.',
  },
];
