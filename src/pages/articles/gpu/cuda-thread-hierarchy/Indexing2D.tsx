import CodePanel from '@/components/ui/code-panel';

const index2DCode = `// 2D 인덱싱: 행(row)과 열(col) 계산
//
// 블록 (16x16) 기준, blockIdx = (1, 2) 일 때:
// row = 2 * 16 + threadIdx.y = 32 + threadIdx.y
// col = 1 * 16 + threadIdx.x = 16 + threadIdx.x
//
// ┌─────────┬─────────┬─────────┐
// │ Block   │ Block   │ Block   │  gridDim.x = 3
// │ (0,0)   │ (1,0)   │ (2,0)   │
// ├─────────┼─────────┼─────────┤
// │ Block   │ Block   │ Block   │
// │ (0,1)   │*(1,1)*  │ (2,1)   │  gridDim.y = 3
// ├─────────┼─────────┼─────────┤
// │ Block   │ Block   │ Block   │
// │ (0,2)   │ (1,2)   │ (2,2)   │
// └─────────┴─────────┴─────────┘

__global__ void kernel2D(float* data, int W, int H) {
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    if (col < W && row < H) {
        int idx = row * W + col;   // Row-major 선형 인덱스
        data[idx] = data[idx] + 1.0f;
    }
}`;

const matAddCode = `// 행렬 덧셈: C[row][col] = A[row][col] + B[row][col]
// 행렬은 1D 배열로 저장 (Row-major 순서)
//
// Row-major: matrix[row][col] = array[row * width + col]
//   row=0: | a00 | a01 | a02 |
//   row=1: | a10 | a11 | a12 |  →  [a00, a01, a02, a10, a11, a12]

__global__ void matAdd(float* A, float* B, float* C,
                       int W, int H) {
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    if (col < W && row < H) {
        int idx = row * W + col;
        C[idx] = A[idx] + B[idx];
    }
}

// 호스트 코드
int W = 1920, H = 1080;        // Full HD 해상도
dim3 block(16, 16);             // 블록: 16x16 = 256 스레드
dim3 grid(
    (W + 15) / 16,              // = 120 블록
    (H + 15) / 16               // = 68 블록 → 총 8,160 블록
);
matAdd<<<grid, block>>>(d_A, d_B, d_C, W, H);
// 총 스레드: 120*16 x 68*16 = 1920 x 1088
// 실제 행렬: 1920 x 1080 → 8줄분(8*1920 = 15,360개) 스레드는 경계 검사로 제외`;

export default function Indexing2D() {
  return (
    <section id="indexing-2d" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2D 인덱싱: 행렬과 이미지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          행렬, 이미지 등 2차원 데이터에는 Block과 Grid를 모두 2D로 설정한다.
          <strong>x축은 열(col)</strong>, <strong>y축은 행(row)</strong>에 대응시키는 것이 관례다.
          1D 공식을 x, y 각각에 적용하면 <code>col = blockIdx.x * blockDim.x + threadIdx.x</code>,
          <code>row = blockIdx.y * blockDim.y + threadIdx.y</code>가 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2D 그리드와 블록 배치</h3>
        <p>
          16x16 블록이면 블록당 256개 스레드다.<br />
          경계 검사는 <code>col &lt; W && row &lt; H</code>로 두 방향 모두 확인해야 한다.
        </p>
        <CodePanel
          title="2D 인덱싱 기본 패턴"
          code={index2DCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'row, col 계산 예시' },
            { lines: [18, 19], color: 'emerald', note: '2D 인덱스 공식' },
            { lines: [21, 21], color: 'amber', note: 'Row-major 선형화' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">Row-major 메모리 레이아웃</h3>
        <p>
          C/C++과 CUDA는 행 우선(Row-major) 순서로 2D 배열을 저장한다.
          <code>matrix[row][col]</code>은 <code>array[row * width + col]</code> 주소에 매핑된다.
        </p>
        <CodePanel title="행렬 덧셈 전체 코드" code={matAddCode} annotations={[
          { lines: [3, 6], color: 'sky', note: 'Row-major 메모리 배치' },
          { lines: [10, 11], color: 'emerald', note: 'col, row 계산' },
          { lines: [19, 24], color: 'violet', note: '호스트: 그리드/블록 설정' },
          { lines: [26, 27], color: 'amber', note: '경계 검사로 제외되는 스레드' },
        ]} />
      </div>
    </section>
  );
}
