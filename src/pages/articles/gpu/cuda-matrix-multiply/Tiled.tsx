import CodePanel from '@/components/ui/code-panel';

const tiledKernel = `#define TILE_SIZE 16

__global__ void matMulTiled(float *A, float *B, float *C,
                            int M, int N, int K) {
    __shared__ float tileA[TILE_SIZE][TILE_SIZE];
    __shared__ float tileB[TILE_SIZE][TILE_SIZE];

    int row = blockIdx.y * TILE_SIZE + threadIdx.y;
    int col = blockIdx.x * TILE_SIZE + threadIdx.x;
    float sum = 0.0f;

    for (int t = 0; t < (N + TILE_SIZE - 1) / TILE_SIZE; t++) {
        // Phase 1: 글로벌 -> 공유 메모리 로드
        int aCol = t * TILE_SIZE + threadIdx.x;
        int bRow = t * TILE_SIZE + threadIdx.y;
        tileA[threadIdx.y][threadIdx.x] =
            (row < M && aCol < N) ? A[row * N + aCol] : 0.0f;
        tileB[threadIdx.y][threadIdx.x] =
            (bRow < N && col < K) ? B[bRow * K + col] : 0.0f;

        __syncthreads();  // 모든 스레드가 로드 완료될 때까지 대기

        // Phase 2: 공유 메모리에서 부분 내적 계산
        for (int i = 0; i < TILE_SIZE; i++)
            sum += tileA[threadIdx.y][i] * tileB[i][threadIdx.x];

        __syncthreads();  // 다음 타일 로드 전 계산 완료 보장
    }
    if (row < M && col < K)
        C[row * K + col] = sum;
}`;

export default function Tiled() {
  return (
    <section id="tiled" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">타일링: 공유 메모리 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          A와 B를 <strong>TILE_SIZE x TILE_SIZE</strong> 크기의 서브 행렬(타일)로 분할합니다.<br />
          각 블록의 스레드들이 협력하여 타일 하나를 공유 메모리에 로드한 뒤,
          그 데이터를 TILE_SIZE번 재사용하여 부분 내적을 계산합니다.
        </p>

        <CodePanel
          title="타일링 행렬 곱셈 커널"
          code={tiledKernel}
          annotations={[
            { lines: [7, 8], color: 'sky', note: '공유 메모리 타일 선언' },
            { lines: [16, 21], color: 'emerald', note: 'Phase 1: 글로벌 -> 공유 메모리 로드' },
            { lines: [23, 23], color: 'amber', note: '__syncthreads: 로드 완료 동기화' },
            { lines: [26, 27], color: 'violet', note: 'Phase 2: 공유 메모리에서 내적 계산' },
            { lines: [29, 29], color: 'rose', note: '다음 타일 전 계산 완료 동기화' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 효과적인가</h3>
        <p className="leading-7">
          블록 하나에 TILE_SIZE x TILE_SIZE개의 스레드가 있습니다.<br />
          이 스레드들이 <strong>협력하여 타일 한 장을 한 번만 로드</strong>하면,
          그 데이터를 블록 내 모든 스레드가 공유 메모리에서 반복 접근합니다.
        </p>
        <p className="leading-7">
          공유 메모리 접근 지연은 약 <strong>5ns</strong>로,
          글로벌 메모리(~200-400 사이클, 약 200ns)보다 약 40배 빠릅니다.<br />
          글로벌 메모리 로드를 TILE_SIZE배 줄이면서, 나머지 접근은 전부 공유 메모리에서 처리합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">__syncthreads()의 역할</h3>
        <p className="leading-7">
          첫 번째 __syncthreads()는 타일 로드 완료를 보장합니다.<br />
          이것이 없으면 일부 스레드가 아직 로드하지 않은 공유 메모리 값을 읽을 수 있습니다.
          <br />
          두 번째 __syncthreads()는 계산 완료를 보장합니다.<br />
          이것이 없으면 다음 반복에서 이전 타일 데이터를 덮어쓰기 전에 읽기가 끝나지 않을 수 있습니다.
        </p>
      </div>
    </section>
  );
}
