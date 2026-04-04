import type { CodeRef } from '@/components/code/types';

export const bwdCodeRefs: Record<string, CodeRef> = {
  'backward': {
    path: 'src/lib.rs — backward()',
    lang: 'rust',
    highlight: [1, 44],
    desc: 'backward: 출력에서 입력으로 역순 추적.\ngeneration으로 정렬하여 위상 순서 보장.',
    code: `pub fn backward(&self, retain_grad: bool, create_graph: bool) {
    {
        let mut inner = self.inner.borrow_mut();
        if inner.grad.is_none() {
            inner.grad = Some(Variable::new(
                ArrayD::ones(inner.data.shape())));
        }
    }

    let mut funcs: Vec<FuncStateRef> = Vec::new();
    let mut seen: HashSet<*const RefCell<FuncState>> = HashSet::new();

    let add_func = |f: FuncStateRef,
                    funcs: &mut Vec<FuncStateRef>,
                    seen: &mut HashSet<*const _>| {
        let ptr = Rc::as_ptr(&f);
        if !seen.contains(&ptr) {
            seen.insert(ptr);
            funcs.push(f);
            funcs.sort_by_key(|f| f.borrow().generation);
        }
    };

    if let Some(creator) = self.inner.borrow().creator.clone() {
        add_func(creator, &mut funcs, &mut seen);
    }

    while let Some(state_ref) = funcs.pop() {
        {
            let _guard = using_backprop(create_graph);
            let (gxs, inputs) = {
                let state = state_ref.borrow();
                let gys: Vec<Variable> = state.outputs.iter()
                    .map(|o| o.upgrade().unwrap()
                        .borrow().grad.clone().unwrap())
                    .collect();
                let gxs = state.func.backward(
                    &state.inputs, &gys);
                (gxs, state.inputs.clone())
            };
            for (input, gx) in inputs.iter().zip(gxs) {
                let mut inner = input.inner.borrow_mut();
                if inner.grad.is_none() {
                    inner.grad = Some(gx);
                } else {
                    let prev = inner.grad.take().unwrap();
                    inner.grad = Some(&prev + &gx);
                }
            }
        }
    }
}`,
    annotations: [
      { lines: [4, 6], color: 'sky', note: 'grad 초기화 — shape와 동일한 1.0 텐서 (연쇄 법칙 시작점)' },
      { lines: [20, 20], color: 'emerald', note: 'sort_by_key(generation) — 위상 정렬 보장' },
      { lines: [30, 30], color: 'amber', note: 'using_backprop(create_graph) — true면 역전파도 그래프에 기록' },
      { lines: [42, 48], color: 'violet', note: '그래디언트 누적 — y = x + x인 경우 dy/dx = 1 + 1 = 2' },
    ],
  },
};
