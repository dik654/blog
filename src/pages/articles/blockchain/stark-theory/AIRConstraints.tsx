import AIRConstraintViz from './viz/AIRConstraintViz';

export default function AIRConstraints() {
  return (
    <section id="air-constraints" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AIR 제약 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          실행 추적의 무결성을 다항식 등식으로 표현 &mdash; 전이 제약 + 경계 제약.
        </p>
      </div>
      <div className="not-prose"><AIRConstraintViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">AIR (Algebraic Intermediate Representation)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AIR = 다항식 제약으로 표현된 연산
//
// 두 종류의 제약:
//
// 1. Transition Constraints (전이 제약)
//    모든 연속된 row 쌍에 대해 성립
//    "step i → step i+1 어떻게 변해야?"
//
//    예 (Fibonacci):
//      C1(x) = a(ω·x) - b(x) = 0
//      C2(x) = b(ω·x) - a(x) - b(x) = 0
//
//      x ∈ D \\ {ω^T} 에서 성립해야
//
// 2. Boundary Constraints (경계 제약)
//    특정 row에 대해 성립
//    "초기값, 최종값 조건"
//
//    예:
//      a(ω^0) = 1        (초기 a=1)
//      b(ω^0) = 1        (초기 b=1)
//      b(ω^T) = expected (출력 체크)
//
// Constraint Polynomial:
//   C(x) = (a(ω·x) - b(x)) · something
//
//   Division by vanishing polynomial:
//   V(x) = ∏(x - ω^i) for all valid i
//
//   Proof: C(x) / V(x) is low degree polynomial
//         ⟺ constraints are satisfied

// Composition Polynomial:
//   모든 제약을 하나로 결합
//   C_composition(x) = Σ α_i · C_i(x) / V_i(x)
//
//   Prover commits to C_composition
//   Verifier checks low-degreeness via FRI

// AIR 작성 예시 (pseudocode):
//
// // Cairo-like DSL
// air FibonacciAir {
//     columns { a, b }
//
//     transition {
//         next(a) == b
//         next(b) == a + b
//     }
//
//     boundary {
//         first(a) == 1
//         first(b) == 1
//         last(b) == public_input
//     }
// }
//
// 자동으로 polynomial constraints 생성

// 실무 AIR 프레임워크:
//   - Cairo AIR (StarkWare)
//   - Winterfell AIR (Rust)
//   - Stone (Cairo 후속)
//   - Plonky3 (Polygon)

// 복잡한 연산의 AIR 작성:
//   - Hash function (Poseidon, Rescue)
//   - Elliptic curve ops
//   - Memory access
//   - Range checks
//   - Bitwise operations (expensive!)`}
        </pre>
      </div>
    </section>
  );
}
