export const C = {
  vrf: '#6366f1',
  thresh: '#f59e0b',
  poisson: '#10b981',
  block: '#8b5cf6',
  err: '#ef4444',
};

export const STEPS = [
  {
    label: 'Beacon → VRF 시드 추출',
    body: 'DrawRandomnessFromBase로 에폭마다 고유 vrfBase 생성 (마이너 주소+에폭 높이 바인딩)',
  },
  {
    label: 'VRF 증명 생성 & 검증',
    body: 'VerifyElectionPoStVRF로 BLS 비밀키 VRF 해시 생성 → 공개키로 검증 가능한 의사 난수',
  },
  {
    label: 'Poisson WinCount 계산',
    body: 'ComputeWinCount: λ=5×(minerPower/totalPower), 포아송 CDF로 당선 횟수 결정 (WinCount≥1이면 블록 생성)',
  },
  {
    label: '블록 제출 & WinCount 대조',
    body: '헤더 WinCount와 재계산 값 불일치 시 즉시 거부 → 조작 불가능한 리더 선출',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'ec-winner', 1: 'ec-winner', 2: 'ec-winner', 3: 'ec-winner',
};
