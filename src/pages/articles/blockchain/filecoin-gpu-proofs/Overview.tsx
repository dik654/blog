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

        {/* ── Hardware Costs ── */}
        <div className="not-prose overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">GPU</th>
                <th className="border border-border px-4 py-2 text-left">VRAM</th>
                <th className="border border-border px-4 py-2 text-left">가격</th>
                <th className="border border-border px-4 py-2 text-left">Sealing 처리량</th>
              </tr>
            </thead>
            <tbody className="text-foreground/80">
              <tr><td className="border border-border px-4 py-2 font-medium">NVIDIA A100</td><td className="border border-border px-4 py-2">80 GB</td><td className="border border-border px-4 py-2">$15,000-20,000</td><td className="border border-border px-4 py-2">10-20 sectors/day (C2 bound)</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">NVIDIA A6000</td><td className="border border-border px-4 py-2">48 GB</td><td className="border border-border px-4 py-2">$4,500-5,500</td><td className="border border-border px-4 py-2">5-10 sectors/day (A100 대비 3x slow)</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">NVIDIA RTX 4090</td><td className="border border-border px-4 py-2">24 GB</td><td className="border border-border px-4 py-2">$1,500-2,000</td><td className="border border-border px-4 py-2">2-5 sectors/day (budget)</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">AMD MI250</td><td className="border border-border px-4 py-2">128 GB</td><td className="border border-border px-4 py-2">$10,000+</td><td className="border border-border px-4 py-2">OpenCL, less optimized</td></tr>
            </tbody>
          </table>
        </div>

        {/* ── Workload Demands ── */}
        <div className="not-prose rounded-lg border border-sky-500/30 bg-sky-500/5 p-4 my-4">
          <p className="text-sm font-bold text-sky-400 mb-2">Workload Demands</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-foreground/80">
            <div><strong>PC2</strong><br />30-60 min/sector</div>
            <div><strong>C2</strong><br />30-90 min/sector</div>
            <div><strong>WindowPoSt</strong><br />20-30 min/partition</div>
            <div><strong>WinningPoSt</strong><br />20-40s (if elected)</div>
          </div>
        </div>

        {/* ── Revenue + Payback ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-bold text-emerald-400 mb-2">Revenue</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>32 GiB sector: ~$10-30/year (varies)</li>
              <li>FIL+ verified: <strong>10x reward</strong></li>
              <li>network growth에 따라 변동</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-bold text-emerald-400 mb-2">Payback</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>Hardware: $30-50K SP setup</li>
              <li>Annual revenue: $50-100K (varies)</li>
              <li><strong>1-2 year</strong> payback, GPU 5-year lifespan</li>
            </ul>
          </div>
        </div>

        {/* ── Supply + Cloud + Efficiency ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">GPU Supply</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>AI/ML 경쟁 + crypto demand</li>
              <li>H100 shortage (2023-2024)</li>
              <li>availability variable</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Cloud Alternatives</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>AWS (expensive), Lambda (moderate)</li>
              <li>Runpod (budget)</li>
              <li>on-premise economics usually better</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Efficiency</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>bellperson → SupraSeal</code>: 2-3x</li>
              <li>continuous optimization</li>
              <li>new GPUs (H100, B200)</li>
            </ul>
          </div>
        </div>

        {/* ── Future + SP Tips ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Future</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>H100 / B200 adoption</li>
              <li>ASIC proving (hypothetical), FPGA options</li>
              <li>quantum resistance (later)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-bold text-amber-400 mb-2">SP Operator Tips</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>A6000으로 시작 (cost-effective)</li>
              <li>volume 시 A100으로 scale</li>
              <li>GPU utilization 모니터링, batching critical</li>
              <li>multi-GPU workers 구성</li>
            </ul>
          </div>
        </div>

        <p className="leading-7">
          GPU economics: <strong>A100 $15-20K, 10-20 sectors/day</strong>.<br />
          1-2 year payback, 5-year lifespan.<br />
          AI/ML 경쟁으로 H100 품귀, A6000이 cost-effective.
        </p>
      </div>
    </section>
  );
}
