export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'SRS — Universal Trusted Setup',
    body: 'tau 한 번 생성으로 모든 다항식에 재사용 가능한 universal setup',
  },
  {
    label: 'commit(f) = Sum f_i * [t^i]_1',
    body: '계수별 SRS 점 스칼라 곱 → G1 점 1개, 동형 속성 commit(f)+commit(g)=commit(f+g)',
  },
  {
    label: 'open — q(x) = (f(x)-y) / (x-z)',
    body: '몫 q=(f(x)-y)/(x-z)가 존재하면 f(z)=y — pi=commit(q)가 증명',
  },
  {
    label: 'verify — e(pi, [t]_2) == e(C - [y]_1 + z*pi, G_2)',
    body: '2-pairing으로 검증 — G2 scalar_mul 없이 e(pi,[t]_2) vs e(C-[y]_1+z*pi, G_2)',
  },
];

export const STEP_REFS = ['kzg-srs', 'kzg-commit', 'kzg-commit', 'kzg-commit'];
export const STEP_LABELS = ['kzg.rs — SRS struct', 'kzg.rs — commit()', 'kzg.rs — open()', 'kzg.rs — verify()'];
