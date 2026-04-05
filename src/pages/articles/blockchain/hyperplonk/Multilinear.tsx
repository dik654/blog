import Math from '@/components/ui/math';

export default function Multilinear() {
  return (
    <section id="multilinear" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다중선형 확장 (MLE)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-4">단변수 vs 다중선형</h3>
        <p>
          <strong>단변수 다항식</strong>(univariate) — 변수 1개, 차수 <Math>{'d'}</Math>
        </p>
        <Math display>{'f(x) = a_0 + a_1 x + a_2 x^2 + \\cdots + a_d x^d'}</Math>
        <p>
          계수가 <Math>{'d+1'}</Math>개이므로, <Math>{'n'}</Math>개 제약을 인코딩하려면 차수 <Math>{'n'}</Math>짜리 다항식이 필요함
          <br />
          이 고차 다항식의 평가에 <a href="/crypto/fft" className="text-indigo-400 hover:underline">FFT/NTT</a>가 필수 — <Math>{'O(n \\log n)'}</Math>
        </p>

        <p>
          <strong>다중선형 다항식</strong>(multilinear) — 변수 <Math>{'n'}</Math>개, 각 변수의 차수가 최대 1
        </p>
        <Math display>{'f(x_1, x_2) = 3x_1 x_2 + 2x_1 + x_2 + 1'}</Math>
        <p>
          <Math>{'x_1'}</Math>에 대해 1차, <Math>{'x_2'}</Math>에 대해서도 1차
          <br />
          고차 단변수 다항식이 아니므로 FFT가 불필요함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">
          왜 유용한가: 진리표 인코딩
        </h3>
        <p>
          <Math>{'n'}</Math>개 변수의 다중선형 다항식은 <Math>{'\\{0,1\\}^n'}</Math> 위에서 <Math>{'2^n'}</Math>개 값을 가짐
          <br />
          예: <Math>{'n=2'}</Math>이면 <Math>{'(0,0), (0,1), (1,0), (1,1)'}</Math> — 4개 평가점
          <br />
          이 4개 값이 회로의 wire 값, gate 출력 등 모든 제약을 인코딩함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">MLE 구성</h3>
        <p>
          함수 <Math>{'f: \\{0,1\\}^n \\to \\mathbb{F}'}</Math>가 주어지면, <Math>{'\\{0,1\\}^n'}</Math> 위에서 <Math>{'f'}</Math>와 일치하는 <strong>유일한</strong> 다중선형 다항식이 존재함
        </p>
        <Math display>{'\\tilde{f}(x_1, \\ldots, x_n) = \\sum_{b \\in \\{0,1\\}^n} f(b) \\cdot \\prod_{i=1}^{n} \\big( b_i x_i + (1-b_i)(1-x_i) \\big)'}</Math>
        <p>
          각 <Math>{'b \\in \\{0,1\\}^n'}</Math>에 대해 라그랑주 기저(Lagrange basis)를 구성하는 방식
          <br />
          <Math>{'\\prod_{i=1}^{n}(b_i x_i + (1-b_i)(1-x_i))'}</Math>는 <Math>{'x = b'}</Math>일 때만 1, 나머지에서 0
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">구체적 예시</h3>
        <p>
          <Math>{'f(0,0)=1,\\; f(0,1)=2,\\; f(1,0)=3,\\; f(1,1)=7'}</Math>로 정의된 함수의 MLE:
        </p>
        <Math display>{'\\tilde{f}(x_1, x_2) = 1 \\cdot (1-x_1)(1-x_2) + 2 \\cdot (1-x_1)x_2 + 3 \\cdot x_1(1-x_2) + 7 \\cdot x_1 x_2'}</Math>
        <p>
          전개하면 <Math>{'\\tilde{f}(x_1, x_2) = 3x_1 x_2 + 2x_1 + x_2 + 1'}</Math>
          <br />
          검증: <Math>{'\\tilde{f}(1,1) = 3+2+1+1 = 7'}</Math> — 원래 함수값과 일치
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">다중선형 확장의 실전 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Multilinear Extension (MLE) - Practical Details
//
// Theorem (uniqueness):
//   For any function f: {0,1}^n → F,
//   there exists a UNIQUE multilinear polynomial tilde(f)
//   in F[x_1, ..., x_n] such that:
//     tilde(f)(b) = f(b) for all b in {0,1}^n
//
// Dimension counting:
//   Monomials in multilinear poly with n vars:
//     2^n (subsets of {x_1, ..., x_n})
//   Values in truth table:
//     2^n (one per boolean input)
//   → Bijection: f ↔ tilde(f)

// Lagrange interpolation formula:
//
//   tilde(f)(x) = sum_{b in {0,1}^n} f(b) * eq(b, x)
//
//   where eq(b, x) is the "equality indicator":
//     eq(b, x) = prod_i (b_i * x_i + (1-b_i)*(1-x_i))
//
//   Property:
//     eq(b, c) = 1 if b == c
//             = 0 otherwise
//   (for b, c in {0,1}^n)

// Example (n=2):
//
//   f: {00→1, 01→2, 10→3, 11→7}
//
//   MLE components:
//     eq(00, x_1, x_2) = (1-x_1)(1-x_2)
//     eq(01, x_1, x_2) = (1-x_1)(x_2)
//     eq(10, x_1, x_2) = (x_1)(1-x_2)
//     eq(11, x_1, x_2) = (x_1)(x_2)
//
//   tilde(f) = 1*(1-x_1)(1-x_2) + 2*(1-x_1)*x_2
//              + 3*x_1*(1-x_2) + 7*x_1*x_2
//
//   Expand:
//     = 1 - x_1 - x_2 + x_1*x_2
//     + 2*x_2 - 2*x_1*x_2
//     + 3*x_1 - 3*x_1*x_2
//     + 7*x_1*x_2
//     = 1 + 2*x_1 + x_2 + 3*x_1*x_2 ✓

// MLE evaluation algorithms:
//
//   Method 1: Direct formula
//     Evaluate as sum over {0,1}^n
//     Cost: O(2^n * n) for single eval
//     Bad for large n
//
//   Method 2: Dynamic programming
//     Start with values f(b) for all b
//     Round i: fold variable x_i
//       new[b'] = old[(b',0)] + (old[(b',1)] - old[(b',0)]) * r_i
//     End with 1 value
//     Cost: O(2^n) for single eval
//
//   Method 3: Streaming (GKR-style)
//     Stream boolean hypercube points
//     Process via sum-check incrementally
//     Memory: O(2^n) still needed

// Folding interpretation:
//
//   Given tilde(f)(x_1, ..., x_n) = MLE of f
//
//   Partial evaluation:
//     g(x_2, ..., x_n) = tilde(f)(r_1, x_2, ..., x_n)
//
//   Relation to original:
//     g = (1-r_1) * tilde(f)(0, x_2, ..., x_n)
//       + r_1 * tilde(f)(1, x_2, ..., x_n)
//
//   This is "folding": convert n-variable to (n-1)-variable
//   Core operation in sum-check protocol

// Data structure:
//
//   struct MLE<F> {
//       num_vars: usize,
//       evaluations: Vec<F>,  // 2^num_vars values
//   }
//
//   // Truth table indexed by boolean input
//   evaluations[bit_vector_to_index(b)] = f(b)
//
//   // Evaluation at random point r = (r_1, ..., r_n)
//   fn evaluate(&self, r: &[F]) -> F {
//       let mut values = self.evaluations.clone();
//       for i in 0..self.num_vars {
//           // Fold variable i
//           let half = values.len() / 2;
//           for j in 0..half {
//               let lo = values[j];
//               let hi = values[j + half];
//               values[j] = lo + r[i] * (hi - lo);
//           }
//           values.truncate(half);
//       }
//       values[0]  // final result
//   }

// Why multilinear is "enough":
//
//   Circuits have n wires
//   Can index wires by log(n)-bit strings
//   Wire values → MLE truth table → multilinear poly
//
//   Constraint checks become polynomial identities:
//     For each gate i: (l_i + r_i - o_i) = 0 (if add gate)
//     → expressed as multilinear in wire indicators
//
//   Verification: check polynomial identity at random point
//   Sum-check enables this in O(log n) rounds

// Arithmetic operations on MLEs:
//
//   Addition: (tilde(f) + tilde(g))(x) = tilde(f)(x) + tilde(g)(x)
//     → pointwise: values[i] = f_vals[i] + g_vals[i]
//     → O(2^n) time
//
//   Multiplication: tilde(f) * tilde(g)
//     NOT multilinear anymore! Degree 2 in each var
//     Result has 3^n monomials
//     → Often NOT computed explicitly
//     → Used inside sum-check
//
//   Equality polynomial:
//     EQ(x, y) = prod_i (x_i*y_i + (1-x_i)(1-y_i))
//     multilinear in x and y separately
//     But degree 2 in joint (x, y)`}
        </pre>
      </div>
    </section>
  );
}
