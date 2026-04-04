export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'R1CS vs PLONKish — 게이트 표현 방식의 차이',
    body: 'PLONKish는 selector 계수로 게이트 유형을 결정하는 범용 산술화 방식',
  },
  {
    label: 'PlonkGate — 5개 selector로 다양한 게이트 표현',
    body: 'Add(a+b=c), Mul(a*b=c), Bool(a*(1-a)=0), Dummy(패딩) — 5개 selector 조합',
  },
  {
    label: 'Domain — n차 단위근의 평가 도메인',
    body: 'n차 단위근 H={1,w,...,w^(n-1)}, 코셋 K1*H, K2*H — n은 2의 거듭제곱',
  },
  {
    label: 'PlonkConstraintSystem — 변수+게이트+copy+lookup',
    body: 'alloc → add_gate → copy_constraint → pad 순서로 회로 빌드',
  },
];

export const STEP_REFS = ['plonk-gate', 'plonk-gate', 'plonk-domain', 'plonk-cs'];
export const STEP_LABELS = ['arithmetization.rs — R1CS vs PLONKish', 'arithmetization.rs — PlonkGate 타입', 'mod.rs — Domain 구조', 'arithmetization.rs — ConstraintSystem'];
