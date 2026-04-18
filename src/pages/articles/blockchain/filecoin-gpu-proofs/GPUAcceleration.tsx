import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '../../../../components/ui/citation';
import BellpersonViz from './viz/BellpersonViz';
import MSMAccelFlowViz from './viz/MSMAccelFlowViz';
import { bellpersonCode, ssparkCode } from './GPUAccelerationData';
import { neptuneCode, rustFilProofsCode, ecGpuSupraSealCode } from './GPUAccelerationData2';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function GPUAcceleration({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="gpu-acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU 가속 라이브러리 & 구현</h2>
      <div className="not-prose mb-8"><BellpersonViz /></div>
      <div className="not-prose mb-8"><MSMAccelFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">bellperson (GPU Groth16)</h3>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('bp-gpu-multiexp', codeRefs['bp-gpu-multiexp'])} />
            <span className="text-[10px] text-muted-foreground self-center">gpu/multiexp.rs</span>
            <CodeViewButton onClick={() => onCodeRef('bp-groth16-prover', codeRefs['bp-groth16-prover'])} />
            <span className="text-[10px] text-muted-foreground self-center">prover/native.rs</span>
            <CodeViewButton onClick={() => onCodeRef('bp-verifier', codeRefs['bp-verifier'])} />
            <span className="text-[10px] text-muted-foreground self-center">verifier.rs</span>
          </div>
        )}
        <CodePanel title="bellperson GPU 가속 연산" code={bellpersonCode} annotations={[
          { lines: [5, 10], color: 'sky', note: 'MSM 핵심 연산' },
          { lines: [12, 15], color: 'emerald', note: 'NTT/FFT 다항식 곱셈' },
          { lines: [17, 26], color: 'amber', note: 'GPU 백엔드 구조' },
        ]} />
        <CitationBlock source="bellperson — src/gpu/multiexp.rs (MSM CUDA)" citeKey={2} type="code"
          href="https://github.com/filecoin-project/bellperson">
          <div className="not-prose mt-2">
            <p className="text-xs font-semibold text-foreground mb-2"><code>multiexp_gpu()</code> — Pippenger Bucket Method on GPU</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-sky-500/30 bg-sky-500/5 p-2">
                <p className="font-semibold text-sky-600 dark:text-sky-400">1. Window 분할</p>
                <p className="text-muted-foreground mt-1">scalars를 c-bit windows로 분할</p>
              </div>
              <div className="rounded border border-emerald-500/30 bg-emerald-500/5 p-2">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">2. Bucket 누적</p>
                <p className="text-muted-foreground mt-1">각 window의 bucket에 bases를 GPU 병렬 누적</p>
              </div>
              <div className="rounded border border-amber-500/30 bg-amber-500/5 p-2">
                <p className="font-semibold text-amber-600 dark:text-amber-400">3. 계층 합산</p>
                <p className="text-muted-foreground mt-1">bucket 결과를 계층적으로 합산 → 최종 결과</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              2²⁶ points: ~2.8s on A10, ~800x faster than CPU.
              Groth16 증명의 80%+ 가 MSM 연산 → GPU 가속의 핵심.
            </p>
          </div>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Supranational sppark</h3>
        <CodePanel title="sppark CUDA ZK 프리미티브" code={ssparkCode} annotations={[
          { lines: [5, 9], color: 'sky', note: 'CUDA MSM 구현' },
          { lines: [11, 15], color: 'emerald', note: 'CUDA NTT 구현' },
          { lines: [17, 22], color: 'amber', note: '성능 벤치마크' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">Neptune (Poseidon 해시 GPU)</h3>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('bp-generator', codeRefs['bp-generator'])} />
            <span className="text-[10px] text-muted-foreground self-center">generator.rs</span>
            <CodeViewButton onClick={() => onCodeRef('bp-proof', codeRefs['bp-proof'])} />
            <span className="text-[10px] text-muted-foreground self-center">proof.rs</span>
          </div>
        )}
        <CodePanel title="Neptune Poseidon 해시 가속" code={neptuneCode} annotations={[
          { lines: [4, 7], color: 'sky', note: 'Poseidon 해시 ZK 효율' },
          { lines: [16, 19], color: 'emerald', note: 'GPU 배치 해싱' },
        ]} />
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 활용 경로</h3>
        <p>
          <strong>PC2</strong> — storage-proofs-porep → generate_tree_c / generate_tree_r_last → Neptune(Poseidon GPU)<br />
          <strong>C2</strong> — storage-proofs-porep → bellperson(MSM/NTT GPU) → Groth16 증명 생성<br />
          <strong>PoSt</strong> — storage-proofs-post → bellperson → WinningPoSt/WindowPoSt 증명
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Lotus → Rust GPU 의존성 체인</h3>
        <p>
          <strong>Lotus(Go)</strong> → filecoin-ffi(CGo) → <strong>rust-fil-proofs</strong><br />
          → bellperson → blstrs → blst(ASM) — BLS12-381 산술<br />
          → <strong>ec-gpu-gen</strong> — 빌드 타임에 CUDA/OpenCL 커널 코드 생성<br />
          → <strong>sppark</strong> — CUDA 템플릿 기반 MSM/NTT (bellperson 대비 2~3배 빠름)
        </p>

        {/* ── GPU Performance Comparison ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GPU 성능 비교 (실측)</h3>

        {/* ── C2 Proving Benchmark Table ── */}
        <div className="not-prose overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">GPU</th>
                <th className="border border-border px-4 py-2 text-left">VRAM</th>
                <th className="border border-border px-4 py-2 text-left">bellperson</th>
                <th className="border border-border px-4 py-2 text-left">SupraSeal</th>
                <th className="border border-border px-4 py-2 text-left">비고</th>
              </tr>
            </thead>
            <tbody className="text-foreground/80">
              <tr><td className="border border-border px-4 py-2 font-medium">CPU only (EPYC 7B13)</td><td className="border border-border px-4 py-2">-</td><td className="border border-border px-4 py-2">4-8 hours</td><td className="border border-border px-4 py-2">-</td><td className="border border-border px-4 py-2">baseline</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">RTX 3090</td><td className="border border-border px-4 py-2">24 GB</td><td className="border border-border px-4 py-2">60-90 min</td><td className="border border-border px-4 py-2">30-45 min</td><td className="border border-border px-4 py-2">budget</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">A6000</td><td className="border border-border px-4 py-2">48 GB</td><td className="border border-border px-4 py-2">45-75 min</td><td className="border border-border px-4 py-2">30-45 min</td><td className="border border-border px-4 py-2">cost-effective</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">A100</td><td className="border border-border px-4 py-2">40/80 GB</td><td className="border border-border px-4 py-2">30-60 min</td><td className="border border-border px-4 py-2">20-30 min</td><td className="border border-border px-4 py-2">professional</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">H100</td><td className="border border-border px-4 py-2">80 GB</td><td className="border border-border px-4 py-2">25-40 min</td><td className="border border-border px-4 py-2">15-25 min</td><td className="border border-border px-4 py-2">latest (2023-)</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">B200</td><td className="border border-border px-4 py-2">192 GB HBM3e</td><td className="border border-border px-4 py-2">-</td><td className="border border-border px-4 py-2">&lt;15 min (est.)</td><td className="border border-border px-4 py-2">highest tier</td></tr>
              <tr><td className="border border-border px-4 py-2 font-medium">AMD MI250</td><td className="border border-border px-4 py-2">128 GB HBM2e</td><td className="border border-border px-4 py-2">40-60 min</td><td className="border border-border px-4 py-2">-</td><td className="border border-border px-4 py-2">OpenCL, less optimized</td></tr>
            </tbody>
          </table>
        </div>

        {/* ── Scaling + Library Evolution ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="text-sm font-bold text-sky-400 mb-2">Multi-GPU Scaling</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>multi-GPU: <strong>near-linear</strong> scaling</li>
              <li>PCIe bandwidth matters</li>
              <li>NVLink for A100 pairs</li>
              <li>shared CPU overhead 고려</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Library Evolution</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>bellman</code> (2018) — baseline CPU</li>
              <li><code>bellperson</code> (2020) — GPU backend</li>
              <li><code>SupraSeal</code> (2023) — <strong>2-3x faster</strong></li>
              <li>future — FPGA / ASIC?</li>
            </ul>
          </div>
        </div>

        {/* ── 선택 기준 + 네트워크 + 트렌드 ── */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm font-bold text-amber-400 mb-2">선택 기준</p>
            <ol className="text-sm space-y-1 text-foreground/80 list-decimal list-inside">
              <li>Budget — RTX 4090, A6000</li>
              <li>Professional — A100</li>
              <li>Cutting-edge — H100, B200</li>
              <li>Volume — multi-A100 clusters</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">Network Impact</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>전체 GPU 수: ~100,000+ (추정)</li>
              <li>매일 증명: 100K+ SNARKs</li>
              <li><strong>최대 GPU 소비 블록체인</strong></li>
              <li>AI/ML과 GPU 경쟁</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-bold text-foreground mb-2">2024 트렌드</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>SupraSeal adoption 확산</li>
              <li>H100 점진 도입</li>
              <li>on-premise 선호</li>
              <li>클라우드는 SLO 이슈</li>
            </ul>
          </div>
        </div>

        <p className="leading-7">
          GPU 성능: <strong>RTX 3090 (60min) → A100 (30min) → H100 (25min)</strong>.<br />
          SupraSeal이 bellperson 대비 2-3x 빠름.<br />
          전체 Filecoin: 100K+ GPUs, 최대 GPU 소비 체인.
        </p>
      </div>
    </section>
  );
}
