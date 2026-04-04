export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Step 1: 출력의 grad를 1.0으로 초기화',
    body: 'dy/dy=1로 초기화하여 연쇄 법칙의 시작점 설정',
  },
  {
    label: 'Step 2: generation으로 정렬 (높은 순 pop)',
    body: 'generation 높은 순으로 pop하여 위상 정렬 효과 달성',
  },
  {
    label: 'Step 3: 각 함수의 backward 호출',
    body: 'outputs의 grad를 수집하여 func.backward() 호출, create_graph로 2차 미분 제어',
  },
  {
    label: 'Step 4: 그래디언트 누적 — 같은 변수 여러 번 사용',
    body: '같은 변수가 여러 번 사용되면 &prev+&gx로 기울기를 누적 합산',
  },
];

export const STEP_REFS = ['backward', 'backward', 'backward', 'backward'];
export const STEP_LABELS = ['lib.rs — grad 초기화', 'lib.rs — generation sort', 'lib.rs — func.backward()', 'lib.rs — grad 누적'];
