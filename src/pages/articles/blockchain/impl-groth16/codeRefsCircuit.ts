import type { CodeRef } from '@/components/code/types';

export const circuitCodeRefs: Record<string, CodeRef> = {
  'circuit-trait': {
    path: 'r1cs.rs — Circuit trait',
    lang: 'rust',
    highlight: [1, 8],
    desc: 'Circuit trait — 계산을 R1CS로 표현하는 인터페이스.\nsynthesize 하나로 setup/prove/verify에서 재사용.',
    code: `/// 회로 = "어떤 계산을 R1CS로 표현하는 방법"
///
/// synthesize()가 ConstraintSystem에
/// 변수와 제약을 추가
/// 같은 Circuit 구현을 setup, prove, verify에서 재사용
pub trait Circuit {
    fn synthesize(&self, cs: &mut ConstraintSystem);
}`,
    annotations: [
      { lines: [6, 8], color: 'sky', note: 'Circuit은 synthesize 하나만 구현 — 키 생성/증명/검증 모두에 사용' },
    ],
  },
  'circuit-cubic': {
    path: 'groth16.rs — CubicCircuit (x^3+x+5=y)',
    lang: 'rust',
    highlight: [1, 32],
    desc: 'x^3 + x + 5 = y 회로 예시.\n곱셈 2개 + 덧셈 1개 = 제약 3개.\n보조 변수 t1=x^2, t2=x^3 도입.',
    code: `struct CubicCircuit { x: Fr }

impl Circuit for CubicCircuit {
    fn synthesize(&self, cs: &mut ConstraintSystem) {
        let x_val = self.x;
        let t1_val = x_val * x_val;      // x^2
        let t2_val = t1_val * x_val;      // x^3
        let y_val = t2_val + x_val
                  + Fr::from_u64(5);      // x^3+x+5

        let x = cs.alloc_witness(x_val);  // 비공개
        let y = cs.alloc_instance(y_val);  // 공개 출력
        let t1 = cs.alloc_witness(t1_val); // 보조
        let t2 = cs.alloc_witness(t2_val); // 보조

        // 제약 1: x · x = t1
        cs.enforce(
            LinearCombination::from(x),
            LinearCombination::from(x),
            LinearCombination::from(t1),
        );
        // 제약 2: t1 · x = t2
        cs.enforce(
            LinearCombination::from(t1),
            LinearCombination::from(x),
            LinearCombination::from(t2),
        );
        // 제약 3: (t2 + x + 5) · 1 = y
        cs.enforce(
            LinearCombination::from(t2)
                .add(Fr::ONE, x)
                .add(Fr::from_u64(5), Variable::One),
            LinearCombination::from(Variable::One),
            LinearCombination::from(y),
        );
    }
}`,
    annotations: [
      { lines: [11, 14], color: 'sky', note: 'x=witness(비공개), y=instance(공개), t1/t2=보조 변수' },
      { lines: [16, 21], color: 'emerald', note: '곱셈마다 enforce 하나. 덧셈은 LC 내에서 무료' },
      { lines: [28, 35], color: 'amber', note: 'LC 빌더 — .add()로 항을 연결. (t2+x+5)·1=y' },
    ],
  },
};
