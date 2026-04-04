export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Fp vs Fr — 두 필드의 역할 차이',
    body: 'Fp는 좌표 표현(base field), Fr는 스칼라/witness 값(scalar field) — 같은 구조, 다른 모듈러스',
  },
  {
    label: 'define_prime_field! — 매크로로 코드 재사용',
    body: 'Fr은 매크로 한 줄로 생성 — 상수만 넣으면 add/sub/mul/inv 자동 (fr.rs 40줄)',
  },
  {
    label: 'R1CS/QAP에서의 Fr 역할',
    body: 'R1CS 벡터 s와 증명 생성/검증의 모든 다항식 연산이 Fr 위에서 수행',
  },
];

export const STEP_REFS = ['fr-struct', 'fr-macro', 'fr-struct'];
export const STEP_LABELS = ['fr.rs — Fp vs Fr', 'mod.rs — define_prime_field!', 'fr.rs — R1CS 활용'];
