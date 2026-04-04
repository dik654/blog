export const C = { mask: '#6366f1', challenge: '#f59e0b', sign: '#10b981', reject: '#ef4444' };

export const STEPS = [
  {
    label: "y = SampleMask(gamma1 = 2^17) — 마스킹 벡터",
    body: '큰 범위의 랜덤 벡터 y를 생성합니다.\ny가 s1 정보를 숨기는 "마스크" 역할을 합니다.',
  },
  {
    label: "w = A*y, w1 = HighBits(w, 2*gamma2)",
    body: 'A*y를 계산하고 상위 비트만 추출합니다.\nw1은 검증자가 복원해야 하는 "공개 부분"입니다.',
  },
  {
    label: "c = SampleInBall(H(mu||w1), tau=39) — 도전 생성",
    body: '메시지 해시와 w1로 도전 다항식 c를 생성합니다.\n256개 계수 중 정확히 39개만 +1 또는 -1, 나머지는 0입니다.',
  },
  {
    label: "z = y + c*s1 — 서명 벡터 계산",
    body: '마스킹 벡터 y에 c*s1을 더해 서명 벡터 z를 생성합니다.\ny가 충분히 크면 z에서 s1 정보가 드러나지 않습니다.',
  },
  {
    label: "if ||z||inf >= gamma1 - beta: RESTART",
    body: 'z의 최대 절대값이 한계를 넘으면 재시작합니다.\n이 "거부 샘플링"이 s1 정보 누출을 방지합니다. 평균 4-7회 반복.',
  },
];
