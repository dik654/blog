import CodePanel from '@/components/ui/code-panel';

const naiveKernel = `__global__ void matMulNaive(float *A, float *B, float *C,
                            int M, int N, int K) {
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;

    if (row < M && col < K) {
        float sum = 0.0f;
        for (int i = 0; i < N; i++) {
            sum += A[row * N + i] * B[i * K + col];
        }
        C[row * K + col] = sum;
    }
}

// 호스트 호출
dim3 blockDim(16, 16);
dim3 gridDim(ceil(K / 16.0), ceil(M / 16.0));
matMulNaive<<<gridDim, blockDim>>>(d_A, d_B, d_C, M, N, K);`;

export default function Naive() {
  return (
    <section id="naive" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">나이브 구현: 글로벌 메모리만 사용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          가장 단순한 구현입니다. 각 스레드가 A의 한 행 전체와 B의 한 열 전체를 <strong>글로벌 메모리</strong>에서 직접 읽습니다.
        </p>

        <CodePanel
          title="나이브 행렬 곱셈 커널"
          code={naiveKernel}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '글로벌 (row, col) 인덱스 계산' },
            { lines: [7, 10], color: 'emerald', note: '내적: A 행 x B 열 순회' },
            { lines: [17, 19], color: 'amber', note: '16x16 블록으로 커널 실행' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">문제: 중복 글로벌 메모리 읽기</h3>
        <p className="leading-7">
          C의 한 행에 속하는 K개의 스레드가 <strong>모두 A의 동일한 행</strong>을 읽습니다.<br />
          A의 한 원소는 K번 중복 로드됩니다.<br />
          마찬가지로 B의 한 원소는 M번 중복 로드됩니다.
        </p>

        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">항목</th>
                <th className="border border-border px-4 py-2 text-left">나이브</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['C 원소 1개 연산', '2N번 글로벌 로드 (A행 N + B열 N)'],
                ['전체 글로벌 로드', 'M * K * 2N = 2MKN회'],
                ['A 원소 재사용', '0 (매번 새로 로드)'],
                ['대역폭 병목', '연산보다 메모리가 먼저 포화'],
              ].map(([item, value]) => (
                <tr key={item}>
                  <td className="border border-border px-4 py-2 font-medium">{item}</td>
                  <td className="border border-border px-4 py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="leading-7">
          N=1024인 정사각 행렬 기준, 글로벌 메모리 로드 횟수는 약 <strong>2 * 10^9</strong>회입니다.<br />
          글로벌 메모리 대역폭(~900 GB/s)이 연산 처리량(~30 TFLOPS)보다 훨씬 먼저 포화됩니다.<br />
          이 병목을 해결하려면 공유 메모리 타일링이 필요합니다.
        </p>
      </div>
    </section>
  );
}
