import M from '@/components/ui/math';
import ComparisonViz from './viz/ComparisonViz';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SNARK vs STARK</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          SNARK = 작은 proof + 타원곡선 의존. STARK = 큰 proof + 양자 내성 + 투명 셋업.
        </p>
      </div>
      <div className="not-prose"><ComparisonViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SNARK vs STARK 상세 비교</h3>

        {/* 기술 비교 테이블 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">기술 비교</p>
          <div className="overflow-x-auto text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-2 text-muted-foreground">측면</th>
                  <th className="text-left p-2 text-muted-foreground">SNARK</th>
                  <th className="text-left p-2 text-muted-foreground">STARK</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b border-border/30">
                  <td className="p-2 font-semibold">Proof Size</td>
                  <td className="p-2">Groth16 ~200 B / PLONK ~500 B / Halo2 ~1 KB</td>
                  <td className="p-2">50&ndash;200 KB (SNARK 대비 ~1000배)</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 font-semibold">Verify Time</td>
                  <td className="p-2">3&ndash;10 ms</td>
                  <td className="p-2">10&ndash;100 ms</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 font-semibold">Prove Time</td>
                  <td className="p-2"><M>O(n \log n)</M></td>
                  <td className="p-2"><M>O(n \log^2 n)</M></td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 font-semibold">Crypto Assumption</td>
                  <td className="p-2">DLP, ECC, Pairing</td>
                  <td className="p-2">Hash only (SHA-256, BLAKE)</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 font-semibold">Post-quantum</td>
                  <td className="p-2 text-red-400">BROKEN</td>
                  <td className="p-2 text-emerald-400 font-semibold">SECURE</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Trusted Setup</td>
                  <td className="p-2">Required (Groth16: per-circuit / PLONK: universal)</td>
                  <td className="p-2 text-emerald-400">Not required (transparent)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 실무 선택 기준 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">실무 선택 기준</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border bg-card p-3 border-sky-500/30">
              <p className="font-semibold text-sky-300 text-xs mb-2">SNARK 선호</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>온체인 검증 비용 최소화</p>
                <p>Ethereum L1 (gas 제약)</p>
                <p>짧은 proof 필수</p>
              </div>
              <p className="text-xs text-sky-400 mt-2">zkSync, Scroll, Polygon zkEVM</p>
            </div>
            <div className="rounded border bg-card p-3 border-emerald-500/30">
              <p className="font-semibold text-emerald-300 text-xs mb-2">STARK 선호</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Trusted setup 회피</p>
                <p>Post-quantum 보안</p>
                <p>대규모 computation</p>
                <p>투명성 중요</p>
              </div>
              <p className="text-xs text-emerald-400 mt-2">StarkNet, Risc0, Polygon Miden</p>
            </div>
            <div className="rounded border bg-card p-3 border-purple-500/30">
              <p className="font-semibold text-purple-300 text-xs mb-2">Hybrid</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Plonky2: FRI + PLONK</p>
                <p>Groth16 wrapper for STARK</p>
                <p>Recursive composition</p>
              </div>
            </div>
          </div>
        </div>

        {/* 생태계 프로젝트 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">생태계 주요 프로젝트</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs text-sky-300 mb-2">SNARK 기반</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <p>zkSync (PLONK)</p>
                <p>Scroll (PLONK)</p>
                <p>Polygon zkEVM</p>
                <p>Aztec (PLONK)</p>
                <p>Aleo (Marlin)</p>
                <p>Mina (Pickles)</p>
              </div>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs text-emerald-300 mb-2">STARK 기반</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <p>StarkNet (Cairo)</p>
                <p>Polygon Miden</p>
                <p>Risc0 (RISC-V)</p>
                <p>Plonky2 (Polygon)</p>
                <p>Winterfell</p>
                <p>Kimchi (Mina)</p>
              </div>
            </div>
          </div>
        </div>

        {/* 미래 방향 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3">미래 방향</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">ZK Accelerators</p>
              <p className="text-xs text-muted-foreground mt-1">GPU, FPGA, ASIC</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Folding Schemes</p>
              <p className="text-xs text-muted-foreground mt-1">Nova, HyperNova, ProtoStar</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Lookup Optimization</p>
              <p className="text-xs text-muted-foreground mt-1">Lookup-based 제약 최적화</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">Post-quantum SNARKs</p>
              <p className="text-xs text-muted-foreground mt-1">Lattice 기반</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">zkML</p>
              <p className="text-xs text-muted-foreground mt-1">AI + ZK 융합</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
