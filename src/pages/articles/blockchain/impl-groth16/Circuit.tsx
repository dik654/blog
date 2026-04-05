import CircuitViz from './viz/CircuitViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Circuit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="circuit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">회로 작성 (Circuit)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Circuit trait — synthesize(&self, cs) 하나만 구현하면 setup/prove/verify 모두에서 재사용
          <br />
          alloc_instance로 공개 변수, alloc_witness로 비공개 변수 할당
          <br />
          enforce(a, b, c)로 곱셈 제약 추가 — 덧셈은 LC 빌더 패턴으로 무료
        </p>
        <p className="leading-7">
          예시: f(x) = x^3 + x + 5 = y — 곱셈 2개 + 덧셈 1개
          <br />
          보조 변수 t1(x^2), t2(x^3)를 도입하여 곱셈마다 제약 하나
          <br />
          마지막 제약에서 .add()로 x와 상수 5를 연결 — 추가 제약 없이 선형결합으로 표현
        </p>
      </div>
      <div className="not-prose mb-8">
        <CircuitViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          LC 빌더 패턴 — .add(coeff, var) 체이닝으로 선형결합을 유연하게 구성
          <br />
          조건문(if-else)도 R1CS로 표현 가능: b·(1-b)=0(부울) + b·(x-y)=t + (y+t)·1=result
          <br />
          is_satisfied()로 회로 디버깅 → which_unsatisfied()로 실패 제약 위치 확인
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Circuit trait 구현 패턴</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Circuit Trait & R1CS Construction
//
// trait Circuit<F: Field> {
//     fn synthesize<CS: ConstraintSystem<F>>(
//         self,
//         cs: &mut CS
//     ) -> Result<(), SynthesisError>;
// }
//
// Purpose:
//   Describe arithmetic circuit in Rust
//   Same code generates R1CS (for setup) and witness (for proving)
//   Constraints added via ConstraintSystem

// ConstraintSystem interface:
//
//   trait ConstraintSystem<F> {
//       fn alloc_instance(&mut self, val: F) -> Variable;
//       fn alloc_witness(&mut self, val: F) -> Variable;
//       fn enforce(&mut self, a: LC, b: LC, c: LC);
//
//       // helper for linear combinations
//       fn zero_lc(&self) -> LC;
//   }

// Variable types:
//   - Instance: public input, visible to verifier
//   - Witness: private input, known only to prover
//   - ONE: constant 1 (special variable index 0)

// Example: prove knowledge of x such that x^3 + x + 5 = 35
//
//   struct CubicCircuit<F> {
//     pub x: Option<F>,   // witness
//   }
//
//   impl<F: Field> Circuit<F> for CubicCircuit<F> {
//     fn synthesize<CS: ConstraintSystem<F>>(
//       self,
//       cs: &mut CS
//     ) -> Result<(), SynthesisError> {
//       // Allocate variables
//       let x = cs.alloc_witness(self.x.unwrap_or(F::zero()));
//       let y = cs.alloc_instance(F::from(35u64));  // public output
//
//       // Auxiliary: t1 = x^2
//       let t1_val = self.x.map(|x| x * x);
//       let t1 = cs.alloc_witness(t1_val.unwrap_or(F::zero()));
//       cs.enforce(
//         LC::new().add(F::ONE, x),
//         LC::new().add(F::ONE, x),
//         LC::new().add(F::ONE, t1),
//       );
//       // Constraint: x * x = t1
//
//       // Auxiliary: t2 = x^3 = t1 * x
//       let t2_val = t1_val.zip(self.x).map(|(t1,x)| t1 * x);
//       let t2 = cs.alloc_witness(t2_val.unwrap_or(F::zero()));
//       cs.enforce(
//         LC::new().add(F::ONE, t1),
//         LC::new().add(F::ONE, x),
//         LC::new().add(F::ONE, t2),
//       );
//       // Constraint: t1 * x = t2
//
//       // Final: t2 + x + 5 = y
//       cs.enforce(
//         LC::new()
//           .add(F::ONE, t2)
//           .add(F::ONE, x)
//           .add(F::from(5u64), CS::ONE),
//         LC::new().add(F::ONE, CS::ONE),  // multiply by 1
//         LC::new().add(F::ONE, y),
//       );
//       // Constraint: (t2 + x + 5) * 1 = y
//
//       Ok(())
//     }
//   }

// Linear combination builder:
//
//   LC::new()
//     .add(coeff_1, var_1)
//     .add(coeff_2, var_2)
//     .add(coeff_3, var_3)
//
//   Represents: sum_i (coeff_i * var_i)
//   Addition is FREE (absorbed in constraints)

// Common gadgets:
//
//   Boolean: enforce b * (1 - b) = 0
//     LC::new().add(F::ONE, b),
//     LC::new().add(F::ONE, ONE).sub(F::ONE, b),
//     LC::new()  // zero
//
//   Mux (if-else):
//     result = b * (true_val - false_val) + false_val
//     enforce b * (true_val - false_val) = result - false_val
//
//   Range check (n bits):
//     x = sum_i (b_i * 2^i)
//     Each b_i boolean
//     Combines with reconstruct constraint
//
//   Equality:
//     enforce (a - b) * 1 = 0

// Dual-use pattern:
//
//   Same circuit code used in 3 modes:
//
//   Setup mode:
//     self.x = None
//     Collects R1CS matrices (A, B, C)
//     Produces ProvingKey via trusted setup
//
//   Prove mode:
//     self.x = Some(witness_value)
//     Computes all witness values
//     Records witness vector
//     Plus records R1CS for generating QAP
//
//   Verify mode:
//     Not needed here — verifier just checks proof
//     ConstraintSystem impl is a stub
//
//   The type system ensures code correctness!

// Debugging:
//   is_satisfied(): checks all constraints hold
//   which_unsatisfied(): returns failing constraint index
//   num_constraints(): reports circuit size
//   num_inputs(), num_witnesses(): variable counts

// Production frameworks:
//   arkworks (ark-relations): generic R1CS framework
//   bellman (Zcash Rust): original framework
//   circom (DSL): standalone compiler
//   gnark (Go): Ethereum-oriented
//   libsnark (C++): original libsnark for academic`}
        </pre>
      </div>
    </section>
  );
}
