export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Step 1: 데이터 추출 — borrow()로 ArrayD 꺼내기',
    body: '각 Variable에서 borrow()로 ArrayD<f64>만 추출',
  },
  {
    label: 'Step 2: forward 실행 — 순수 텐서 연산',
    body: 'Function trait의 forward만 호출하여 순수 텐서 연산 수행',
  },
  {
    label: 'Step 3: 그래프 기록 — ENABLE_BACKPROP 체크',
    body: 'ENABLE_BACKPROP=true일 때 inputs 저장 + generation 설정 + creator 연결',
  },
  {
    label: 'Step 4: outputs는 Weak로 — 순환 참조 차단',
    body: 'outputs만 Weak로 끊어 순환 참조 방지, Variable drop 시 자연 해제',
  },
];

export const STEP_REFS = ['func-call', 'func-call', 'func-call', 'func-call'];
export const STEP_LABELS = ['lib.rs — data.clone()', 'lib.rs — func.forward()', 'lib.rs — graph record', 'lib.rs — Weak outputs'];
