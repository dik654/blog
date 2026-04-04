import CodePanel from '@/components/ui/code-panel';

const butterflyCode = `// 단일 스테이지 NTT 나비 커널
__global__ void ntt_butterfly_stage(
    uint64_t* data, const uint64_t* twiddles,
    int n, int stage, uint64_t p) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    if (tid >= n / 2) return;

    int half = 1 << stage;            // 나비 stride = 2^stage
    int group = half << 1;            // 그룹 크기 = 2^(stage+1)
    int gid = tid / half;             // 어느 그룹?
    int pid = tid % half;             // 그룹 내 위치

    int idx_a = gid * group + pid;
    int idx_b = idx_a + half;
    uint64_t w = twiddles[pid * (n / group)]; // twiddle factor

    uint64_t a = data[idx_a], b = data[idx_b];
    uint64_t wb = mul_mod(w, b, p);   // Montgomery 곱셈
    data[idx_a] = add_mod(a, wb, p);  // a' = a + w*b
    data[idx_b] = sub_mod(a, wb, p);  // b' = a - w*b
}`;

const indexCode = `나비 인덱스 매핑 예시 (n=8, 3스테이지):

Stage 0 (stride=1, group=2):
  tid=0 → (0,1)  tid=1 → (2,3)  tid=2 → (4,5)  tid=3 → (6,7)

Stage 1 (stride=2, group=4):
  tid=0 → (0,2)  tid=1 → (1,3)  tid=2 → (4,6)  tid=3 → (5,7)

Stage 2 (stride=4, group=8):
  tid=0 → (0,4)  tid=1 → (1,5)  tid=2 → (2,6)  tid=3 → (3,7)

패턴: stride가 커질수록 (a, b) 사이 거리가 늘어남
  → 큰 스테이지일수록 캐시 미스 증가 → 글로벌 메모리 대역폭이 병목`;

const launchCode = `// 호스트 코드: 스테이지별 커널 실행
void ntt_gpu(uint64_t* d_data, uint64_t* d_twiddles,
             int n, uint64_t p)
{
    int log_n = __builtin_ctz(n);     // log2(n)
    int threads = 256;
    int blocks  = (n / 2 + threads - 1) / threads;

    for (int s = 0; s < log_n; s++) {
        ntt_butterfly_stage<<<blocks, threads>>>(
            d_data, d_twiddles, n, s, p);
    }
    // n=2^24 → 24번 커널 실행, 각 실행에 8M 스레드
}`;

export default function ButterflyKernel() {
  return (
    <section id="butterfly-kernel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Butterfly CUDA 커널</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          나비 연산의 핵심: <strong>a' = a + w*b, b' = a - w*b</strong>.
          각 스레드가 하나의 나비를 담당하며 2개 원소를 읽고 2개를 쓴다.<br />
          스레드 인덱스(tid)에서 (a_index, b_index) 쌍을 계산하는 것이 커널 설계의 핵심이다.
        </p>
        <CodePanel title="단일 스테이지 나비 커널 (CUDA)" code={butterflyCode}
          annotations={[
            { lines: [9, 10], color: 'sky', note: '스레드 ID → 나비 1개' },
            { lines: [12, 18], color: 'emerald', note: '스테이지별 인덱스 매핑' },
            { lines: [21, 28], color: 'amber', note: '나비 연산: mod p 산술' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">스테이지별 인덱스 패턴</h3>
        <p>
          스테이지가 올라갈수록 나비 쌍(a, b)의 거리가 2배씩 증가한다.<br />
          Stage 0에서는 인접 원소끼리, 마지막 스테이지에서는 n/2 거리의 원소끼리 연산한다.<br />
          큰 stride는 캐시 활용이 어려워 글로벌 메모리 대역폭이 병목이 된다.
        </p>
        <CodePanel title="n=8 나비 인덱스 예시" code={indexCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: 'stride=1: 인접 쌍' },
            { lines: [6, 7], color: 'emerald', note: 'stride=2: 2칸 건너뜀' },
            { lines: [9, 10], color: 'amber', note: 'stride=4: 절반 거리' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">호스트에서 스테이지 루프</h3>
        <p>
          가장 단순한 구현은 스테이지마다 커널을 실행하는 것이다.<br />
          커널 사이 암묵적 동기화로 스테이지 간 의존성을 해결한다. n=2^24이면 24번 실행이 필요하다.
        </p>
        <CodePanel title="호스트 루프: 스테이지별 실행" code={launchCode}
          annotations={[
            { lines: [5, 7], color: 'sky', note: '그리드/블록 크기 계산' },
            { lines: [9, 12], color: 'emerald', note: 'log_n 번 커널 실행' },
          ]} />
      </div>
    </section>
  );
}
