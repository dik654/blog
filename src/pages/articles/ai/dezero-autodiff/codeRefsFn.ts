import type { CodeRef } from '@/components/code/types';

export const fnCodeRefs: Record<string, CodeRef> = {
  'function-trait': {
    path: 'src/lib.rs — Function trait & FuncState',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'Function trait: 모든 연산의 인터페이스.\nFuncState: 입력 캡처 + 출력은 Weak로 순환 참조 방지.',
    code: `pub trait Function {
    fn forward(&self, xs: &[ArrayD<f64>]) -> Vec<ArrayD<f64>>;
    fn backward(&self, xs: &[Variable], gys: &[Variable]) -> Vec<Variable>;
    fn name(&self) -> &str { "Function" }
}

struct FuncState {
    func: Box<dyn Function>,    // 실제 연산 (AddFn, MulFn 등)
    generation: u32,            // 입력 중 최대 세대
    inputs: Vec<Variable>,      // Rc로 강한 참조 — 역전파 시 접근 필요
    outputs: Vec<Weak<RefCell<VarInner>>>, // Weak로 약한 참조
}

type FuncStateRef = Rc<RefCell<FuncState>>;

pub struct Func {
    state: FuncStateRef,
}

impl Func {
    pub fn new(func: impl Function + 'static) -> Self {
        Func {
            state: Rc::new(RefCell::new(FuncState {
                func: Box::new(func),
                generation: 0,
                inputs: Vec::new(),
                outputs: Vec::new(),
            })),
        }
    }
}`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'Function trait — forward(순전파)와 backward(역전파) 쌍' },
      { lines: [10, 10], color: 'emerald', note: 'inputs: 강한 참조(Rc) — backward에서 접근 필요하므로' },
      { lines: [11, 11], color: 'amber', note: 'outputs: Weak — 순환 참조 방지. Variable -> FuncState -> Variable 순환 차단' },
    ],
  },

  'func-call': {
    path: 'src/lib.rs — Func::call()',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'call()이 순전파 실행 + 계산 그래프 구성을 동시에 처리.\nENABLE_BACKPROP이 false면 그래프 기록 생략.',
    code: `pub fn call(&self, inputs: &[&Variable]) -> Variable {
    let xs: Vec<ArrayD<f64>> = inputs.iter()
        .map(|v| v.inner.borrow().data.clone()).collect();

    let ys = self.state.borrow().func.forward(&xs);
    let outputs: Vec<Variable> = ys.into_iter()
        .map(Variable::new).collect();

    if ENABLE_BACKPROP.with(|c| c.get()) {
        let max_gen = inputs.iter()
            .map(|v| v.inner.borrow().generation)
            .max().unwrap_or(0);
        {
            let mut state = self.state.borrow_mut();
            state.inputs = inputs.iter()
                .map(|v| (*v).clone()).collect();
            state.generation = max_gen;
        }
        for output in &outputs {
            output.set_creator(&self.state);
        }
        self.state.borrow_mut().outputs = outputs.iter()
            .map(|o| Rc::downgrade(&o.inner)).collect();
    }
    outputs.into_iter().next().unwrap()
}`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: '데이터 추출 — borrow()로 불변 참조 후 clone' },
      { lines: [9, 9], color: 'emerald', note: 'ENABLE_BACKPROP 체크 — no_grad() 스코프에서는 건너뜀' },
      { lines: [19, 20], color: 'amber', note: 'set_creator — 출력 Variable의 creator를 이 함수로 연결' },
      { lines: [22, 23], color: 'violet', note: 'Rc::downgrade — outputs를 Weak로 저장해 순환 참조 방지' },
    ],
  },
};
