export const C = { seed: '#6366f1', matrix: '#f59e0b', secret: '#10b981', pk: '#8b5cf6' };

export const STEPS = [
  {
    label: "seed = random(32B), rho = seed[0:32]",
    body: '32바이트 랜덤 시드를 생성합니다.\nrho는 행렬 A를 결정론적으로 생성하기 위한 시드입니다.',
  },
  {
    label: 'A = ExpandA(rho) — SHAKE-128 → 4x4 다항식 행렬',
    body: 'SHAKE-128 XOF로 rho를 확장하여 4x4 다항식 행렬 A를 생성합니다.\n각 다항식은 256개 계수, 각 계수는 q=8,380,417 미만입니다.',
  },
  {
    label: 's1, s2 = SampleShort(eta=2) — 짧은 비밀 벡터',
    body: '비밀 벡터 s1, s2의 계수를 {-2,-1,0,1,2} 범위에서 샘플링합니다.\n이 "짧은" 벡터가 Module-LWE 문제의 비밀 정보입니다.',
  },
  {
    label: 't = NTT(A) * NTT(s1) + s2 — 공개키 계산',
    body: 'NTT 도메인에서 행렬-벡터 곱을 수행하고 s2를 더해 공개키 t를 생성합니다.\nt는 4개 다항식(각 256 계수)으로, s1을 아는 사람만 서명할 수 있습니다.',
  },
];
