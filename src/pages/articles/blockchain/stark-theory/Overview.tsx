import M from '@/components/ui/math';
import STARKPropertyViz from './viz/STARKPropertyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STARK이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Scalable Transparent ARgument of Knowledge &mdash; 해시 함수만으로 동작, trusted setup 불필요.
        </p>
      </div>
      <div className="not-prose"><STARKPropertyViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">STARK 핵심 속성</h3>

        {/* 4 Properties */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">zkSTARK 4가지 속성 (Ben-Sasson et al. 2018)</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-sky-300">S &mdash; Scalable</p>
              <p className="text-xs text-muted-foreground mt-1">
                Prover <M>O(n \log^2 n)</M>, Verifier <M>O(\log^2 n)</M> &mdash; 대규모 computation 가능
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-emerald-300">T &mdash; Transparent</p>
              <p className="text-xs text-muted-foreground mt-1">
                Trusted setup 불필요. 공개 랜덤성(hash)만 사용
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-amber-300">AR &mdash; ARgument</p>
              <p className="text-xs text-muted-foreground mt-1">
                Computational soundness &mdash; 암호학적 가정 하에 성립
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-purple-300">K &mdash; Knowledge</p>
              <p className="text-xs text-muted-foreground mt-1">
                Witness extraction 가능 &mdash; prover가 실제로 답을 알고 있음을 보장
              </p>
            </div>
          </div>
        </div>

        {/* SNARK vs STARK 비교 테이블 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">SNARK vs STARK 비교</p>
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
                <tr className="border-b border-border/30"><td className="p-2">Proof size</td><td className="p-2">200&ndash;500 B</td><td className="p-2">50&ndash;200 KB</td></tr>
                <tr className="border-b border-border/30"><td className="p-2">Verify time</td><td className="p-2">~ms</td><td className="p-2">~10&ndash;100 ms</td></tr>
                <tr className="border-b border-border/30"><td className="p-2">Prove time</td><td className="p-2"><M>O(n \log n)</M></td><td className="p-2"><M>O(n \log^2 n)</M></td></tr>
                <tr className="border-b border-border/30"><td className="p-2">Setup</td><td className="p-2">Trusted</td><td className="p-2">Transparent</td></tr>
                <tr className="border-b border-border/30"><td className="p-2">Crypto</td><td className="p-2">Pairing / ECC</td><td className="p-2">Hash only</td></tr>
                <tr><td className="p-2">Post-quantum</td><td className="p-2">No</td><td className="p-2 text-emerald-400 font-semibold">Yes</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 사용 프로젝트 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">STARK 기반 프로젝트</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">StarkWare</p>
              <p className="text-xs text-muted-foreground mt-1">Cairo VM, StarkNet, StarkEx</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Risc0</p>
              <p className="text-xs text-muted-foreground mt-1">RISC-V zkVM</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Polygon Miden</p>
              <p className="text-xs text-muted-foreground mt-1">TurboVM</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Plonky2</p>
              <p className="text-xs text-muted-foreground mt-1">STARK + PLONK hybrid</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Winterfell</p>
              <p className="text-xs text-muted-foreground mt-1">Rust STARK library</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Stone</p>
              <p className="text-xs text-muted-foreground mt-1">Latest Cairo prover</p>
            </div>
          </div>
        </div>

        {/* 역사 타임라인 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3">STARK 연혁</p>
          <div className="space-y-1 text-sm">
            {[
              ['2018', 'STARK paper (Ben-Sasson et al.)'],
              ['2020', 'StarkEx production 출시'],
              ['2021', 'StarkNet mainnet'],
              ['2022', 'Risc0 launch'],
              ['2023', 'zkVM 경쟁 본격화'],
              ['2024', 'Stone prover 오픈소스'],
            ].map(([year, desc]) => (
              <div key={year} className="flex gap-3 items-baseline">
                <span className="text-xs font-mono text-muted-foreground w-10 shrink-0">{year}</span>
                <span className="text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Phases */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-sky-400 mb-3">STARK 증명 5단계</p>
          <div className="space-y-2 text-sm">
            {[
              ['1', 'Execution Trace', '연산을 테이블(행=스텝, 열=레지스터)로 기록'],
              ['2', 'AIR', '제약을 다항식 등식으로 표현'],
              ['3', 'LDE', 'Reed-Solomon으로 trace를 확장'],
              ['4', 'FRI', 'Low-degree proof &mdash; 재귀적 반감'],
              ['5', 'Query', 'Verifier가 random sampling으로 검증'],
            ].map(([num, title, desc]) => (
              <div key={num} className="flex gap-3 rounded border bg-card p-3">
                <span className="text-lg font-bold text-sky-400/60 w-6 shrink-0">{num}</span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5" dangerouslySetInnerHTML={{ __html: desc }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
