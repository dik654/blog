import CodePanel from '@/components/ui/code-panel';
import SinglePointEvalViz from './viz/SinglePointEvalViz';
import MultiEvalUsageViz from './viz/MultiEvalUsageViz';

const hornerKernel = `// 다점 평가: 각 스레드가 한 점에서 Horner 평가
// p(z) = c[0] + c[1]*z + c[2]*z^2 + ... + c[n-1]*z^(n-1)
//       = c[0] + z*(c[1] + z*(c[2] + ... + z*c[n-1]))
__global__ void multi_point_eval(
    uint64_t* results, const uint64_t* coeffs,
    const uint64_t* points, int n, int k, uint64_t p) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid >= k) return;  // k개 평가점

    uint64_t z = points[tid];
    uint64_t acc = coeffs[n - 1];  // 최고차 계수부터 시작

    // Horner: 안쪽에서 바깥으로
    for (int i = n - 2; i >= 0; i--) {
        acc = mul_mod(acc, z, p);       // acc *= z
        acc = add_mod(acc, coeffs[i], p); // acc += c[i]
    }
    results[tid] = acc;  // p(z_tid)
}`;

export default function MultiEval() {
  return (
    <section id="multi-eval" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다점 평가 (Multi-point Evaluation)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          다점 평가: 다항식 p(x)를 임의의 점 z_1, z_2, ..., z_k에서 평가하는 연산이다.<br />
          NTT가 구조화된 점(단위근)에서의 평가라면, 다점 평가는 <strong>임의 점</strong>에서의 평가다.<br />
          KZG 오프닝 증명에서 challenge point 평가에 직접 사용된다.
        </p>
        <p>
          가장 직관적인 방법은 Horner's method다. 다항식 차수 n에 대해 O(n) 곱셈+덧셈으로
          한 점을 평가한다. k개 점이면 O(nk) 총 연산이지만,
          각 점이 <strong>완전히 독립</strong>이므로 GPU에서 embarrassingly parallel하다.
        </p>
        <CodePanel title="다점 Horner 평가 CUDA 커널" code={hornerKernel}
          annotations={[
            { lines: [6, 10], color: 'sky', note: '스레드 1개 = 평가점 1개' },
            { lines: [15, 18], color: 'emerald', note: 'Horner: 최고차부터 역순 계산' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">단일 점 평가: Dot Product 변환</h3>
        <p>
          k=1일 때(challenge point 1개) Horner는 순차적이다.<br />
          대안으로 p(z) = dot(coeffs, z_powers)로 변환하면 parallel reduction을 쓸 수 있다.<br />
          다만 실전에서는 평가점이 소수(1~6개)여서 Horner 커널의 단순함이 유리한 경우가 많다.
        </p>
        <SinglePointEvalViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">ZK 증명에서의 사용처</h3>
        <MultiEvalUsageViz />
      </div>
    </section>
  );
}
