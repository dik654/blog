export const C = { pc1: '#6366f1', pc2: '#f59e0b', commit: '#10b981', err: '#ef4444', chain: '#8b5cf6' };

export const STEPS = [
  {
    label: '왜 봉인(Seal)이 필요한가?',
    body: 'SP가 "32GiB를 저장했다"고 주장',
  },
  {
    label: 'PC1: SDR 그래프 (순차 계산)',
    body: '11층 DRG+Expander 그래프',
  },
  {
    label: 'PC2: 칼럼 해시 + TreeR',
    body: '11개 레이어의 같은 위치를 세로로 묶어',
  },
  {
    label: 'C1/C2: Groth16 SNARK 증명',
    body: 'C1: InteractiveSeed로 랜덤 챌린지 위치 선택',
  },
  {
    label: '전체 타임라인',
    body: 'PC1: ~3시간 (CPU 순차, 병렬화 불가)',
  },
];
