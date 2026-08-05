import { CitationBlock } from '@/components/ui/citation';
import MemoryStrategyViz from './viz/MemoryStrategyViz';
import MemoryBudgetViz from './viz/MemoryBudgetViz';
import { memoryBudgetRows } from './MemoryData';

export default function MemoryManagement() {
  return (
    <section id="memory-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU 메모리 관리 전략</h2>
      <div className="not-prose mb-8"><MemoryStrategyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GPU VRAM은 유한합니다. H100도 80GB가 한계입니다.
          <br />
          2^23 constraints의 BN254 회로를 처리하려면 CRS만 512MB, 전체 약 2.5GB가 필요합니다.
          <br />
          대규모 회로에서는 메모리 전략이 증명 속도를 좌우합니다.
        </p>
        <CitationBlock source="ICICLE — GPU ZK Acceleration Framework" citeKey={4} type="code"
          href="https://github.com/ingonyama-zk/icicle">
          <p className="text-xs">
            ICICLE 프레임워크는 pinned memory와 CUDA 스트림을 활용하여
            H2D 전송과 MSM 커널 실행을 오버랩합니다. 2^26 MSM에서 전송 오버헤드를 80% 감소시킵니다.
          </p>
        </CitationBlock>
        <div className="not-prose my-6"><MemoryBudgetViz /></div>
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU별 최대 회로 크기</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">GPU</th>
                <th className="border border-border px-4 py-2 text-left">VRAM</th>
                <th className="border border-border px-4 py-2 text-left">최대 제약</th>
                <th className="border border-border px-4 py-2 text-left">비고</th>
              </tr>
            </thead>
            <tbody>
              {memoryBudgetRows.map((r) => (
                <tr key={r.gpu}>
                  <td className="border border-border px-4 py-2 font-medium">{r.gpu}</td>
                  <td className="border border-border px-4 py-2">{r.vram}</td>
                  <td className="border border-border px-4 py-2">{r.maxConstraints}</td>
                  <td className="border border-border px-4 py-2">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          실무에서는 세 전략을 조합합니다. CRS는 GPU 메모리에 상주시키고,
          witness와 다항식은 스트림으로 전송합니다.
          <br />
          2^24를 넘는 초대형 회로는 Multi-GPU 분할이 사실상 필수입니다.
        </p>
      </div>
    </section>
  );
}
