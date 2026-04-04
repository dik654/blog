import type { CodeRef } from '@/components/code/types';

export const varCodeRefs: Record<string, CodeRef> = {
  'var-struct': {
    path: 'src/lib.rs — Variable & VarInner',
    lang: 'rust',
    highlight: [1, 34],
    desc: 'Variable의 내부 구조.\nRc<RefCell<VarInner>>로 다대다 공유 + 내부 가변성 확보.',
    code: `struct VarInner {
    data: ArrayD<f64>,
    // grad를 ArrayD가 아닌 Variable로 저장하는 이유:
    // 기울기도 cos, mul 같은 연산을 거쳐 만들어진 값
    // 그 연산 이력(creator 체인)을 보존해야 다시 미분 가능
    //
    // 예) f(x) = x^4 - 2x^2, x = 2.0
    //   ArrayD일 때: x.grad = 24.0 (숫자만)
    //   Variable일 때: x.grad = Variable {
    //     data: 24.0,
    //     creator: SubFn <- MulFn <- PowFn <- x
    //   }
    //   -> grad.backward() 하면 f''(x) 자동 계산
    grad: Option<Variable>,
    creator: Option<FuncStateRef>,  // 이 변수를 만든 함수
    generation: u32,                // 위상 정렬용 세대 번호
    name: Option<String>,
}

#[derive(Clone)]
pub struct Variable {
    inner: Rc<RefCell<VarInner>>,   // 공유 소유권 + 내부 가변성
}

impl Variable {
    pub fn new(data: ArrayD<f64>) -> Self {
        Variable {
            inner: Rc::new(RefCell::new(VarInner {
                data,
                grad: None,
                creator: None,
                generation: 0,
                name: None,
            })),
        }
    }
}`,
    annotations: [
      { lines: [3, 13], color: 'sky', note: 'grad가 Variable인 이유 — 고차 미분 시 그래디언트의 계산 이력 보존' },
      { lines: [14, 14], color: 'emerald', note: 'creator — 역전파 시 이 체인을 따라 함수를 역순 호출' },
      { lines: [15, 15], color: 'amber', note: 'generation — backward에서 세대 높은 순으로 정렬 (위상 정렬)' },
      { lines: [21, 21], color: 'violet', note: 'Rc<RefCell<>> — 계산 그래프의 다대다 관계를 위한 공유 소유권' },
    ],
  },
};
