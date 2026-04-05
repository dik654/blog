import { CitationBlock } from '../../../../components/ui/citation';
import GPUPipelineViz from './viz/GPUPipelineViz';
import ContextViz from './viz/ContextViz';
import { gpuRequirementRows } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 증명 시스템 & GPU 가속 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose mb-8"><GPUPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin 저장 증명 — <strong>PoRep</strong>(복제 증명) + <strong>PoSt</strong>(시공간 증명)<br />
          증명 생성에 <strong>GPU 가속</strong>이 필수적
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('bp-groth16-prover', codeRefs['bp-groth16-prover'])} />
            <span className="text-[10px] text-muted-foreground self-center">prover/native.rs</span>
            <CodeViewButton onClick={() => onCodeRef('bp-gpu-multiexp', codeRefs['bp-gpu-multiexp'])} />
            <span className="text-[10px] text-muted-foreground self-center">gpu/multiexp.rs</span>
          </div>
        )}

        <CitationBlock source="Filecoin Spec — Stacked DRG PoRep" citeKey={1} type="paper"
          href="https://spec.filecoin.io/algorithms/sdr/">
          <p className="italic">
            "SDR encoding creates 11 layers with d_drg=6 and d_exp=8 dependencies per node.
            Each 32GiB sector produces 352GiB of encoded data."
          </p>
          <p className="mt-2 text-xs">
            PC1이 CPU 전용인 이유: SDR의 각 노드가 이전 노드에 의존하는 순차적 구조이므로
            GPU 병렬 처리 이점을 활용할 수 없음
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 하드웨어 요구사항</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">단계</th>
                <th className="border border-border px-4 py-2 text-left">연산</th>
                <th className="border border-border px-4 py-2 text-left">GPU VRAM</th>
                <th className="border border-border px-4 py-2 text-left">권장 GPU</th>
              </tr>
            </thead>
            <tbody>
              {gpuRequirementRows.map((r) => (
                <tr key={r.stage}>
                  <td className="border border-border px-4 py-2 font-medium">{r.stage}</td>
                  <td className="border border-border px-4 py-2">{r.operation}</td>
                  <td className="border border-border px-4 py-2">{r.vram}</td>
                  <td className="border border-border px-4 py-2">{r.gpu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── GPU Economics ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU Economics for Filecoin SP</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GPU Investment for Filecoin SP:

// Hardware costs (2024):
// - NVIDIA A100 (80GB): $15,000-20,000
// - NVIDIA A6000 (48GB): $4,500-5,500
// - NVIDIA RTX 4090 (24GB): $1,500-2,000
// - AMD MI250 (128GB): $10,000+

// Workload demands:
// - PC2 (per sector): 30-60 min
// - C2 (per sector): 30-90 min
// - WindowPoSt (per partition): 20-30 min
// - WinningPoSt (if elected): 20-40s

// Sealing throughput:
// A100 (80GB):
// - 10-20 sectors/day/GPU (C2 bound)
// - + WindowPoSt duty
//
// A6000:
// - 5-10 sectors/day/GPU
// - 3x slower than A100
//
// RTX 4090:
// - 2-5 sectors/day/GPU
// - budget option

// Revenue per sector:
// - 32 GiB sector: ~$10-30/year (varies)
// - network growth impacts
// - FIL+ verified: 10x reward

// Payback:
// - Hardware: $30-50K SP setup
// - Annual revenue: $50-100K (varies)
// - 1-2 year payback
// - GPU 5-year lifespan

// GPU supply constraints:
// - AI/ML competition
// - H100 shortage (2023-2024)
// - crypto demand
// - availability variable

// Cloud alternatives:
// - AWS (expensive)
// - Lambda Labs (moderate)
// - Runpod (budget)
// - on-premise economics usually better

// Efficiency improvements:
// - bellperson → SupraSeal: 2-3x
// - wider adoption
// - continuous optimization
// - new GPUs (H100, B200)

// Future:
// - H100/B200 adoption
// - ASIC proving (hypothetical)
// - FPGA options
// - quantum resistance (later)

// SP operator tips:
// - start with A6000 (cost-effective)
// - scale to A100 at volume
// - monitor GPU utilization
// - batching critical
// - multi-GPU workers`}
        </pre>
        <p className="leading-7">
          GPU economics: <strong>A100 $15-20K, 10-20 sectors/day</strong>.<br />
          1-2 year payback, 5-year lifespan.<br />
          AI/ML 경쟁으로 H100 품귀, A6000이 cost-effective.
        </p>
      </div>
    </section>
  );
}
