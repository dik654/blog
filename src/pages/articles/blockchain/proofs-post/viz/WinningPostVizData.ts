export const C = {
  vrf: '#6366f1', sector: '#10b981', proof: '#f59e0b', block: '#ec4899',
};

export const STEPS = [
  {
    label: 'DRAND VRF → 블록 생산자 추첨',
    body: '매 에폭(30초)마다 DRAND 비콘에서 VRF 출력',
  },
  {
    label: '소수 섹터 + 소수 리프 증명',
    body: '당첨 SP: 지정 섹터 1개에서 소수 리프 머클 증명',
  },
  {
    label: '블록 생성 & 보상',
    body: '30초 에폭 내 증명 완료 필수 — 성공 시 블록 보상 수령',
  },
];
