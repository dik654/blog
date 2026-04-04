import CodePanel from '@/components/ui/code-panel';

const batchKernel = `// 배치 Poseidon 해싱 CUDA 커널
// N개의 독립 해시 인스턴스를 동시 처리
//
// 스레드 매핑: blockIdx.x = 해시 인스턴스 ID
//              threadIdx.x = lane (0 ~ width-1)
__global__ void poseidon_batch(
    const Fp* inputs,       // [N * arity] 입력 배열
    Fp* outputs,            // [N] 출력 배열 (해시 결과)
    const Fp* round_consts, // 라운드 상수 (고정)
    const Fp* mds_matrix,   // MDS 행렬 (고정)
    int N, int arity
) {
    int hash_id = blockIdx.x;
    if (hash_id >= N) return;
    int lane = threadIdx.x;
    int width = arity + 1;

    // 공유 메모리에 상태 로드
    extern __shared__ Fp state[];
    state[0] = Fp::zero();                          // capacity
    if (lane < arity)
        state[lane + 1] = inputs[hash_id * arity + lane];

    __syncthreads();
    int rc = 0;

    // Full rounds (앞쪽 R_F/2)
    for (int r = 0; r < RF_HALF; r++) {
        full_round(state, width, lane, round_consts, rc);
        __syncthreads();
        mds_multiply(state, width, lane, mds_matrix);
        __syncthreads();
        rc += width;
    }
    // Partial rounds (R_P)
    for (int r = 0; r < RP; r++) {
        partial_round(state, width, lane, round_consts, rc);
        __syncthreads();
        mds_multiply(state, width, lane, mds_matrix);
        __syncthreads();
        rc += width;
    }
    // Full rounds (뒤쪽 R_F/2) — 동일 패턴 생략
    // ...
    if (lane == 1) outputs[hash_id] = state[1];     // 출력: state[1]
}`;

const merkleCode = `// GPU Merkle 트리: 레벨별 배치 해싱 (2-ary, 리프 8개)
//
// Level 3 (리프):  [L0] [L1] [L2] [L3] [L4] [L5] [L6] [L7]
// Level 2:         H(L0,L1)  H(L2,L3)  H(L4,L5)  H(L6,L7)  → N=4
// Level 1:         H(H01,H23)    H(H45,H67)                  → N=2
// Level 0 (루트):  H(H0123, H4567)                            → N=1
//
// Neptune: poseidon_batch<<<N, width>>> 를 레벨마다 호출
// 전체 비용: O(리프 수)  — 레벨별 N이 반감
//
// 최적화: 상위 레벨(N 작음)은 GPU 활용도 저조
// → 하위 레벨만 GPU, 상위 레벨은 CPU 처리 (하이브리드)`;

export default function BatchHash() {
  return (
    <section id="batch-hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">배치 해싱과 Merkle 트리 GPU</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          배치 해싱은 수백만 개의 독립 해시를 동시에 처리한다.<br />
          블록 하나가 해시 인스턴스 하나를 담당하고, 블록 내 스레드가 lane을 분담한다.<br />
          상태는 공유 메모리에 적재하여 라운드 간 동기화만으로 진행한다.
        </p>
        <CodePanel title="배치 Poseidon 커널" code={batchKernel} annotations={[
          { lines: [4, 5], color: 'sky', note: '스레드 매핑: 블록=해시, 스레드=lane' },
          { lines: [18, 22], color: 'emerald', note: '공유 메모리에 상태 초기화' },
          { lines: [27, 34], color: 'amber', note: 'Full + Partial 라운드 루프' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU Merkle 트리</h3>
        <p>
          Merkle 트리는 레벨별로 배치 해시를 실행한다. 리프에서 N/2, 다음 N/4로 반감된다.<br />
          Neptune은 이 패턴으로 레벨마다 커널을 호출한다.<br />
          상위 레벨은 해시 수가 적어 GPU 활용도가 떨어지므로 CPU와 분담하기도 한다.
        </p>
        <CodePanel title="GPU Merkle 트리 레벨별 구축" code={merkleCode} annotations={[
          { lines: [3, 6], color: 'sky', note: '레벨별 해시 수 반감' },
          { lines: [8, 9], color: 'emerald', note: 'Neptune: 레벨당 커널 1회' },
          { lines: [11, 12], color: 'amber', note: '하이브리드: GPU + CPU 분담' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Neptune과 ec-gpu</h3>
        <p>
          Neptune은 Filecoin의 Rust GPU Poseidon 라이브러리다.
          ec-gpu-gen의 Fp 커널 위에 Poseidon 라운드를 구성하며,
          arity 2/4/8/11에 대해 사전 계산된 MDS 행렬과 라운드 상수를 내장한다.
        </p>
      </div>
    </section>
  );
}
