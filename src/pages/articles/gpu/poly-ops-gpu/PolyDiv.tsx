import CodePanel from '@/components/ui/code-panel';

const divKernel = `// 점별 다항식 나눗셈: h(s_i) = t(s_i) / Z(s_i)
// s_i = g * omega^i (coset 평가점)
__global__ void pointwise_div(
    uint64_t* h, const uint64_t* t, const uint64_t* z_inv,
    int n, uint64_t p) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid >= n) return;
    // z_inv[i] = Z(s_i)^(-1), 사전 계산됨
    h[tid] = mul_mod(t[tid], z_inv[tid], p);
}

// Z(x) = x^n - 1 평가는 단순 계산
// Z(g*omega^i) = (g*omega^i)^n - 1 = g^n * (omega^i)^n - 1 = g^n - 1
// omega^n = 1이므로 모든 i에 대해 Z(g*omega^i) = g^n - 1 (상수!)
// → n개 역원이 아닌 1개 역원만 계산하면 충분`;

const batchInvCode = `// Montgomery's batch inversion trick
// n개 원소의 역원을 1회 역원 + 3(n-1)회 곱셈으로 계산
// 입력: a[0], a[1], ..., a[n-1]
// 출력: inv[0], inv[1], ..., inv[n-1]  (inv[i] = a[i]^(-1))

void batch_inversion(uint64_t* a, uint64_t* inv, int n, uint64_t p) {
    // 1단계: 누적곱 (prefix product)
    uint64_t* prefix = new uint64_t[n];
    prefix[0] = a[0];
    for (int i = 1; i < n; i++)
        prefix[i] = mul_mod(prefix[i-1], a[i], p);

    // 2단계: 마지막 누적곱의 역원 1회 계산
    uint64_t acc_inv = inv_mod(prefix[n-1], p);  // 유일한 역원 연산

    // 3단계: 역순으로 개별 역원 복원
    for (int i = n-1; i > 0; i--) {
        inv[i] = mul_mod(acc_inv, prefix[i-1], p);
        acc_inv = mul_mod(acc_inv, a[i], p);
    }
    inv[0] = acc_inv;
}`;

export default function PolyDiv() {
  return (
    <section id="poly-div" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다항식 나눗셈: Vanishing Polynomial</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PLONK 몫 다항식: h(x) = t(x) / Z(x). 평가 형태에서는 점별 나눗셈이다.<br />
          나눗셈 = 역원 곱셈이므로 Z(s_i)의 역원만 있으면 O(n) 원소별 곱셈으로 끝난다.
        </p>
        <p>
          핵심 관찰: Z(x) = x^n - 1을 coset 점 g*omega^i에서 평가하면
          Z(g*omega^i) = g^n * (omega^n)^i - 1 = g^n - 1이다.
          omega^n = 1이므로 <strong>모든 평가점에서 같은 값</strong>이 나온다.<br />
          역원 1개만 계산하면 n개 점 전부에 사용할 수 있다.
        </p>
        <CodePanel title="점별 나눗셈 CUDA 커널" code={divKernel}
          annotations={[
            { lines: [3, 11], color: 'sky', note: '원소별 곱셈: t[i] * Z_inv' },
            { lines: [14, 16], color: 'emerald', note: 'Z(coset) = g^n - 1 (상수)' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">일반적 경우: 배치 역원 (Montgomery Trick)</h3>
        <p>
          vanishing polynomial은 상수로 단순화되지만, 일반적인 다항식 나눗셈에서는
          n개 서로 다른 값의 역원이 필요하다. Fp 역원은 확장 유클리드 또는 페르마 소정리(a^(p-2))로
          계산하며, 둘 다 비용이 크다.
        </p>
        <p>
          Montgomery의 배치 역원 기법: n개 역원을 <strong>1회 역원 + 3(n-1)회 곱셈</strong>으로 줄인다.
          {'누적곱 계산 → 마지막 역원 1회 → 역순 복원의 3단계 구조'}
          GPU에서는 누적곱을 parallel prefix scan으로 가속할 수 있다.
        </p>
        <CodePanel title="Montgomery 배치 역원" code={batchInvCode}
          annotations={[
            { lines: [7, 10], color: 'sky', note: '1단계: 누적곱 prefix[i] = a[0]*...*a[i]' },
            { lines: [12, 13], color: 'emerald', note: '2단계: 유일한 역원 연산' },
            { lines: [15, 19], color: 'amber', note: '3단계: 역순으로 개별 역원 복원' },
          ]} />
      </div>
    </section>
  );
}
