import CodePanel from '@/components/ui/code-panel';

const singleOpen = `// Single Opening: 점 z에서 p(z) = v 증명
//
// 1) 몫 다항식: q(x) = (p(x) - v) / (x - z)
//    → p(z) = v 이면 (x - z)가 (p(x) - v)를 정확히 나눈다
//    → GPU: 다항식 뺄셈 O(n) + synthetic division O(n)
//
// 2) 증명 생성: pi = Commit(q) = MSM(q.coeffs, srs[0..d-1])
//    → q(x)의 차수는 d-1 (원래보다 1 작음)
//    → GPU MSM 커널 1회 호출
//
// 3) 검증 (verifier, CPU):
//    e(C - v*G, H) == e(pi, [s]H - z*H)
//    → pairing 2회 + G1 스칼라곱 2회 (매우 빠름)`;

const batchOpen = `// Batch Opening: k개 다항식을 같은 점 z에서 한 번에 열기
//
// 다항식: p_1(x), ..., p_k(x)  평가값: v_1, ..., v_k
// Fiat-Shamir 랜덤: gamma (verifier 챌린지)
//
// 1) 선형 결합:
//    h(x) = p_1(x) + gamma*p_2(x) + ... + gamma^(k-1)*p_k(x)
//    w    = v_1    + gamma*v_2    + ... + gamma^(k-1)*v_k
//    → GPU: k개 다항식 계수별 스칼라곱 + 덧셈, O(k*n)
//
// 2) 몫: q(x) = (h(x) - w) / (x - z)
//    → GPU: synthetic division O(n)
//
// 3) 증명: pi = Commit(q) = MSM 1회
//    → k개 다항식을 열었지만 증명은 G1 점 1개!`;

const gpuPipeline = `// GPU Batch Opening 파이프라인 (PLONK Round 5)
//
// Step 1: gamma 거듭제곱 계산       [GPU, O(k)]
//   gamma_pows = [1, gamma, gamma^2, ..., gamma^(k-1)]
//
// Step 2: 다항식 선형 결합           [GPU, O(k*n)]
//   h_coeffs[i] = sum_j( gamma^j * p_j_coeffs[i] )  for i in 0..n
//
// Step 3: 평가값 선형 결합           [CPU, O(k)]
//   w = sum_j( gamma^j * v_j )
//
// Step 4: 상수항 뺄셈               [GPU, O(1)]
//   h_coeffs[0] -= w
//
// Step 5: (x - z)로 나눗셈           [GPU, O(n)]
//   q_coeffs = synthetic_div(h_coeffs, z)
//
// Step 6: MSM으로 증명 생성          [GPU, O(n/log n)]
//   pi = gpu_msm(q_coeffs, srs[0..n-2])`;

export default function BatchOpening() {
  return (
    <section id="batch-opening" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Batch Opening 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          KZG의 진정한 강점은 <strong>batch opening</strong>이다.
          k개의 다항식을 같은 점 z에서 열 때, 랜덤 선형 결합으로 하나의 몫 다항식을 만들면
          증명이 G1 점 단 하나로 압축된다. 검증도 pairing 2회로 동일하다.
        </p>
        <CodePanel title="Single Opening 과정" code={singleOpen} annotations={[
          { lines: [3, 5], color: 'sky', note: '몫 다항식 계산 (GPU)' },
          { lines: [7, 9], color: 'emerald', note: '증명 = MSM 1회' },
          { lines: [11, 13], color: 'amber', note: '검증 = pairing 2회' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Batch Opening: k개를 하나로</h3>
        <p>
          PLONK Round 5에서는 11개 이상의 다항식을 동시에 연다.<br />
          Fiat-Shamir로 챌린지 gamma를 추출한 뒤, 다항식을 gamma의 거듭제곱으로 선형 결합한다.<br />
          GPU에서는 계수별 스칼라곱과 벡터 덧셈이므로 O(k*n)에 완료된다.
        </p>
        <CodePanel title="Batch Opening: 선형 결합 + 단일 증명" code={batchOpen} annotations={[
          { lines: [3, 4], color: 'sky', note: '입력: k개 다항식 + 챌린지' },
          { lines: [6, 8], color: 'emerald', note: '선형 결합 (GPU 벡터 연산)' },
          { lines: [10, 11], color: 'amber', note: '몫 다항식 (GPU division)' },
          { lines: [13, 14], color: 'violet', note: '증명 = MSM 1회' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU 파이프라인 전체 흐름</h3>
        <p>
          Step 6의 MSM이 전체 시간의 80% 이상을 차지한다.<br />
          Step 2의 선형 결합은 element-wise 연산이므로 GPU 메모리 대역폭에 바운드된다.<br />
          Step 5의 synthetic division은 순차적이지만 n개 Fp 곱셈-뺄셈으로 GPU에서도 빠르다.
        </p>
        <CodePanel title="GPU Batch Opening 6단계" code={gpuPipeline} annotations={[
          { lines: [3, 4], color: 'sky', note: 'gamma 전처리' },
          { lines: [6, 7], color: 'emerald', note: '다항식 합성 (메모리 바운드)' },
          { lines: [12, 16], color: 'amber', note: '뺄셈 + 나눗셈' },
          { lines: [18, 19], color: 'violet', note: 'MSM: 전체의 80%+' },
        ]} />
      </div>
    </section>
  );
}
