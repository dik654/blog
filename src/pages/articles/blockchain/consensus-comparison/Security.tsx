import { motion } from 'framer-motion';

const C = { safe: '#6366f1', live: '#10b981' };

function SecurityViz() {
  const rows = [
    { proto: 'PBFT', safety: 'n/3 미만', liveness: 'n/3 미만 + 동기', model: '부분 동기' },
    { proto: 'HotStuff', safety: 'n/3 미만', liveness: 'n/3 미만 + 동기', model: '부분 동기' },
    { proto: 'Tendermint', safety: 'n/3 미만', liveness: 'n/3 미만 + 동기', model: '부분 동기' },
    { proto: 'Avalanche', safety: '확률적', liveness: '항상', model: '확률적' },
    { proto: 'Nakamoto', safety: '51% 미만', liveness: '항상', model: '동기' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">안전성 &amp; 활성 비교</p>
      <svg viewBox="0 0 420 155" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={50} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">프로토콜</text>
        <text x={160} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>안전성 조건</text>
        <text x={280} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.live}>활성 조건</text>
        <text x={380} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">모델</text>
        <line x1={10} y1={20} x2={410} y2={20} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.proto} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
            <text x={50} y={38 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.proto}</text>
            <text x={160} y={38 + i * 24} textAnchor="middle" fontSize={10} fill={C.safe}>{r.safety}</text>
            <text x={280} y={38 + i * 24} textAnchor="middle" fontSize={10} fill={C.live}>{r.liveness}</text>
            <text x={380} y={38 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.model}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안전성 &amp; 활성</h2>
      <SecurityViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          BFT 프로토콜: <strong>f &lt; n/3</strong> 조건에서 safety 보장.<br />
          Nakamoto: 51% 이상 정직한 해시파워 가정.<br />
          Avalanche: 확률적 보장, 이론적 번복 가능성 존재.<br />
          어떤 보장이 필요한지가 프로토콜 선택의 핵심.
        </p>

        {/* ── Security Models 심층 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Security Models 심층 비교</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">3가지 Security Model</p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Deterministic BFT</p>
                <p className="text-muted-foreground">
                  Safety: always (f&lt;n/3), never fork. Liveness: partial sync (GST). 1/3+ Byzantine → halt (safety 우선).<br />
                  Threats: 33%+ stake, network partition, DDoS, long-range attack
                </p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Probabilistic (Avalanche)</p>
                <p className="text-muted-foreground">
                  Safety: <code>P ~ e^(-alpha*beta)</code>, 10^-10 typical. Liveness: always (metastable convergence).<br />
                  Threats: extreme Byzantine (&gt;50%), bad parameters, correlated failures
                </p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Nakamoto (Bitcoin)</p>
                <p className="text-muted-foreground">
                  Safety: <code>P(reorg) ~ (q/p)^k</code>, k=6 → 10^-6. Liveness: always (block production continues).<br />
                  Threats: 51% hash power, selfish mining (&gt;25%), eclipse attack
                </p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">비교 매트릭스</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">Model</th>
                    <th className="border border-border px-3 py-1.5 text-left">Safety</th>
                    <th className="border border-border px-3 py-1.5 text-left">Liveness</th>
                    <th className="border border-border px-3 py-1.5 text-left">Byzantine limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">PBFT/HotStuff</td><td className="border border-border px-3 py-1.5">Always</td><td className="border border-border px-3 py-1.5">GST</td><td className="border border-border px-3 py-1.5">33%</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Avalanche</td><td className="border border-border px-3 py-1.5">10^-10</td><td className="border border-border px-3 py-1.5">Always</td><td className="border border-border px-3 py-1.5">~50%</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Nakamoto</td><td className="border border-border px-3 py-1.5">10^-6</td><td className="border border-border px-3 py-1.5">Always</td><td className="border border-border px-3 py-1.5">51%</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Casper FFG</td><td className="border border-border px-3 py-1.5">Always</td><td className="border border-border px-3 py-1.5">Partial</td><td className="border border-border px-3 py-1.5">33%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <p className="leading-7">
          3가지 보안 모델: <strong>Deterministic, Probabilistic, Nakamoto</strong>.<br />
          BFT = mathematical safety, Avalanche = statistical, Nakamoto = exponential.<br />
          각각 다른 Byzantine limit + threat model.
        </p>

        {/* ── 실제 공격 사례 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 공격 사례와 대응</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">실제 공격 사례</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">51% Attack</p>
                <p className="text-muted-foreground">Bitcoin Gold (2018), Ethereum Classic (2019/2020), Bitcoin SV (2021). 대응: PoS 전환</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Stake concentration</p>
                <p className="text-muted-foreground">Solana 2022: 5 validators가 33% stake. Cosmos 2023: top 10이 50%+. 대응: 분산 incentive</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Selfish mining / Eclipse</p>
                <p className="text-muted-foreground">Ethereum 2015-16 연구, Bitcoin pools 우려. Eclipse: Ethereum 2015 패치. 대응: uncle reward, diverse peers</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Long-range / DDoS / Censorship</p>
                <p className="text-muted-foreground">Cosmos: weak subjectivity. Tendermint: leader DDoS 빈번. Ethereum 2022: OFAC 제재. 대응: checkpoint, view change, DAG-BFT</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">BFT 방어 기법</p>
            <ol className="text-sm list-decimal list-inside space-y-0.5">
              <li><strong>Slashing</strong>: 잘못된 행동 penalty</li>
              <li><strong>Bonding</strong>: stake lockup</li>
              <li><strong>Unbonding period</strong>: replay attack 방어</li>
              <li><strong>Social consensus</strong>: 극단 상황 hard fork</li>
              <li><strong>Weak subjectivity</strong>: trusted checkpoint</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-2">
              실무 교훈: 완벽한 보안 없음, defense in depth, 경제적 공격 비용 &gt; 이득 설계, slashing + bonding 핵심
            </p>
          </div>
        </div>
        <p className="leading-7">
          실제 공격: <strong>51%, selfish mining, long-range, censorship, DDoS</strong>.<br />
          방어: slashing, bonding, weak subjectivity, social consensus.<br />
          "경제적 공격 비용 &gt; 이득" 설계가 핵심.
        </p>

        {/* ── Quorum 수학 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Quorum 수학 정리</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Quorum 수학 정리</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">BFT (Byzantine Fault Tolerance)</p>
                <p className="text-muted-foreground"><code>n = 3f+1</code> (minimum), quorum = <code>2f+1</code>. 두 quorum 교차: <code>f+1 &ge; 1</code> honest → safety via intersection</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">CFT (Crash Fault Tolerance)</p>
                <p className="text-muted-foreground"><code>n = 2f+1</code>, quorum = <code>f+1</code>. 단순 crash만 고려 (Paxos, Raft)</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Nakamoto</p>
                <p className="text-muted-foreground">51% honest hash power, "quorum" = majority hash, probabilistic</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Avalanche</p>
                <p className="text-muted-foreground"><code>alpha/k</code> threshold (14/20=70%), beta consecutive (20), <code>P ~ e^(-alpha*beta)</code></p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">실제 숫자 (n=100)</p>
            <p className="text-sm">
              BFT: f=33, quorum=67 / CFT: f=49, quorum=51 / Nakamoto: 51% hash / Avalanche: 70% sample
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">현대: Stake-weighted BFT &amp; Committee sampling</p>
            <p className="text-sm text-muted-foreground">
              <strong>Stake-weighted</strong>: voting power = stake, 2/3+ stake threshold, absolute validator 수 무관, economic security.<br />
              <strong>Ethereum 2.0</strong>: 1M+ validators, committee 32 per slot, VRF sampling, 2/3 stake finality.<br />
              n=100 uniform stake: PBFT 33 Byzantine 필요. skewed (1 has 40%): stake-weighted에서 큰 하나 = 위험
            </p>
          </div>
        </div>
        <p className="leading-7">
          Quorum: <strong>BFT 2f+1, CFT f+1, Nakamoto 51%</strong>.<br />
          stake-weighted가 현대 표준.<br />
          Ethereum committee sampling = 1M+ validators 관리.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "safety" 우선 BFT가 주류인가</strong> — 손실 비대칭성.<br />
          Liveness 실패: 복구 가능한 불편함.<br />
          Safety 실패: 두 곳에 돈 존재 (재앙).<br />
          금융 시스템은 liveness 희생해도 safety 지킴 → BFT 선호.
        </p>
      </div>
    </section>
  );
}
