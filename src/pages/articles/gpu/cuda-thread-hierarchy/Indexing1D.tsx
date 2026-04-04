import CodePanel from '@/components/ui/code-panel';

const indexCode = `// 1D 글로벌 인덱스 계산
//
// blockIdx.x = 2, blockDim.x = 4, threadIdx.x = 1 일 때:
// idx = 2 * 4 + 1 = 9  →  전체에서 9번째 스레드
//
// |  Block 0   |  Block 1   |  Block 2   |  Block 3   |
// | 0  1  2  3 | 4  5  6  7 | 8 [9] 10 11| 12 13 14 15|
//                              ↑ idx = 9

__global__ void kernel(float* data, int N) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < N) {           // 경계 검사 필수
        data[idx] = data[idx] * 2.0f;
    }
}`;

const vecAddCode = `// 벡터 덧셈: C[i] = A[i] + B[i]
__global__ void vecAdd(float* A, float* B, float* C, int N) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < N) {
        C[idx] = A[idx] + B[idx];
    }
}

// 호스트 코드
int N = 100000;
int blockSize = 256;
int gridSize = (N + blockSize - 1) / blockSize;  // = 391 블록

// GPU 메모리 할당
float *d_A, *d_B, *d_C;
cudaMalloc(&d_A, N * sizeof(float));
cudaMalloc(&d_B, N * sizeof(float));
cudaMalloc(&d_C, N * sizeof(float));

// 호스트 → 디바이스 복사
cudaMemcpy(d_A, h_A, N * sizeof(float), cudaMemcpyHostToDevice);
cudaMemcpy(d_B, h_B, N * sizeof(float), cudaMemcpyHostToDevice);

// 커널 실행
vecAdd<<<gridSize, blockSize>>>(d_A, d_B, d_C, N);

// 디바이스 → 호스트 복사
cudaMemcpy(h_C, d_C, N * sizeof(float), cudaMemcpyDeviceToHost);`;

export default function Indexing1D() {
  return (
    <section id="indexing-1d" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1D 인덱싱: 대규모 벡터 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          가장 기본적인 인덱싱 패턴이다.<br />
          전체 배열에서 현재 스레드가 담당할 원소의 위치를 계산하는 공식은 단 한 줄이다.
        </p>
        <p>
          <code>idx = blockIdx.x * blockDim.x + threadIdx.x</code>
        </p>
        <p>
          blockIdx.x는 몇 번째 블록인지, blockDim.x는 블록 하나의 스레드 수,
          threadIdx.x는 블록 안에서의 위치다. 세 값을 조합하면 전체 배열에서의 고유 인덱스가 나온다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">인덱스 계산 원리</h3>
        <p>
          배열 크기가 1024를 넘으면 블록 하나로 처리할 수 없다.<br />
          여러 블록으로 나누되, 마지막 블록에서는 남는 스레드가 배열 범위를 벗어날 수 있다.
          <code>if (idx &lt; N)</code> 경계 검사를 빠뜨리면 잘못된 메모리에 접근해 프로그램이 비정상 종료한다.
        </p>
        <CodePanel
          title="1D 글로벌 인덱스 계산"
          code={indexCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '인덱스 계산 예시' },
            { lines: [10, 11], color: 'emerald', note: '핵심 공식' },
            { lines: [12, 12], color: 'amber', note: '경계 검사 필수' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">완전한 벡터 덧셈 예제</h3>
        <p>
          100,000개 원소의 벡터 덧셈을 256개 스레드씩 391개 블록으로 처리한다.<br />
          총 스레드 수는 256 x 391 = 100,096개이므로 96개 스레드는 경계 검사에서 걸러진다.<br />
          메모리 할당, 복사, 커널 실행, 결과 회수까지의 전체 흐름이다.
        </p>
        <CodePanel
          title="벡터 덧셈 전체 코드"
          code={vecAddCode}
          annotations={[
            { lines: [2, 6], color: 'sky', note: '커널 함수' },
            { lines: [10, 11], color: 'emerald', note: '블록/그리드 크기 계산' },
            { lines: [14, 17], color: 'amber', note: 'GPU 메모리 할당' },
            { lines: [24, 24], color: 'violet', note: '커널 실행' },
          ]}
        />
      </div>
    </section>
  );
}
