export const C = { propose: '#8b5cf6', ok: '#10b981', err: '#ef4444', mev: '#f59e0b', sign: '#0ea5e9' };

export const STEPS = [
  {
    label: '매 슬롯 한 명이 블록 제안',
    body: '매 슬롯마다 한 명의 검증자가 블록을 제안해야 체인이 진행됩니다.',
  },
  {
    label: '문제: 최적 어테스테이션 선택',
    body: '어테스테이션 최적 선택과 RANDAO reveal 서명을 12초 안에 완료해야 합니다.',
  },
  {
    label: '문제: MEV-Boost 선택',
    body: '외부 빌더 블록과 로컬 블록 중 수익이 높은 쪽을 선택하는 로직이 필요합니다.',
  },
  {
    label: '해결: RANDAO 셔플 공정 추첨',
    body: '유효 잔액 비례 RANDAO 기반 추첨으로 다음 제안자를 조작 불가능하게 합니다.',
  },
  {
    label: '해결: 패킹 → 서명 → 전파',
    body: '어테스테이션 패킹(최대 128개) → RANDAO 서명 → BeaconBlock 조립 → gossipsub 전파합니다.',
  },
];
