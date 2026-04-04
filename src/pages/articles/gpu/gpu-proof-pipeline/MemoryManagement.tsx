import { CitationBlock } from '@/components/ui/citation';
import MemoryStrategyViz from './viz/MemoryStrategyViz';
import { memoryStrategyCode, memoryBudgetRows } from './MemoryData';

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
        <p>
          GPU 메모리 관리 전략:<br />
          메모리 예산 계산 (BN254, 2^23 constraints):<br />
          CRS bases (G1): 2^23 × 64B = 512 MB<br />
          CRS bases (G2): 2^23 × 128B = 1024 MB<br />
          Witness scalars: 2^23 × 32B = 256 MB<br />
          NTT workspace: 2^23 × 32B = 256 MB (×2 버퍼)<br />
          MSM buckets: 2^16 × 96B = 6 MB (per window)<br />
          합계: ~2.5 GB (G1 only) / ~3.5 GB (G1+G2)<br />
          전략 1: 스트림 처리 (Stream Processing)<br />
          for chunk in polynomial.chunks(CHUNK_SIZE):<br />
          cudaMemcpyAsync(d_chunk, chunk, H2D, stream)<br />
          {'ntt_kernel<<<grid, block, 0, stream>>>(d_chunk)'}
        </p>
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
