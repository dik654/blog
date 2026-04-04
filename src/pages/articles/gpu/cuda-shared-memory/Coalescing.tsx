import CodePanel from '@/components/ui/code-panel';

const coalescingCode = `글로벌 메모리 Coalescing 원리:

워프(32 스레드)의 메모리 요청을 하나의 트랜잭션으로 합침
조건: 연속 스레드 → 연속 주소, 정렬(aligned)

트랜잭션 크기: 32B / 64B / 128B (L1 캐시 라인)

Coalesced (이상적):
  Thread 0 → addr[0]   Thread 1 → addr[1]   ...  Thread 31 → addr[31]
  → 128B 트랜잭션 1회 (float × 32 = 128B)

Non-coalesced (최악):
  Thread 0 → addr[0]   Thread 1 → addr[1000]  ...
  → 스레드마다 별도 트랜잭션, 최대 32회 접근`;

const matrixAccessCode = `// 행렬 M[Height][Width], row-major 저장
// M[row][col] → M[row * Width + col]

// 좋음: 행(row) 접근 — 연속 스레드가 연속 주소
__global__ void rowAccess(float* M, float* out, int W) {
  int row = blockIdx.x;
  int col = threadIdx.x;         // 연속 스레드 → 연속 col
  out[row * W + col] = M[row * W + col];  // coalesced!
}
// Thread 0 → M[row][0], Thread 1 → M[row][1], ...
// 메모리 상 연속 → 1회 트랜잭션

// 나쁨: 열(column) 접근 — 연속 스레드가 stride=Width 간격
__global__ void colAccess(float* M, float* out, int W) {
  int col = blockIdx.x;
  int row = threadIdx.x;         // 연속 스레드 → stride=W
  out[row * W + col] = M[row * W + col];  // non-coalesced!
}
// Thread 0 → M[0][col], Thread 1 → M[1][col], ...
// 메모리 상 W칸 간격 → 32회 트랜잭션`;

const fixCode = `// 해결: 공유 메모리로 전치(transpose)

__global__ void colAccessFixed(float* M, float* out, int W, int H) {
  __shared__ float tile[BLOCK][BLOCK];

  int bx = blockIdx.x * BLOCK;
  int by = blockIdx.y * BLOCK;

  // 1단계: 행 방향으로 글로벌 → 공유 (coalesced 로드)
  tile[threadIdx.y][threadIdx.x] = M[(by + threadIdx.y) * W + bx + threadIdx.x];
  __syncthreads();

  // 2단계: 전치된 위치에서 공유 → 글로벌 (coalesced 저장)
  out[(bx + threadIdx.y) * H + by + threadIdx.x] = tile[threadIdx.x][threadIdx.y];
}
// 글로벌 접근은 항상 coalesced
// 공유 메모리에서 전치 처리 (뱅크 충돌은 패딩으로 해결)`;

export default function Coalescing() {
  return (
    <section id="coalescing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">글로벌 메모리 Coalescing</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          글로벌 메모리(DRAM)는 <strong>레이턴시가 400-800 사이클</strong>로 느리다.<br />
          하드웨어가 같은 워프의 메모리 요청을 <strong>하나의 트랜잭션으로 합치는 것</strong>이 coalescing이다.<br />
          이 조건을 만족하면 대역폭 활용률이 최대가 된다.
        </p>
        <CodePanel title="Coalescing 원리와 트랜잭션 크기" code={coalescingCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '핵심 조건: 연속 + 정렬' },
            { lines: [8, 10], color: 'emerald', note: 'Coalesced: 1회 트랜잭션' },
            { lines: [12, 14], color: 'rose', note: 'Non-coalesced: 최대 32회' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">행렬 접근 패턴: Row vs Column</h3>
        <p>
          row-major 행렬에서 행 방향 접근은 coalesced, 열 방향 접근은 non-coalesced이다.
          <br />
          열 접근이 필요하면 <strong>공유 메모리 타일링</strong>으로 해결한다.
        </p>
        <CodePanel title="행(Row) 접근 vs 열(Column) 접근" code={matrixAccessCode}
          annotations={[
            { lines: [4, 9], color: 'emerald', note: '행 접근: coalesced' },
            { lines: [10, 11], color: 'emerald', note: '연속 주소 → 1회 트랜잭션' },
            { lines: [13, 18], color: 'rose', note: '열 접근: non-coalesced' },
            { lines: [19, 20], color: 'rose', note: 'stride=W → 32회 트랜잭션' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">공유 메모리 전치로 해결</h3>
        <CodePanel title="공유 메모리 타일 전치" code={fixCode}
          annotations={[
            { lines: [4, 4], color: 'sky', note: '공유 메모리 타일 선언' },
            { lines: [9, 10], color: 'emerald', note: '글로벌→공유: coalesced 로드' },
            { lines: [13, 14], color: 'amber', note: '공유→글로벌: 전치 후 coalesced 저장' },
            { lines: [16, 17], color: 'violet', note: '양방향 모두 coalesced 달성' },
          ]} />
      </div>
    </section>
  );
}
