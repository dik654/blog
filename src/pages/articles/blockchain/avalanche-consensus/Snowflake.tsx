import { motion } from 'framer-motion';
import { ActionBox } from '@/components/viz/boxes';

const C = { snow: '#0ea5e9', yes: '#10b981', no: '#ef4444' };

function SnowflakeViz() {
  const rounds = [
    { label: 'R1: 질의', result: '14/20 Blue', color: C.yes },
    { label: 'R2: 질의', result: '16/20 Blue', color: C.yes },
    { label: 'R3: 질의', result: '15/20 Blue', color: C.yes },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Snowflake: 연속 α번 동일 응답 시 결정</p>
      <svg viewBox="0 0 420 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {rounds.map((r, i) => (
          <motion.g key={r.label} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
            <ActionBox x={15 + i * 135} y={8} w={115} h={32}
              label={r.label} sub={r.result} color={r.color} />
            {i < 2 && (
              <motion.line x1={130 + i * 135} y1={24} x2={150 + i * 135} y2={24}
                stroke={C.snow} strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.15 + 0.2 }} />
            )}
          </motion.g>
        ))}
        <motion.text x={210} y={62} textAnchor="middle" fontSize={11}
          fill={C.yes} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 3연속 {'≥'} α → Blue로 결정!
        </motion.text>
      </svg>
    </div>
  );
}

export default function Snowflake() {
  return (
    <section id="snowflake" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Snowflake: 이진 합의</h2>
      <SnowflakeViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Snowflake = <strong>가장 단순한 형태</strong>.<br />
          매 라운드 k개 노드 샘플링 → ≥ α개 같은 값 → 선호 전환.<br />
          연속 β번 같은 값 선호 → 결정.
        </p>

        {/* ── Snowflake Algorithm ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Snowflake Algorithm 상세</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Parameters &amp; State</p>
            <p className="text-sm">
              Parameters: <code>k</code> (sample size, e.g. 20), <code>alpha</code> (quorum threshold, e.g. 14), <code>beta</code> (decision threshold, e.g. 20).<br />
              노드별 상태: <code>pref</code> (현재 선호, 0/1), <code>count</code> (연속 동일 라운드 수), <code>decided</code> (bool)
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">매 라운드 동작</p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li>k개 random nodes 샘플링</li>
              <li>각 노드의 preference 질의</li>
              <li><code>count_0</code>, <code>count_1</code> 집계</li>
              <li>Quorum 체크: <code>&ge; alpha</code>인 쪽 → 같으면 <code>count += 1</code>, 다르면 <code>pref</code> 변경 + <code>count = 1</code>. quorum 없으면 <code>count = 0</code></li>
              <li>Decision: <code>count &ge; beta</code> → <code>decided = True</code></li>
            </ol>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">Safety &amp; 한계</p>
            <p className="text-sm text-muted-foreground">
              Safety: Byzantine이 beta 라운드 속이려면 매 round alpha개 noise 필요 → probability: <code>(f/n)^(alpha*beta)</code>. alpha=14, beta=20, f/n=1/3일 때 ~10^-10.<br />
              문제: 선호가 1 quorum으로 즉시 flip — Byzantine "flip attack" 가능, count reset 빈번 → Snowball이 해결
            </p>
          </div>
        </div>
        <p className="leading-7">
          Snowflake: <strong>sample k → query → α quorum → β 연속 → decide</strong>.<br />
          safety probability ≈ (f/n)^(α×β) → 실용적 0.<br />
          단점: 선호 쉽게 바뀜 → Snowball이 해결.
        </p>

        {/* ── Parameters 영향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Parameters의 영향</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Parameter 영향 분석</p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">k (sample size)</p>
                <p className="text-muted-foreground">작으면 빠르지만 부정확, 크면 느리지만 정확. typical 10-30, Avalanche: 20. communication <code>O(k)</code> per node/round</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">alpha (quorum threshold)</p>
                <p className="text-muted-foreground">작으면 쉬운 합의 but Byzantine 취약, 크면 안전 but 느림. Avalanche: <code>14/20=70%</code>. <code>alpha/k</code> = 확실성 수준</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">beta (decision threshold)</p>
                <p className="text-muted-foreground">작으면 빠른 결정/낮은 confidence, 크면 느림/높은 confidence. beta=10 → 10^-5, beta=20 → 10^-10, beta=30 → 10^-15</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Performance &amp; Byzantine tolerance</p>
            <p className="text-sm">
              Finality: <code>beta x latency</code> — Avalanche ~20 rounds x 50ms = 1s.<br />
              Byzantine tolerance: <code>f &lt; n/3</code> provably safe, <code>f &lt; n/2</code> with higher confidence
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              실무 (Avalanche): <code>k=20, alpha=14, beta=20</code> → ~1초 finality, 4500 TPS, 수천 validators
            </p>
          </div>
        </div>
        <p className="leading-7">
          Parameters: <strong>k=20, α=14, β=20</strong> (Avalanche default).<br />
          Safety scaling: (f/n)^β → β=20이면 10^-10.<br />
          ~1초 finality, 4500 TPS 현실화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Snowflake가 BFT threshold를 안 쓰나</strong> — probabilistic safety.<br />
          BFT: 2f+1/3f+1 strict threshold (absolute).<br />
          Snowflake: α/k (statistical) — Byzantine 영향 희석.<br />
          trade-off: 확률적 but 무시 가능하게 작음.
        </p>
      </div>
    </section>
  );
}
