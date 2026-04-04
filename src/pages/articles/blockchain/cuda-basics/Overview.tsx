import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import ThreadHierarchyViz from './viz/ThreadHierarchyViz';
import CUDAKernelFlowViz from './viz/CUDAKernelFlowViz';
import ContextViz from './viz/ContextViz';

const threadHierarchyCode = `CUDA 실행 계층:

Grid (전체 작업)
+-- Block (0,0)          Block (1,0)          Block (2,0)
|   +-- Thread (0,0)     +-- Thread (0,0)     +-- ...
|   +-- Thread (1,0)     +-- Thread (1,0)
|   +-- Thread (0,1)     +-- Thread (0,1)
|   +-- ...              +-- ...
|
+-- 블록체인 비유:
    Grid    = 전체 블록 검증 작업
    Block   = 개별 트랜잭션 그룹
    Thread  = 개별 연산 (해시, 서명 검증 등)`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CUDA 기초 & 블록체인 활용</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CUDA(Compute Unified Device Architecture)는 NVIDIA GPU에서 범용 병렬 연산을 실행하기 위한 플랫폼입니다.
          <br />
          블록체인에서 GPU 가속이 필수적인 영역이 있습니다.
          <br />
          <strong>마이닝(PoW)</strong>, <strong>ZK 증명 생성</strong>, <strong>서명 검증</strong>, <strong>Filecoin Sealing(봉인)</strong> 등입니다.
        </p>

        <CitationBlock source="NVIDIA CUDA C++ Programming Guide" citeKey={1} type="paper" href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/">
          <p className="italic">"A kernel is executed in parallel by an array of threads. All threads run the same code."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">CUDA 커널 실행 흐름</h3>
        <CUDAKernelFlowViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">CUDA 프로그래밍 모델</h3>
        <ThreadHierarchyViz />

        <CodePanel title="CUDA 스레드 계층 구조" code={threadHierarchyCode}
          annotations={[
            { lines: [3, 8], color: 'sky', note: 'Grid > Block > Thread 계층' },
            { lines: [10, 13], color: 'emerald', note: '블록체인 비유' },
          ]} />

        <CitationBlock source="CUDA Kernel Launch Syntax" citeKey={2} type="code">
          <pre className="text-xs overflow-x-auto"><code>{`// 커널 호출: <<<gridDim, blockDim>>> 으로 병렬 실행 단위 지정
kernel<<<numBlocks, threadsPerBlock>>>(args);

// 블록체인 예시: 1024개 트랜잭션 서명을 256개씩 4블록으로 병렬 검증
verify_signatures<<<4, 256>>>(transactions, signatures, results);`}</code></pre>
        </CitationBlock>
      </div>
    </section>
  );
}
