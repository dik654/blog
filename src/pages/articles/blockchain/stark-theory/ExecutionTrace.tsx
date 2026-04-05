import TraceTableViz from './viz/TraceTableViz';

export default function ExecutionTrace() {
  return (
    <section id="execution-trace" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 추적 (Execution Trace)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          계산을 테이블로 표현 &mdash; 행=스텝, 열=레지스터. 각 열을 다항식으로 보간.
        </p>
      </div>
      <div className="not-prose"><TraceTableViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Execution Trace 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Execution Trace in STARKs
//
// 개념:
//   연산의 모든 중간 상태를 테이블로 기록
//   Row = timestep
//   Column = register/variable
//
// 예시: Fibonacci 수열 계산
//
//   ┌─────┬─────┬─────┐
//   │ step│  a  │  b  │
//   ├─────┼─────┼─────┤
//   │  0  │  1  │  1  │
//   │  1  │  1  │  2  │
//   │  2  │  2  │  3  │
//   │  3  │  3  │  5  │
//   │  4  │  5  │  8  │
//   │  5  │  8  │ 13  │
//   │  ...│     │     │
//   │  T  │ F_T │F_T+1│
//   └─────┴─────┴─────┘
//
// 전이 관계 (transition):
//   a_{i+1} = b_i
//   b_{i+1} = a_i + b_i
//
// 경계 조건 (boundary):
//   a_0 = 1, b_0 = 1
//   b_T = expected_output

// 다항식 보간:
//   각 column을 다항식으로 표현
//   a(x): a_0, a_1, ..., a_T 지나는 다항식
//   b(x): b_0, b_1, ..., b_T 지나는 다항식
//
//   Interpolation domain:
//     D = {ω^0, ω^1, ..., ω^T}
//     (ω = primitive T-th root of unity)
//
//   Lagrange interpolation:
//     a(ω^i) = a_i
//     b(ω^i) = b_i

// Trace 크기:
//   T = trace length (2의 거듭제곱)
//   W = width (columns)
//   Total cells = T · W
//
// 예시:
//   Cairo VM: ~32 columns
//   Risc0: ~256 columns (RISC-V)
//   Plonky2: ~135 columns

// 실제 STARK에서:
//   - Padding: T를 2^k로 맞춤
//   - Multi-trace: 여러 테이블 (main + auxiliary)
//   - Public inputs: 경계 제약으로
//   - Memory: 정렬된 access trace`}
        </pre>
      </div>
    </section>
  );
}
