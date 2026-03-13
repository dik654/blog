import { CitationBlock } from '../../../../components/ui/citation';
import ThreadHierarchyViz from './viz/ThreadHierarchyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CUDA 기초 & 블록체인 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CUDA(Compute Unified Device Architecture)는 NVIDIA GPU에서
          범용 병렬 연산을 실행하기 위한 플랫폼입니다.
          블록체인에서 GPU 가속은 <strong>마이닝(PoW)</strong>,
          <strong>ZK 증명 생성</strong>, <strong>서명 검증</strong>,
          <strong>Filecoin Sealing</strong> 등에 필수적입니다.
        </p>

        <CitationBlock source="NVIDIA CUDA C++ Programming Guide" citeKey={1} type="paper" href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/">
          <p className="italic text-foreground/80">"A kernel is executed in parallel by an array of threads. All threads run the same code. Each thread has an ID that it uses to compute memory addresses and make control decisions. Threads are organized into thread blocks, and blocks are organized into grids."</p>
          <p className="mt-2 text-xs">CUDA의 스레드 계층 구조는 Grid &gt; Block &gt; Thread로 구성되며, 각 레벨에서 병렬성을 확보합니다.</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">CUDA 프로그래밍 모델</h3>

        <ThreadHierarchyViz />

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`CUDA 실행 계층:

Grid (전체 작업)
├── Block (0,0)          Block (1,0)          Block (2,0)
│   ├── Thread (0,0)     ├── Thread (0,0)     ├── ...
│   ├── Thread (1,0)     ├── Thread (1,0)
│   ├── Thread (0,1)     ├── Thread (0,1)
│   └── ...              └── ...
│
└── 블록체인 비유:
    Grid    = 전체 블록 검증 작업
    Block   = 개별 트랜잭션 그룹
    Thread  = 개별 연산 (해시, 서명 검증 등)`}</code>
        </pre>

        <CitationBlock source="CUDA Kernel Launch Syntax" citeKey={2} type="code">
          <pre className="text-xs overflow-x-auto"><code>{`// 커널 호출: <<<gridDim, blockDim>>> 으로 병렬 실행 단위 지정
kernel<<<numBlocks, threadsPerBlock>>>(args);

// 블록체인 예시: 1024개 트랜잭션 서명을 256개씩 4블록으로 병렬 검증
verify_signatures<<<4, 256>>>(transactions, signatures, results);

// gridDim  = 4      → 4개 블록
// blockDim = 256    → 블록당 256 스레드
// 총 1024 스레드가 동시에 서명 검증`}</code></pre>
          <p className="mt-2 text-xs">{'<<<'}grid, block{'>>>'} 구문으로 GPU에서 실행할 스레드 구조를 결정합니다. 블록체인에서는 트랜잭션 수에 맞춰 그리드 크기를 설정합니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
