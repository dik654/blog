export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'BN254: y² = x³ + 3 — 왜 이 곡선인가?',
    body: 'a=0, b=3으로 더블링 공식 단순화, 생성자 G=(1,2)가 순환군 형성',
  },
  {
    label: 'Affine (x, y) vs Jacobian (X, Y, Z)',
    body: 'Jacobian (X/Z², Y/Z³)은 역원 없이 곱셈만으로 연산, 최종 출력 시 inv() 1회',
  },
  {
    label: 'G1Affine + G1 — 이중 표현 구조',
    body: 'G1Affine는 저장/직렬화용, G1(Jacobian)은 내부 연산 전용 — 변환은 Z 설정/나누기',
  },
  {
    label: 'is_on_curve — 곡선 위 검증',
    body: 'Affine은 y²==x³+3 직접 비교, Jacobian은 Z⁶ 보정 — 무한원점은 항상 true',
  },
];

export const STEP_REFS = ['g1-struct', 'g1-struct', 'g1-struct', 'g1-struct'];
export const STEP_LABELS = ['g1.rs — BN254 곡선', 'g1.rs — Affine vs Jacobian', 'g1.rs — 이중 표현', 'g1.rs — is_on_curve'];
