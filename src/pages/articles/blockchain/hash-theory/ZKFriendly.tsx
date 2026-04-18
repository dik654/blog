import M from '@/components/ui/math';
import ZKHashViz from './viz/ZKHashViz';

export default function ZKFriendly() {
  return (
    <section id="zk-friendly" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZK 친화 해시</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          SHA-256은 비트 연산 기반 &rarr; R1CS 제약 ~25,000.
          Poseidon은 체 연산만 사용 &rarr; ~300 제약(80배 효율).
        </p>
      </div>
      <div className="not-prose"><ZKHashViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZK-Friendly Hash Functions</h3>

        {/* 문제 */}
        <div className="not-prose rounded-lg border-l-4 border-l-red-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">문제: SHA-256을 ZK circuit에서 증명하려면</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>~25,000 R1CS constraints per hash</li>
            <li>Merkle proof 20 levels &rarr; 500,000 constraints</li>
            <li>비트 연산 (XOR, AND, ROT)이 field에서 비쌈</li>
          </ul>
        </div>

        <div className="not-prose rounded-lg border-l-4 border-l-emerald-500 bg-card p-4 mb-6">
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">해결: Field-friendly hash</div>
          <p className="text-sm text-muted-foreground">
            Field 연산만 사용 (add, mul, S-box) &rarr; Constraint 수 수백 배 감소
          </p>
        </div>

        {/* Poseidon */}
        <h4 className="text-lg font-semibold mt-5 mb-3">Poseidon Hash (2019)</h4>
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm text-muted-foreground mb-3">
            <div className="rounded bg-muted/50 p-2">Field: <M>{'\\mathbb{F}_p'}</M></div>
            <div className="rounded bg-muted/50 p-2">State: <M>t</M> elements</div>
            <div className="rounded bg-muted/50 p-2">Rounds: <M>{'R_F + R_P'}</M></div>
            <div className="rounded bg-muted/50 p-2">S-box: <M>{'x^5'}</M></div>
          </div>
          <div className="text-sm font-semibold mb-2">한 라운드</div>
          <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <div className="rounded border bg-muted/30 p-2 text-center text-sm text-muted-foreground">
              <span className="font-medium">1.</span> AddRoundConstants
            </div>
            <div className="rounded border bg-muted/30 p-2 text-center text-sm text-muted-foreground">
              <span className="font-medium">2.</span> S-box (<M>{'x^5'}</M>)
            </div>
            <div className="rounded border bg-muted/30 p-2 text-center text-sm text-muted-foreground">
              <span className="font-medium">3.</span> MixLayer (MDS matrix)
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Full rounds: 모든 element에 S-box 적용 / Partial rounds: 첫 element만.
            파라미터 (128-bit security): <M>t=3</M>, <M>{'R_F=8'}</M>, <M>{'R_P=57'}</M> &rarr; ~300 constraints per hash (80배 이상 효율).
          </p>
        </div>

        {/* 다른 ZK-friendly hashes */}
        <h4 className="text-lg font-semibold mt-5 mb-3">다른 ZK-friendly 해시</h4>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">MiMC (2016)</div>
            <p className="text-sm text-muted-foreground">최초 ZK 해시. <M>{'x^3'}</M> 또는 <M>{'x^5'}</M> S-box. 단순, 오래된 분석.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Rescue / Rescue-Prime</div>
            <p className="text-sm text-muted-foreground">STARK-friendly. Starkware 사용. S-box: <M>{'x^\\alpha'}</M> and <M>{'x^{1/\\alpha}'}</M>.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Griffin (2022)</div>
            <p className="text-sm text-muted-foreground">최신, 더 효율적. Round 수 감소.</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-1">Reinforced Concrete (2022)</div>
            <p className="text-sm text-muted-foreground">Lookup-based. Plonkish arithmetization 친화적.</p>
          </div>
        </div>

        {/* 성능 비교 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">성능 비교 (constraints per hash)</h4>
        <div className="not-prose overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2 font-semibold">해시 함수</th>
                <th className="p-2 font-semibold">Constraints</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50"><td className="p-2">SHA-256</td><td className="p-2 text-red-500">25,000+ (R1CS)</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">MiMC</td><td className="p-2">1,000~2,000</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Poseidon</td><td className="p-2 text-emerald-500">~300</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Rescue</td><td className="p-2 text-emerald-500">~288</td></tr>
              <tr className="border-b border-border/50"><td className="p-2">Griffin</td><td className="p-2 text-emerald-500">~194</td></tr>
              <tr><td className="p-2">Reinforced Concrete</td><td className="p-2 text-emerald-500">~50 (lookup tables)</td></tr>
            </tbody>
          </table>
        </div>

        {/* 사용 프로젝트 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">사용 프로젝트</h4>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Zcash</div>
            <p className="text-xs text-muted-foreground">Pedersen, Poseidon</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Aleo</div>
            <p className="text-xs text-muted-foreground">Poseidon</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Starknet</div>
            <p className="text-xs text-muted-foreground">Poseidon, Pedersen</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Mina</div>
            <p className="text-xs text-muted-foreground">Poseidon (Pasta curves)</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Filecoin</div>
            <p className="text-xs text-muted-foreground">Poseidon (SNARK proofs)</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <div className="text-sm font-semibold">Dusk Network</div>
            <p className="text-xs text-muted-foreground">Poseidon</p>
          </div>
        </div>

        {/* Trade-offs */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-2">
          <div className="text-sm font-semibold mb-2">Trade-offs</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-emerald-500/10 p-2">ZK circuit 효율</div>
            <div className="rounded bg-red-500/10 p-2">Native 계산 느림 (SHA-256 대비)</div>
            <div className="rounded bg-red-500/10 p-2">분석 역사 짧음 (보수적 파라미터)</div>
            <div className="rounded bg-red-500/10 p-2">Side-channel 공격 연구 부족</div>
          </div>
        </div>
      </div>
    </section>
  );
}
