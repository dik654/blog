import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import RewardDetailViz from './viz/RewardDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RewardsPenalties({ onCodeRef }: Props) {
  return (
    <section id="rewards-penalties" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">보상 & 패널티</h2>
      <div className="not-prose mb-8"><RewardDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-rewards', codeRefs['process-rewards'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessRewardsAndPenalties()</span>
        </div>

        {/* ── 4가지 보상 카테고리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation 보상 — 4가지 구성요소</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Altair+ 보상 공식 (기존 PendingAttestation 대체)
// ParticipationFlags (3-bit):
// - TIMELY_SOURCE_FLAG_INDEX = 0
// - TIMELY_TARGET_FLAG_INDEX = 1
// - TIMELY_HEAD_FLAG_INDEX = 2

// 각 flag에 할당된 weight:
// - source: 14 (TIMELY_SOURCE_WEIGHT)
// - target: 26 (TIMELY_TARGET_WEIGHT)
// - head: 14 (TIMELY_HEAD_WEIGHT)
// - sync: 2 (SYNC_COMMITTEE_WEIGHT, Altair)
// - proposer: 8 (PROPOSER_WEIGHT, block 포함 보상)
// 총합: 64 (WEIGHT_DENOMINATOR)

// 단일 validator 예상 보상 (per epoch):
// BASE_REWARD = effective_balance * BASE_REWARD_FACTOR / sqrt(total_active_balance) / BASE_REWARDS_PER_EPOCH

// flag별 보상:
// source_reward = BASE_REWARD * TIMELY_SOURCE_WEIGHT / 64 * participation_ratio
// target_reward = BASE_REWARD * TIMELY_TARGET_WEIGHT / 64 * participation_ratio
// head_reward = BASE_REWARD * TIMELY_HEAD_WEIGHT / 64 * participation_ratio

// 계산 예시 (32 ETH validator):
// effective_balance = 32_000_000_000 Gwei (32 ETH)
// total_active_balance ≈ 32_000_000 ETH (1M validators)
// BASE_REWARD ≈ 2350 Gwei / epoch

// Perfect attestation 보상 (모든 3 flags):
// 14/64 + 26/64 + 14/64 = 54/64 = 84%
// reward per epoch ≈ 2350 × 0.84 ≈ 1975 Gwei

// 연간:
// 225 epochs/day × 365 = 82,125 epochs/year
// 82,125 × 1975 ≈ 162 million Gwei = 0.162 ETH/year
// APR ≈ 0.162 / 32 = 0.5% (BASE, attestation만)

// + sync committee (간헐적, 큰 보상)
// + proposer (희귀, 큰 보상)
// 실제 APR ≈ 3~5%`}
        </pre>
        <p className="leading-7">
          Attestation 보상 = <strong>3 flags × weights</strong>.<br />
          source(14) + target(26) + head(14) = 54/64 of base reward.<br />
          Perfect participation 시 연 ~0.5% (attestation만).
        </p>

        {/* ── 패널티 공식 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">패널티 — 미참여/잘못된 투표</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 패널티 계산 (Altair+):
// 각 flag에 대해 미참여 시 penalty

// Timely source 미참여:
// penalty_source = BASE_REWARD * TIMELY_SOURCE_WEIGHT / 64

// Timely target 미참여:
// penalty_target = BASE_REWARD * TIMELY_TARGET_WEIGHT / 64

// Timely head 미참여:
// penalty_head = 0  (head는 penalty 없음, reward only)

// Total flag penalty:
// 최대: BASE_REWARD × (14 + 26) / 64 = BASE_REWARD × 40/64 = 62%

// 추가 Inactivity Penalty (leak):
// finality 4 epoch 이상 지연 시 활성화
// 미참여 validator는 extra penalty

// Inactivity Score:
// - 참여 시 -16 (초당 1 epoch, 감소)
// - 미참여 시 +4 (초당 1 epoch, 증가)
// - Inactivity leak 활성 시 +추가

// Inactivity leak penalty:
// if finality_delay > 4 epochs:
//     leak_penalty = validator.inactivity_score *
//                    validator.effective_balance /
//                    INACTIVITY_SCORE_BIAS /  // 4
//                    INACTIVITY_PENALTY_QUOTIENT  // 2^26 = 67M

// 효과:
// - 정상 시: 미참여 validator는 작은 penalty
// - leak 시: 지수적 penalty 증가 → 빠른 exit 유도
// - 목표: 2/3 quorum 빠르게 회복`}
        </pre>
        <p className="leading-7">
          패널티는 <strong>reward와 대칭적 구조</strong>.<br />
          source/target 미참여 시 최대 62% penalty.<br />
          Inactivity leak로 finality 지연 validator 강력 처벌.
        </p>

        {/* ── Precompute 최적화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Precompute 패턴 — O(N) 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 rewards precompute 최적화

// naive 구현 (N² 복잡도):
for _, v := range validators {
    // 각 validator마다 전체 validator 순회
    totalBalance := computeTotalBalance(validators)  // O(N)
    reward := computeReward(v, totalBalance)
    // ...
}
// 총 복잡도: O(N²)

// Precompute 최적화:
// 1. 사전 계산 단계 (O(N) 순회 1회):
type ValidatorPrecompute struct {
    ValidatorIndex uint64
    Balance uint64
    EffectiveBalance uint64
    IsActive bool
    IsPreviousEpochSource, IsPreviousEpochTarget, IsPreviousEpochHead bool
    IsCurrentEpochSource, IsCurrentEpochTarget, IsCurrentEpochHead bool
    IsInactive bool
}

type BalancePrecompute struct {
    TotalBalance uint64
    PreviousEpochSourceAttestingBalance uint64
    PreviousEpochTargetAttestingBalance uint64
    PreviousEpochHeadAttestingBalance uint64
    // ...
}

func Precompute(state *BeaconState) ([]*ValidatorPrecompute, *BalancePrecompute) {
    vals := make([]*ValidatorPrecompute, len(state.Validators))
    bals := &BalancePrecompute{}

    for i, v := range state.Validators {
        vals[i] = computeFlags(v, state, i)
        bals.TotalBalance += v.EffectiveBalance
        if vals[i].IsPreviousEpochTarget {
            bals.PreviousEpochTargetAttestingBalance += v.EffectiveBalance
        }
        // ...
    }
    return vals, bals
}

// 2. 보상 계산 (O(N), precompute 사용):
for i, v := range vals {
    deltas[i] = computeDelta(v, bals)  // O(1)
}

// 총 복잡도: O(N) (2번의 O(N) 순회 = 선형)
// 1M validator 기준: ~200ms (naive 수백 배 빠름)`}
        </pre>
        <p className="leading-7">
          <strong>Precompute 패턴</strong>으로 O(N²) → O(N) 최적화.<br />
          2번의 O(N) 순회로 reward 계산 완료.<br />
          1M validator에서 200ms — naive 대비 수백 배 가속.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Precompute 최적화</strong> — 모든 검증자의 참여도를 한 번에 집계한 후 보상/패널티 벡터 계산.<br />
          N번 반복 대신 한 번의 순회로 처리하여 O(N) 성능 달성.<br />
          Phase0 vs Altair에서 보상 공식이 다르므로 포크별 분기 구현.
        </p>
      </div>
    </section>
  );
}
