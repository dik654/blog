export const C = { drand: '#6366f1', irys: '#10b981', eth: '#f59e0b' };

export const STEPS = [
  {
    label: 'DRAND: VDF로 미래 예측 불가 보장',
    body: '분산 랜덤 비콘이 VDF를 적용 — → 서명이 완성되어도 VDF 지연 시간만큼 결과 공개 지연',
  },
  {
    label: 'Irys: VDF를 PoW 대체로 사용',
    body: 'Irys(구 Arweave 기반)는 VDF로 시간 기반 합의',
  },
  {
    label: 'Ethereum: RANDAO 강화 (연구 중)',
    body: '현재 RANDAO: 검증자 제출 값의 XOR 결합',
  },
];
