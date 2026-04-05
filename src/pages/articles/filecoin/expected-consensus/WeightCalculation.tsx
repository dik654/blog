import WeightDetailViz from './viz/WeightDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function WeightCalculation({ onCodeRef }: Props) {
  return (
    <section id="weight" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체인 가중치 계산</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Filecoin 포크 선택의 핵심 — 가장 무거운 체인이 정규 체인<br />
        가중치 = 부모 w + log₂(P)×2⁸ + WinCount 보너스
      </p>
      <div className="not-prose mb-8">
        <WeightDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Weight Formula ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Weight Formula 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin Chain Weight Formula:

// Epoch weight:
// w_epoch = wForce * (num_blocks * W_RATIO_NUM + W_RATIO_DEN)
//          / expectedLeadersPerEpoch / W_RATIO_DEN
//
// Where:
// - wForce = log2(network_power_at_epoch) * 256
// - W_RATIO_NUM = 1 (reward weight)
// - W_RATIO_DEN = 2 (producer weight)
// - expectedLeadersPerEpoch = 5
// - num_blocks = tipset size

// Cumulative chain weight:
// w(chain) = Σ w_epoch for all epochs

// 구체적 계산:
//
// network_power = 2^60 bytes (~1 ExaByte):
// wForce = 60 * 256 = 15360
//
// 5 winners (expected):
// per_block = 15360 * 1 * 256 / 5 / 2 = ~786
// tipset (5 blocks): 15360 + 5 * 786 = 19290
//
// 3 winners (below expected):
// tipset (3 blocks): 15360 + 3 * 786 = 17718
//
// 10 winners (above expected):
// tipset (10 blocks): 15360 + 10 * 786 = 23220

// Weight interpretation:
// - base: log2(power) * 256
// - per block bonus: capped by expected
// - more blocks = higher weight
// - more power = log-scaled higher weight

// Log scaling 이유:
// - linear: 대형 miners 공격 쉬움
// - log: 대형도 비례적 증가만
// - fair에 가까움
// - small miners 참여 장려

// WinCount impact:
// - miner win multiple times (wincount > 1)
// - each win counted in tipset
// - larger tipset → higher weight
// - encourages active mining`}
        </pre>
        <p className="leading-7">
          Weight formula: <strong>log2(power) × 256 + block bonuses</strong>.<br />
          5 winners expected, more blocks = higher weight.<br />
          log scaling → fair to small miners.
        </p>

        {/* ── Fork Choice ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fork Choice 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Fork Choice:
//
// function select_heaviest(ts1, ts2):
//     if ts1.weight > ts2.weight:
//         return ts1
//     elif ts1.weight < ts2.weight:
//         return ts2
//     else:
//         // tie-break: tipset weight first
//         // then lexicographic CID
//         return lexicographic_smallest(ts1, ts2)

// Reorg 발생 조건:
// - new chain with higher weight
// - valid chain (all blocks pass)
// - from known ancestor

// Reorg cost:
// 1. rollback current state
// 2. load parent state at common ancestor
// 3. apply new chain messages
// 4. recompute state tree
// 5. update heaviest pointer
// 6. notify subsystems

// Reorg depth:
// - shallow (< 10 epochs): common
// - medium (10-100): rare
// - deep (> 100): alarm
// - 900+: "finality violation"

// 실제 stats:
// - most reorgs: 1-3 epochs
// - avg daily reorgs: ~5-10
// - deep reorgs: weekly 이하
// - 50+ reorgs: monthly or never

// Reorg protection:
// - cannot reorg beyond finalized
// - F3 provides hard limit
// - state transitions reversible (expensive)

// 장기 보안:
// - 900 epoch finality (probabilistic)
// - F3 fast finality (2-5 min)
// - 33% storage power = attack cost
// - economic security

// Chain rule 비교:
// Bitcoin: cumulative work
// Filecoin: log-scaled power × blocks
// Ethereum: LMD-GHOST (attestations)
// Cosmos: instant BFT (no forks)

// Determinism:
// - same chain view → same weight
// - all honest nodes agree
// - deterministic reorg decisions`}
        </pre>
        <p className="leading-7">
          Fork choice: <strong>heaviest weight → tie-break lexicographic</strong>.<br />
          1-3 epoch reorgs 일상, 100+ 드묾.<br />
          F3가 hard finality limit 제공.
        </p>

        {/* ── Long-range attack 방어 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Long-Range Attack 방어</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Long-Range Attack 가능성:

// 공격 시나리오:
// - 과거 miners의 old keys 획득
// - alternative chain 구성
// - higher total weight 만들기
// - "original chain" 대체

// Filecoin의 방어:

// 1. Finality assumption:
//    - 900 epochs 이상 reorg 거부
//    - node accepts 최근 900 epoch만
//    - nodes가 chain history 알고 있음
//
// 2. Weak subjectivity:
//    - trusted checkpoints
//    - external validation
//    - social consensus
//
// 3. Storage power slashing:
//    - faulty sectors penalty
//    - double-signing penalty
//    - economic disincentive

// 4. Work vs stake 비교:
//    - PoW (Bitcoin): work 필요 (burned)
//    - Filecoin: storage power (ongoing)
//    - Ethereum PoS: stake (slashable)

// F3 protection:
// - finalized tipset은 reorg 불가
// - 2-5 min finality
// - long-range attack 원천 차단

// Bootstrap attack:
// - 새 node가 genesis에서 sync
// - 여러 chain candidates 수신
// - 어느 것이 canonical?
//
// 해결:
// - trusted genesis
// - checkpoint (optional)
// - longest valid chain
// - F3 certificates

// 공격 비용:
// - 33% storage power 필요
// - storage hardware 투자
// - Filecoin pledge 손실
// - 수십-수백M USD
// - 경제적 비합리

// Practical example:
// 2023-2024 Filecoin network:
// - total power: ~20 EiB
// - 33% = 6.6 EiB
// - storage cost: ~$66M
// - pledge: ~$80M
// - total: $150M+ risk

// 결론:
// Long-range attack은 이론적 가능
// 현실적으로 경제적 비합리
// F3가 추가 방어 제공`}
        </pre>
        <p className="leading-7">
          Long-range attack: <strong>이론 가능, 경제적 비합리</strong>.<br />
          33% storage power = $150M+ 투자 필요.<br />
          F3 finalized tipset → 원천 차단.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "log scaling"이 Filecoin의 핵심인가</strong> — fairness 보장.<br />
          linear scaling: large miner (50% power) = 50% weight → 공격 용이.<br />
          log scaling: large miner 여전히 유리하지만 비례 감쇠.<br />
          small miners가 참여할 incentive 유지 → decentralization.
        </p>
      </div>
    </section>
  );
}
