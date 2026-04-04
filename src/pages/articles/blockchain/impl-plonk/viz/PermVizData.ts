export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Copy Constraint — 와이어 간 변수 공유',
    body: '같은 변수를 다른 게이트 위치에서 사용할 때 copy constraint로 동치 강제',
  },
  {
    label: 'Union-Find → Cycle 구성',
    body: 'Union-Find로 equivalence class 구성 → class 내 position을 순환 연결',
  },
  {
    label: 'Sigma 다항식 — position tag 인코딩',
    body: 'position을 코셋 태그로 인코딩 — copy 없으면 identity 순열',
  },
  {
    label: 'Grand Product Z(x) — telescope to 1',
    body: 'Z(w^0)=1에서 시작, copy 만족 시 num=den으로 Z(w^n)=1로 돌아옴',
  },
];

export const STEP_REFS = ['perm-poly', 'perm-poly', 'perm-poly', 'perm-grand'];
export const STEP_LABELS = ['permutation.rs — copy constraint', 'permutation.rs — Union-Find', 'permutation.rs — sigma polynomial', 'permutation.rs — grand product Z'];
