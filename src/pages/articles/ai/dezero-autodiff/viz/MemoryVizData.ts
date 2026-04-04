export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Rc 참조 카운팅 — Variable의 수명 관리',
    body: 'clone()은 포인터 복사만, strong_count=0이면 자동 해제',
  },
  {
    label: 'Weak<RefCell<VarInner>> — 순환 참조 차단',
    body: 'outputs만 Weak로 저장하여 Variable↔FuncState 순환 참조 차단',
  },
  {
    label: 'no_grad() — RAII 가드로 그래프 비활성화',
    body: 'RAII guard로 ENABLE_BACKPROP=false, 스코프 끝에서 Drop이 자동 복원',
  },
  {
    label: 'thread_local! — 전역 상태를 스레드 안전하게',
    body: 'thread_local + Cell<bool>로 스레드별 독립 상태, borrow 충돌 없음',
  },
];

export const STEP_REFS = ['var-struct', 'function-trait', 'no-grad', 'no-grad'];
export const STEP_LABELS = ['lib.rs — Rc<RefCell<>>', 'lib.rs — Weak outputs', 'lib.rs — no_grad guard', 'lib.rs — thread_local'];
