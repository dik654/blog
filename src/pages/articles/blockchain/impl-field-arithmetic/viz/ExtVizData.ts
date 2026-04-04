export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Fp2 = Fp[u] / (u^2 + 1) — 복소수와 동일한 구조',
    body: 'a0 + a1*u 형태, u^2 = -1로 복소수와 동일 구조 — G2 좌표 표현용',
  },
  {
    label: 'Fp2 Karatsuba 곱셈 — 4회 곱셈을 3회로',
    body: 'Karatsuba 트릭으로 4회 Fp 곱셈을 3회로 줄임 — 교차항을 한 번에 계산',
  },
  {
    label: 'Fp6 = Fp2[v] / (v^3 - beta) — 3차원 확장',
    body: '3개 Fp2 성분, Karatsuba 패턴을 3차원으로 확장 → Fp2 곱셈 6회',
  },
  {
    label: 'Fp12 = Fp6[w] / (w^2 - v) — 타워 최상층',
    body: '2개 Fp6 성분에 Karatsuba 적용 — 페어링 결과가 이 Fp12 원소',
  },
  {
    label: '역원의 연쇄 위임 — 차원을 한 단계씩 내림',
    body: 'Fp12 → Fp6 → Fp2 → Fp 순으로 norm을 내려 최종 Fermat 역원 계산',
  },
];

export const STEP_REFS = ['fp2-struct', 'fp2-struct', 'fp6-struct', 'fp12-struct', 'fp2-struct'];
export const STEP_LABELS = ['fp2.rs — Fp2 구조', 'fp2.rs — Karatsuba', 'fp6.rs — Fp6 확장', 'fp12.rs — Fp12 타워', 'fp2.rs — 역원 위임'];
