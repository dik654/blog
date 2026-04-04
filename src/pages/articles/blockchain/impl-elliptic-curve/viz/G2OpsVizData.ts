export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Sextic Twist — E(Fp12) → E(Fp2)로 차원 축소',
    body: "sextic twist로 G2를 Fp12에서 Fp2로 차원 축소 — 약 36배 빠른 연산",
  },
  {
    label: "트위스트 파라미터: b' = 3/(9+u)",
    body: "twist 곡선 y²=x³+b'에서 b'=3/(9+u), ξ=9+u는 non-residue 상수",
  },
  {
    label: 'G2::double/add — G1과 동일한 공식',
    body: 'G1과 동일한 Jacobian 공식, 타입만 Fp→Fp2로 — G1 대비 약 3배 느림',
  },
  {
    label: 'G2 생성자 — 표준화된 256비트 상수',
    body: 'G2 생성자는 4개의 256비트 상수 — go-ethereum, gnark 등에서 동일한 값 사용',
  },
];

export const STEP_REFS = ['g2-struct', 'g2-struct', 'g2-double', 'g2-struct'];
export const STEP_LABELS = ['g2.rs — sextic twist', "g2.rs — twist b'", 'g2.rs — double/add', 'g2.rs — generator'];
