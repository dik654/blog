import CodePanel from '@/components/ui/code-panel';

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

const singlePointCode = `// 단일 점 평가 (k=1): dot product로 변환 가능
// p(z) = sum(c[i] * z^i) = dot(coeffs, z_powers)
//
// 2단계 접근:
//   1) z^0, z^1, ..., z^(n-1) 배열 생성 (parallel prefix product)
//   2) coeffs[i] * z_powers[i] 원소별 곱 → parallel reduction (합산)
//
// Horner (단일 스레드, O(n)) vs dot product (다중 스레드, O(n/T + log T)):
//   n = 2^24, T = 1024 스레드:
//   Horner: 16M 순차 곱셈
//   dot product: 16K 곱셈/스레드 + 10단계 reduction
//
// 실전에서는 KZG opening이 1~수개 점만 평가하므로
// 단순 Horner로도 충분한 경우가 많다 (커널 오버헤드 < 병렬화 이득)`;

const usageCode = `PLONK/KZG에서 다점 평가 사용처:

1. KZG Opening Proof:
   증명자가 다항식 f(x)를 challenge point z에서 평가
   → f(z) 계산 (단일 점 Horner)
   → 몫 q(x) = (f(x) - f(z)) / (x - z) 계산
   → [q(x)] MSM 커밋

2. PLONK Verifier Challenge:
   라운드별 challenge alpha, beta, gamma, zeta에서 다항식 평가
   → 4~6개 점: 스레드 4~6개로 병렬 Horner

3. Batch Opening (여러 다항식, 같은 점):
   f1(z), f2(z), ..., fm(z) 동시 평가
   → 각 다항식마다 Horner 1회, m개 병렬 실행
   → GPU 활용도: m이 클수록 유리`;

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
        <CodePanel title="단일 점 평가: Horner vs Dot Product" code={singlePointCode}
          annotations={[
            { lines: [4, 6], color: 'sky', note: 'dot product 2단계' },
            { lines: [8, 11], color: 'emerald', note: 'Horner vs dot product 비교' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">ZK 증명에서의 사용처</h3>
        <CodePanel title="PLONK/KZG 다점 평가 사용처" code={usageCode}
          annotations={[
            { lines: [3, 7], color: 'sky', note: 'KZG opening: 단일 점' },
            { lines: [9, 11], color: 'emerald', note: 'PLONK: 소수 challenge 점' },
            { lines: [13, 16], color: 'amber', note: 'batch opening: 다항식 수만큼 병렬' },
          ]} />
      </div>
    </section>
  );
}
