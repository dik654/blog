export const C = {
  expired: '#ef4444', network: '#f59e0b', branch: '#6366f1',
};

export const STEPS = [
  {
    label: '에러 1: 체크포인트 만료 (Weak Subjectivity)',
    body: '체크포인트 슬롯이 현재 슬롯 − 54,000보다 이전.\n검증자 집합이 바뀌었을 수 있어 거부한다.',
  },
  {
    label: '에러 2: 네트워크 불일치',
    body: 'mainnet 체크포인트를 sepolia에서 사용하면 실패.\nfork_version이 달라 도메인 계산이 일치하지 않는다.',
  },
  {
    label: '에러 3: Merkle 브랜치 무효',
    body: 'committee_branch가 state_root와 불일치.\nRPC가 위변조된 committee를 제공한 경우.',
  },
];
