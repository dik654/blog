import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import GPUMemoryViz from './viz/GPUMemoryViz';
import { memoryHierarchyCode, memoryAnnotations } from './MemoryModelData';

export default function MemoryModel() {
  return (
    <section id="memory-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메모리 계층 & 최적화</h2>
      <div className="not-prose mb-8"><GPUMemoryViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 메모리 계층</h3>

        <CitationBlock source="NVIDIA CUDA Programming Guide — Memory Hierarchy" citeKey={3} type="paper" href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#memory-hierarchy">
          <p className="italic">"CUDA threads may access data from multiple memory spaces during their execution."</p>
          <p className="mt-2 text-xs">CUDA 메모리 계층은 레지스터(per-thread) → 공유 메모리(per-block) → L1/L2 캐시 → 전역 메모리(global) 순으로 구성됩니다.</p>
        </CitationBlock>
        <CodePanel title="GPU 메모리 계층 & 블록체인 최적화" code={memoryHierarchyCode} annotations={memoryAnnotations} />
        <h3 className="text-xl font-semibold mt-6 mb-3">블록체인에서의 GPU 활용 사례</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">분야</th>
                <th className="border border-border px-4 py-2 text-left">연산</th>
                <th className="border border-border px-4 py-2 text-left">병렬화 대상</th>
                <th className="border border-border px-4 py-2 text-left">가속 효과</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PoW 마이닝', 'SHA-256/Ethash', 'nonce 탐색', '~100x vs CPU'],
                ['ZK 증명', 'MSM, NTT', '타원곡선 스칼라 곱', '~10-50x vs CPU'],
                ['서명 검증', 'ECDSA/BLS', '배치 검증', '~20x vs CPU'],
                ['Filecoin Sealing', 'Poseidon 해시', 'Merkle 트리 구축', '~5-10x vs CPU'],
              ].map(([field, op, target, effect]) => (
                <tr key={field}>
                  <td className="border border-border px-4 py-2 font-medium">{field}</td>
                  <td className="border border-border px-4 py-2">{op}</td>
                  <td className="border border-border px-4 py-2">{target}</td>
                  <td className="border border-border px-4 py-2">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
