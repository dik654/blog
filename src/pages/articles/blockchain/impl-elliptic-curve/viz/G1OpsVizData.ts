export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'double — 접선 기울기로 2P 계산',
    body: 'Jacobian 더블링은 곱셈만으로 수행 — A=Y², B=4XA, C=8A², D=3X²',
  },
  {
    label: 'add — 두 점 P+Q의 할선',
    body: 'Z 보정 후 H=U₂-U₁, R=S₂-S₁으로 합 계산 — 같은 점이면 double 분기',
  },
  {
    label: 'scalar_mul — double-and-add (256비트)',
    body: 'LSB부터 비트 스캔 — 256 double + ~128 add로 스칼라 곱 완성',
  },
  {
    label: 'to_affine — 최종 역원 1회',
    body: 'Z.inv() 1회로 x=X·z_inv², y=Y·z_inv³ 계산 — Jacobian의 존재 이유',
  },
];

export const STEP_REFS = ['g1-double', 'g1-add', 'g1-scalar-mul', 'g1-scalar-mul'];
export const STEP_LABELS = ['g1.rs — double()', 'g1.rs — add()', 'g1.rs — scalar_mul()', 'g1.rs — to_affine()'];
