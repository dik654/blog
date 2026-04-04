import CodePanel from '@/components/ui/code-panel';

const cosetKernel = `// Coset NTT: 계수에 g^i를 곱한 뒤 표준 NTT 실행
__global__ void coset_premultiply(
    uint64_t* coeffs, const uint64_t* g_powers,
    int n, uint64_t p) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid >= n) return;
    // coeffs[i] *= g^i (Montgomery 곱셈)
    coeffs[tid] = mul_mod(coeffs[tid], g_powers[tid], p);
}

// 호스트 코드: coset NTT = premultiply + standard NTT
void coset_ntt(uint64_t* d_coeffs, uint64_t* d_g_powers,
               uint64_t* d_twiddles, int n, uint64_t p) {
    int threads = 256;
    int blocks = (n + threads - 1) / threads;
    coset_premultiply<<<blocks, threads>>>(
        d_coeffs, d_g_powers, n, p);
    ntt_gpu(d_coeffs, d_twiddles, n, p);  // 기존 NTT 재사용
}`;

const inttCode = `// Coset INTT: 표준 INTT 후 g^(-i)를 곱함
// INTT = NTT(omega^-1) 후 n^-1 스케일링

__global__ void coset_postdivide(
    uint64_t* values, const uint64_t* g_inv_powers,
    int n, uint64_t p) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid >= n) return;
    // values[i] *= g^(-i) (coset 보정 제거)
    values[tid] = mul_mod(values[tid], g_inv_powers[tid], p);
}

// coset INTT = standard INTT + post-divide
void coset_intt(uint64_t* d_values, uint64_t* d_g_inv_powers,
                uint64_t* d_inv_twiddles, int n, uint64_t p) {
    intt_gpu(d_values, d_inv_twiddles, n, p);
    int threads = 256, blocks = (n + threads - 1) / threads;
    coset_postdivide<<<blocks, threads>>>(
        d_values, d_g_inv_powers, n, p);
}`;

export default function CosetNtt() {
  return (
    <section id="coset-ntt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Coset NTT & INTT</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          표준 NTT는 다항식 f(x)를 단위근 omega^0, omega^1, ..., omega^(n-1)에서 평가한다.<br />
          Coset NTT는 평가 점을 <strong>g * omega^i</strong>로 이동한다.<br />
          여기서 g는 coset 생성원(generator)으로, 단위근과 다른 multiplicative subgroup의 원소다.
        </p>
        <p>
          구현은 간단하다. f(g * omega^i) = NTT(f'(x))이고, f'의 i번째 계수는 f_i * g^i다.<br />
          즉 <strong>각 계수에 g^i를 곱한 뒤 표준 NTT를 실행</strong>하면 된다.<br />
          전처리 곱셈은 O(n)으로 NTT 비용 O(n log n)에 비해 무시할 수 있다.
        </p>
        <CodePanel title="Coset NTT: 전처리 곱셈 + 표준 NTT" code={cosetKernel}
          annotations={[
            { lines: [2, 10], color: 'sky', note: '전처리: coeffs[i] *= g^i' },
            { lines: [13, 20], color: 'emerald', note: '호스트: premultiply → NTT 순서 실행' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Coset INTT: 역변환</h3>
        <p>
          Coset INTT는 반대 순서다. 표준 INTT를 먼저 실행한 뒤, 각 계수에 g^(-i)를 곱한다.
          g_powers와 g_inv_powers는 프로버 초기화 시 한 번만 계산하여 GPU에 상주시킨다.<br />
          BN254 기준 g = 7이 일반적으로 사용된다.
        </p>
        <CodePanel title="Coset INTT: 표준 INTT + 후처리 나눗셈" code={inttCode}
          annotations={[
            { lines: [3, 10], color: 'sky', note: '후처리: values[i] *= g^(-i)' },
            { lines: [13, 19], color: 'emerald', note: '호스트: INTT → post-divide 순서' },
          ]} />
      </div>
    </section>
  );
}
