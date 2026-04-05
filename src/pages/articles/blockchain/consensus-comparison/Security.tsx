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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Security Model별 비교:

// Deterministic BFT (PBFT, HotStuff, Tendermint):
//
// Safety:
// - always (under f<n/3)
// - never fork
// - never conflicting commits
// - mathematical proof
//
// Liveness:
// - partial sync (GST required)
// - GST 후 eventually progress
// - 1/3+ Byzantine → halt (safety 우선)
//
// Threats:
// - 33%+ Byzantine stake: safety violation
// - Network partition: liveness halt
// - DDoS: liveness halt
// - Long-range attack: PoS only (slashing)

// Probabilistic BFT (Avalanche):
//
// Safety:
// - P(violation) ~ e^(-α*β)
// - 10^-10 with α=14, β=20
// - practical safety
// - not mathematical zero
//
// Liveness:
// - always (probabilistic)
// - metastable convergence
// - async network OK (randomization)
//
// Threats:
// - extreme Byzantine (>50%): real threat
// - bad parameters: safety weakened
// - correlated failures: unknown
// - academic vulnerabilities possible

// Nakamoto (Bitcoin):
//
// Safety:
// - P(reorg) ~ (q/p)^k (exponential)
// - k=6: 10^-6 (0.0001%)
// - probabilistic but small
// - assumes honest majority (51%)
//
// Liveness:
// - always (block production continues)
// - network partition: both chains grow
// - eventual consistency
//
// Threats:
// - 51% hash power: double spend
// - selfish mining: >25%
// - eclipse attack: isolated victim
// - weak block timing

// 비교 매트릭스:
//
// Model            | Safety  | Liveness | Byzantine limit
// -----------------|---------|----------|----------------
// PBFT/HotStuff    | Always  | GST      | 33%
// Tendermint       | Always  | GST      | 33%
// Avalanche        | 10^-10  | Always   | ~50%
// Nakamoto         | 10^-6   | Always   | 51%
// Casper FFG       | Always  | Partial  | 33%
// PoS BFT          | Always  | GST      | 33% (stake)`}
        </pre>
        <p className="leading-7">
          3가지 보안 모델: <strong>Deterministic, Probabilistic, Nakamoto</strong>.<br />
          BFT = mathematical safety, Avalanche = statistical, Nakamoto = exponential.<br />
          각각 다른 Byzantine limit + threat model.
        </p>

        {/* ── 실제 공격 사례 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 공격 사례와 대응</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 실제 공격 사례:

// 1. 51% Attack (Nakamoto):
// - Bitcoin Gold (2018): 1800 BTG 이중지불
// - Ethereum Classic (2019, 2020): 여러 차례
// - Bitcoin SV (2021): large reorg
// - 대응: 소형 chain은 PoS로 전환

// 2. BFT stake concentration:
// - Solana 2022: 5 validators가 33% stake
// - Cosmos 2023: top 10이 50%+
// - 대응: stake 분산 incentive

// 3. Selfish mining:
// - Ethereum 2015-2016: 이론 연구
// - Bitcoin mining pools: 지속 우려
// - 대응: uncle reward (GHOST)

// 4. Long-range attack (PoS):
// - Cosmos: 완전 방어 없음 (weak subjectivity)
// - Ethereum 2.0: checkpoint 기반
// - 대응: trusted checkpoint

// 5. Eclipse attack:
// - Ethereum 2015: 발견, 패치
// - 대응: 다양한 peer source

// 6. DDoS on leader:
// - Tendermint: 빈번
// - 대응: view change

// 7. Censorship:
// - Ethereum 2022: OFAC 제재
// - 대응: DAG-BFT (모든 validator propose)

// 8. Validator failures:
// - Celestia 2023: 50%+ temporary halt
// - 대응: async fallback

// BFT 방어 기법:
// 1. Slashing: 잘못된 행동 penalty
// 2. Bonding: stake lockup
// 3. Unbonding period: reply attack 방어
// 4. Social consensus: 극단 상황 hard fork
// 5. Weak subjectivity: trusted checkpoint

// 실무 교훈:
// - 완벽한 보안 없음
// - defense in depth
// - 경제적 공격 비용 > 이득 설계
// - slashing + bonding이 핵심
// - governance (on-chain + off-chain)`}
        </pre>
        <p className="leading-7">
          실제 공격: <strong>51%, selfish mining, long-range, censorship, DDoS</strong>.<br />
          방어: slashing, bonding, weak subjectivity, social consensus.<br />
          "경제적 공격 비용 &gt; 이득" 설계가 핵심.
        </p>

        {/* ── Quorum 수학 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Quorum 수학 정리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Quorum 수학 정리:

// BFT (Byzantine Fault Tolerance):
// - n = 3f+1 (minimum)
// - quorum = 2f+1 (intersection)
// - 두 quorum 교차: f+1 >= 1 honest
// - safety via intersection

// CFT (Crash Fault Tolerance):
// - n = 2f+1 (minimum)
// - quorum = f+1 (majority)
// - 단순 crash만 고려
// - Paxos, Raft 사용

// Nakamoto:
// - 51% honest hash power
// - "quorum" = majority hash
// - probabilistic

// Avalanche:
// - α/k threshold (e.g., 14/20 = 70%)
// - β consecutive (20)
// - Pstats ~ e^(-α*β)

// 실제 숫자 (n=100):
// BFT: f=33, quorum=67
// CFT: f=49, quorum=51
// Nakamoto: 51% hash
// Avalanche: 70% sample

// Stake-weighted BFT (현대):
// - voting power = stake
// - 2/3+ stake threshold
// - absolute validator 수 무관
// - economic security

// Committee sampling (Ethereum 2.0):
// - 1M+ total validators
// - committee 32 per slot
// - random VRF sampling
// - Byzantine detection in committee
// - finality via 2/3 stake

// 수학적 보안:
// - f<n/3: BFT safety
// - f<n/2: Nakamoto safety
// - stake concentration: 경제 인센티브
// - slashing: 33% attack 비용

// 비교:
// - 100 validators, stake 1 each:
//   PBFT: 33 Byzantine 필요 for attack
//   Stake-based: 33% stake 필요
// - 100 validators, skewed stake (1 has 40%):
//   BFT vanilla: 동일
//   Stake-weighted: 큰 하나 = 위험`}
        </pre>
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
