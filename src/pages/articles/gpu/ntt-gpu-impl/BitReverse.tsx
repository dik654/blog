import CodePanel from '@/components/ui/code-panel';

const bitReverseCode = `// 비트 리버스 순열 CUDA 커널
__device__ uint32_t bit_reverse(uint32_t x, int log_n) {
    uint32_t r = 0;
    for (int i = 0; i < log_n; i++) {
        r = (r << 1) | (x & 1);
        x >>= 1;
    }
    return r;
}

__global__ void bit_reverse_permutation(uint64_t* data, int n, int log_n) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid >= n) return;

    int rev = bit_reverse(tid, log_n);
    if (tid < rev) {               // 중복 교환 방지
        uint64_t tmp = data[tid];
        data[tid]    = data[rev];
        data[rev]    = tmp;
    }
}
// 3비트 예시: 0→0, 1→4, 2→2, 3→6, 4→1, 5→5, 6→3, 7→7
// 교환 쌍: (1,4), (3,6) → 2개 스레드만 실제 교환`;

const twiddleCode = `// Twiddle 사전 계산: w = g^((p-1)/n) mod p (원시 n차 단위근)
__global__ void precompute_twiddles(
    uint64_t* twiddles, int n, uint64_t w, uint64_t p) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid >= n) return;
    twiddles[tid] = pow_mod(w, tid, p);  // w^tid mod p
}
// 대안: on-the-fly → pow_mod(w, k, p)를 나비마다 호출
// 사전 계산: n*8B 메모리 / on-the-fly: 메모리 0, O(log k) 곱셈`;

const pipelineCode = `void ntt_full(uint64_t* d_data, int n, uint64_t p) {
    int log_n = __builtin_ctz(n), B = 256;

    bit_reverse_permutation<<<(n+B-1)/B, B>>>(d_data, n, log_n); // 1. 비트 리버스

    uint64_t *d_tw; cudaMalloc(&d_tw, n * sizeof(uint64_t));     // 2. twiddle
    uint64_t w = find_primitive_root(n, p);
    precompute_twiddles<<<(n+B-1)/B, B>>>(d_tw, n, w, p);

    int se = min(log_n, 10);                                      // 3. 공유 메모리
    ntt_shared_stages<<<n/1024, 512>>>(d_data, d_tw, n, 0, se, p);

    for (int s = se; s < log_n; s++)                              // 4. 글로벌
        ntt_butterfly_stage<<<(n/2+B-1)/B, B>>>(d_data, d_tw, n, s, p);
    cudaFree(d_tw);
}`;

export default function BitReverse() {
  return (
    <section id="bit-reverse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비트 리버스 순열과 Twiddle 전처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cooley-Tukey NTT는 입력을 <strong>비트 리버스 순서</strong>로 재배치한 뒤 나비 연산을 수행한다.<br />
          인덱스 i의 log2(n)비트를 뒤집어 새 위치를 구한다.
          tid &lt; rev 조건으로 중복 교환을 방지하여 n개 스레드 중 실제 교환은 절반 미만이다.
        </p>
        <CodePanel title="비트 리버스 순열 커널" code={bitReverseCode}
          annotations={[
            { lines: [2, 10], color: 'sky', note: '비트 리버스 함수' },
            { lines: [13, 22], color: 'emerald', note: 'tid < rev 조건으로 중복 방지' },
            { lines: [24, 25], color: 'amber', note: '3비트 교환 예시' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Twiddle Factor 전처리</h3>
        <p>
          Twiddle factor w^k는 나비 연산마다 필요하다. 사전 계산(n*8바이트)과 on-the-fly 계산(메모리 0, 연산 증가) 두 전략이 있다.<br />
          대부분의 구현은 메모리 비용 대비 연산 절약이 크므로 사전 계산을 선택한다.
        </p>
        <CodePanel title="Twiddle 사전 계산 vs on-the-fly" code={twiddleCode}
          annotations={[
            { lines: [2, 7], color: 'sky', note: '사전 계산 커널' },
            { lines: [8, 9], color: 'emerald', note: 'on-the-fly 트레이드오프' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">전체 파이프라인</h3>
        <p>
          비트 리버스, twiddle 전처리, 공유 메모리 스테이지, 글로벌 스테이지를 순서대로 실행한다.<br />
          ICICLE 등 ZK 가속 라이브러리도 이 구조를 따른다.
        </p>
        <CodePanel title="NTT 전체 파이프라인" code={pipelineCode}
          annotations={[
            { lines: [3, 3], color: 'sky', note: '비트 리버스' },
            { lines: [5, 8], color: 'emerald', note: 'twiddle 전처리' },
            { lines: [10, 11], color: 'amber', note: '공유 메모리 스테이지' },
            { lines: [13, 14], color: 'violet', note: '글로벌 스테이지' },
          ]} />
      </div>
    </section>
  );
}
