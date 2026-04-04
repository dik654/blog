import CodePanel from '@/components/ui/code-panel';

const builtinCode = `// CUDA 내장 변수 (커널 내부에서 사용)
threadIdx.x  threadIdx.y  threadIdx.z   // 블록 내 스레드 위치
blockIdx.x   blockIdx.y   blockIdx.z    // 그리드 내 블록 위치
blockDim.x   blockDim.y   blockDim.z    // 블록 크기 (스레드 수)
gridDim.x    gridDim.y    gridDim.z     // 그리드 크기 (블록 수)

// threadIdx : 현재 스레드가 블록 안에서 몇 번째인지
// blockIdx  : 현재 블록이 그리드 안에서 몇 번째인지
// blockDim  : 블록 하나에 스레드가 몇 개인지
// gridDim   : 그리드에 블록이 몇 개인지`;

const layoutCode = `// dim3 타입으로 커널 실행 구성 설정
// <<<gridDim, blockDim>>> 형태로 커널에 전달

// 1D 레이아웃: 벡터 연산
int N = 10000;
int blockSize = 256;
int gridSize = (N + blockSize - 1) / blockSize;  // 올림 나눗셈
kernel<<<gridSize, blockSize>>>(data, N);

// 2D 레이아웃: 행렬/이미지 연산
dim3 block2D(16, 16);          // 블록: 16x16 = 256 스레드
dim3 grid2D(
    (width  + 15) / 16,        // x방향 블록 수
    (height + 15) / 16         // y방향 블록 수
);
matKernel<<<grid2D, block2D>>>(matrix, width, height);

// 3D 레이아웃: 볼륨 데이터 (CT, MRI 등)
dim3 block3D(8, 8, 8);         // 블록: 8x8x8 = 512 스레드
dim3 grid3D(
    (dimX + 7) / 8,
    (dimY + 7) / 8,
    (dimZ + 7) / 8
);
volKernel<<<grid3D, block3D>>>(volume, dimX, dimY, dimZ);`;

export default function BuiltinVars() {
  return (
    <section id="builtin-vars" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">내장 변수와 레이아웃 설정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CUDA 커널 내부에서는 4종류의 내장 변수로 현재 스레드의 위치를 알 수 있다.
          <strong>threadIdx</strong>와 <strong>blockIdx</strong>는 위치,
          <strong>blockDim</strong>과 <strong>gridDim</strong>은 크기를 나타낸다.<br />
          모두 <code>uint3</code> 타입이며 x, y, z 필드를 가진다.
        </p>
        <CodePanel
          title="CUDA 내장 변수 4종"
          code={builtinCode}
          annotations={[
            { lines: [2, 5], color: 'sky', note: '4가지 내장 변수' },
            { lines: [7, 10], color: 'emerald', note: '각 변수의 의미' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">dim3와 커널 실행 구성</h3>
        <p>
          커널 호출 시 <code>dim3</code> 타입으로 그리드와 블록의 차원을 지정한다.
          1D에서는 정수 하나만 넘기면 되고, 2D/3D에서는 <code>dim3</code> 생성자를 사용한다.<br />
          블록 크기를 정하면 그리드 크기는 <strong>올림 나눗셈</strong>으로 계산한다.<br />
          데이터 크기가 블록 크기의 배수가 아닐 수 있으므로, 커널 내부에서 반드시 경계 검사를 해야 한다.
        </p>
        <CodePanel
          title="1D / 2D / 3D 레이아웃 설정"
          code={layoutCode}
          annotations={[
            { lines: [4, 8], color: 'sky', note: '1D: 벡터 연산' },
            { lines: [10, 16], color: 'emerald', note: '2D: 행렬/이미지' },
            { lines: [18, 24], color: 'violet', note: '3D: 볼륨 데이터' },
          ]}
        />
      </div>
    </section>
  );
}
