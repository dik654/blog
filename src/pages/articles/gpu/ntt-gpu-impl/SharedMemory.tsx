import CodePanel from '@/components/ui/code-panel';
import HybridStrategyViz from './viz/HybridStrategyViz';
import BankConflictViz from './viz/BankConflictViz';

const sharedKernelCode = `__global__ void ntt_shared_stages(
    uint64_t* data, const uint64_t* twiddles,
    int n, int start_stage, int end_stage, uint64_t p) {
    __shared__ uint64_t s[BLOCK_SIZE + 1]; // +1 패딩: 뱅크 충돌 방지
    int base = blockIdx.x * BLOCK_SIZE, lid = threadIdx.x;

    s[lid] = data[base + lid];                       // coalesced 로드
    s[lid + BLOCK_SIZE/2] = data[base + lid + BLOCK_SIZE/2];
    __syncthreads();

    for (int stage = start_stage; stage < end_stage; stage++) {
        int half = 1 << stage, group = half << 1;
        int gid = lid / half, pid = lid % half;
        int a_idx = gid * group + pid, b_idx = a_idx + half;
        uint64_t w = twiddles[pid * (n >> (stage + 1))];
        uint64_t a = s[a_idx], b = s[b_idx];
        uint64_t wb = mul_mod(w, b, p);
        s[a_idx] = add_mod(a, wb, p);
        s[b_idx] = sub_mod(a, wb, p);
        __syncthreads();  // 스테이지 간 블록 내 동기화
    }
    data[base + lid] = s[lid];                       // 글로벌 저장
    data[base + lid + BLOCK_SIZE/2] = s[lid + BLOCK_SIZE/2];
}`;

export default function SharedMemory() {
  return (
    <section id="shared-memory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">공유 메모리 전략과 뱅크 충돌 회피</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          NTT GPU 최적화의 핵심은 작은 stride 스테이지를 공유 메모리에서 한 번에 처리하는 것이다.<br />
          글로벌 메모리 왕복을 1회로 줄이고, 블록 내 __syncthreads()로 스테이지 간 동기화를 처리한다.
        </p>
        <CodePanel title="공유 메모리 다중-스테이지 NTT 커널" code={sharedKernelCode}
          annotations={[
            { lines: [4, 4], color: 'sky', note: '+1 패딩: 뱅크 충돌 방지' },
            { lines: [7, 8], color: 'emerald', note: 'coalesced 로드' },
            { lines: [11, 20], color: 'amber', note: '다중 스테이지 루프' },
            { lines: [22, 23], color: 'violet', note: '글로벌 저장' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">하이브리드 전략</h3>
        <p>
          전체 스테이지를 두 구간으로 나눈다. 작은 스테이지는 공유 메모리 커널 1회, 큰 스테이지는 글로벌 커널을 스테이지마다 실행한다.
        </p>
        <HybridStrategyViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">uint64_t 뱅크 충돌</h3>
        <p>
          NTT는 64비트 정수 연산이다. uint64_t가 2개 뱅크를 점유하므로 16번째 스레드에서 충돌이 발생한다.<br />
          배열에 +1 패딩을 추가하면 주소 매핑이 어긋나 충돌을 방지한다.
        </p>
        <BankConflictViz />
      </div>
    </section>
  );
}
