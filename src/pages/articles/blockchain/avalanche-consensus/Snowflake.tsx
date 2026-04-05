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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Snowflake Algorithm:

// Parameters:
// - k: sample size (e.g., 20)
// - α: quorum threshold (e.g., 14)
// - β: decision threshold (e.g., 20)

// State per node:
// - pref: current preference (0 or 1)
// - count: consecutive identical rounds
// - decided: bool

fn snowflake_round(self) -> ():
    # 1. Sample k random nodes
    sample = random.sample(all_nodes, k)

    # 2. Query their preferences
    responses = [node.query_preference() for node in sample]

    # 3. Count each preference
    count_0 = sum(r == 0 for r in responses)
    count_1 = sum(r == 1 for r in responses)

    # 4. Check quorum
    if count_0 >= alpha:
        if self.pref == 0:
            self.count += 1
        else:
            self.pref = 0
            self.count = 1
    elif count_1 >= alpha:
        if self.pref == 1:
            self.count += 1
        else:
            self.pref = 1
            self.count = 1
    else:
        self.count = 0  # no quorum → reset

    # 5. Check decision threshold
    if self.count >= beta:
        self.decided = True
        return self.pref

// Safety argument:
// - Byzantine이 β개 round 동안 속이려면
//   매 round마다 α개 noise 필요
// - probability: (f/n)^(α*β)
// - with α=14, β=20, f/n=1/3: ~10^-10

// 문제점 (Snowflake):
// - 선호 쉽게 바뀜 (1 quorum으로 즉시 flip)
// - Byzantine의 "flip attack" 가능
// - count reset 자주 발생

// → Snowball이 해결`}
        </pre>
        <p className="leading-7">
          Snowflake: <strong>sample k → query → α quorum → β 연속 → decide</strong>.<br />
          safety probability ≈ (f/n)^(α×β) → 실용적 0.<br />
          단점: 선호 쉽게 바뀜 → Snowball이 해결.
        </p>

        {/* ── Parameters 영향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Parameters의 영향</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Parameter Tuning:

// k (sample size):
// - 작으면: 빠르지만 정확도 낮음
// - 크면: 느리지만 정확
// - typical: 10-30
//
// 효과:
// - communication: O(k) per node per round
// - accuracy: P(sample represents majority)
// - Avalanche default: k=20

// α (quorum threshold):
// - 작으면: 쉬운 합의, but Byzantine에 취약
// - 크면: 안전하지만 느림
// - typical: α > k/2 (majority)
// - Avalanche: α=14 of 20 (70%)
//
// 관계:
// α/k = 확실성 수준
// α=14/20 = 70%
// α=16/20 = 80%
// α=20/20 = 100% (과도)

// β (decision threshold):
// - 작으면: 빠른 결정, 낮은 confidence
// - 크면: 느린 결정, 높은 confidence
// - typical: 10-30
// - Avalanche: β=20
//
// Safety scaling:
// P(incorrect) ~ (f/n)^β
// β=10 → 10^-5 (good)
// β=20 → 10^-10 (excellent)
// β=30 → 10^-15 (paranoid)

// Performance trade-offs:
// - Rounds to decide: β ± (noise)
// - Time per round: network latency
// - Total finality: β × latency
// - Avalanche: ~20 rounds × 50ms = 1s

// Byzantine tolerance:
// - f < n/3 provably safe
// - f up to n/2 with higher confidence
// - depends on parameters

// Avalanche in practice:
// - k=20, α=14, β=20
// - ~1 second finality
// - 4500 TPS (mainnet)
// - thousands of validators`}
        </pre>
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
