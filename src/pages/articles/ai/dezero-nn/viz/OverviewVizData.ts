export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: 'Model trait — 신경망의 공통 인터페이스',
    body: 'forward()+layers()만 구현하면 cleargrads/params/save가 자동 제공',
  },
  {
    label: 'Linear — 전결합 레이어 캡슐화',
    body: 'Linear으로 W, b를 캡슐화하여 params() 자동 순회',
  },
  {
    label: 'Lazy Init — 왜 W를 Option으로?',
    body: '첫 forward 시 x.shape()로 in_size를 결정하여 W를 초기화',
  },
  {
    label: 'Optimizer → Model 연결',
    body: 'SGD.setup(&model)로 연결, update()가 params() 순회하며 갱신',
  },
];

export const STEP_REFS = ['model-trait', 'linear-struct', 'linear-struct', 'sgd'];
export const STEP_LABELS = ['lib.rs — Model trait', 'lib.rs — Linear struct', 'lib.rs — lazy init', 'lib.rs — SGD::setup()'];
