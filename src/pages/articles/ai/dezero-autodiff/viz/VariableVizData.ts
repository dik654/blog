export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'VarInner — 실제 데이터를 담는 내부 구조체',
    body: 'data(텐서) + grad(Variable→고차미분) + creator(생성 함수 링크)',
  },
  {
    label: 'Rc<RefCell<VarInner>> — 공유 소유권 + 내부 가변성',
    body: 'Rc로 다대다 공유, RefCell로 런타임 가변성, Clone은 포인터 복사만',
  },
  {
    label: 'grad가 Variable인 이유 — 고차 미분',
    body: 'grad가 Variable이므로 creator 체인이 남아 grad.backward()로 고차 미분 가능',
  },
  {
    label: 'generation — 위상 정렬을 위한 세대 번호',
    body: '출력 gen = max(입력 gen)+1, backward에서 높은 순 처리로 위상 정렬',
  },
];

export const STEP_REFS = ['var-struct', 'var-struct', 'var-struct', 'var-struct'];
export const STEP_LABELS = ['lib.rs — VarInner struct', 'lib.rs — Rc<RefCell<>>', 'lib.rs — grad: Variable', 'lib.rs — generation'];
