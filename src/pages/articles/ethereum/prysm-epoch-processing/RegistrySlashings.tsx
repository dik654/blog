import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RegistrySlashings({ onCodeRef }: Props) {
  return (
    <section id="registry-slashings" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">레지스트리 & 슬래싱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-slashings', codeRefs['process-slashings'])} />
          <span className="text-[10px] text-muted-foreground self-center">AttestingBalance()</span>
        </div>

        {/* ── Registry updates ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Registry Updates — activation/exit queue</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 매 epoch validator 활성화/이탈 queue 처리

func ProcessRegistryUpdates(state *BeaconState) error {
    // 1. Activation eligibility 처리
    //    pending deposit → eligible status
    for i, v := range state.Validators {
        if isEligibleForActivationQueue(v) {
            v.ActivationEligibilityEpoch = getCurrentEpoch(state) + 1
        }
    }

    // 2. Queue activations (churn limit 제한)
    churnLimit := getValidatorChurnLimit(state)
    eligible := getEligibleValidators(state)  // sorted by eligibility epoch

    for i, idx := range eligible {
        if uint64(i) >= churnLimit { break }  // 제한 초과 시 다음 epoch으로
        state.Validators[idx].ActivationEpoch =
            computeActivationExitEpoch(getCurrentEpoch(state))
    }

    // 3. Initiate voluntary exits (slashing으로 인한 것 포함)
    // exit_epoch + MIN_VALIDATOR_WITHDRAWABILITY_DELAY 후 출금 가능
}

// Churn Limit:
// 한 epoch에 활성화/이탈 가능한 validator 수 제한
// 급격한 validator set 변화 방지

// 계산:
// churn_limit = max(
//     MIN_PER_EPOCH_CHURN_LIMIT,          // 4
//     active_validator_count / CHURN_LIMIT_QUOTIENT  // /65536
// )

// 메인넷 (1M active):
// churn_limit = max(4, 1_000_000 / 65536) = 15 per epoch
// → epoch당 15명 activate + 15명 exit
// → 하루 (225 epochs) 3,375명
// → 1달 ~100,000명 최대 변동

// 역사적 churn limit:
// 2021: 4 (min, validators 적음)
// 2022: ~5
// 2023: ~10
// 2024: ~14
// 2025: ~15

// Churn limit 증가 시나리오:
// EIP-7251 MaxEB (Max Effective Balance) 도입 시
// 32 → 2048 ETH 증가 → validator 수 감소 → churn 비율 증가`}
        </pre>
        <p className="leading-7">
          <strong>Churn limit</strong>이 validator set 안정성 보장.<br />
          활성 validator의 1/65536 per epoch 변동 제한.<br />
          급격한 mass exit/entry 방지 → 네트워크 안정성.
        </p>

        {/* ── Slashings processing ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashings Penalty — epoch offset 분산</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Slashing 발생 시 즉시 효과:
// 1. validator.slashed = true
// 2. 초기 penalty: effective_balance / MIN_SLASHING_PENALTY_QUOTIENT
//    (Altair: 1/64 → 0.5 ETH from 32 ETH)
// 3. exit_epoch, withdrawable_epoch 설정
// 4. 공개 blockchain에 slash record

// 그러나 "큰 penalty"는 epoch offset 후 적용
// → 여러 slashing이 같은 epoch에 집중되면 페널티 증폭

func ProcessSlashings(state *BeaconState) error {
    epoch := getCurrentEpoch(state)
    totalBalance := getTotalActiveBalance(state)

    // 적용 시점: slashed_epoch + EPOCHS_PER_SLASHINGS_VECTOR / 2 (4096)
    adjustedTotalSlashingBalance := min(
        sum(state.Slashings) * PROPORTIONAL_SLASHING_MULTIPLIER,
        totalBalance,
    )

    for i, v := range state.Validators {
        if v.Slashed &&
           epoch + EPOCHS_PER_SLASHINGS_VECTOR/2 == v.WithdrawableEpoch {

            // Penalty 계산
            increment := EFFECTIVE_BALANCE_INCREMENT  // 1 ETH
            penaltyNumerator := v.EffectiveBalance / increment *
                                adjustedTotalSlashingBalance
            penalty := penaltyNumerator / totalBalance * increment

            decreaseBalance(state, i, penalty)
        }
    }
}

// PROPORTIONAL_SLASHING_MULTIPLIER (Altair+):
// 3 (Altair), 2 (Phase0)
// 의미: N명 slashed → penalty × N × 3 / totalBalance

// 동시 slashing 시나리오:
// 1 validator slashed: ~0.5 ETH penalty (1/64)
// 100 validators slashed: ~50 ETH penalty per validator
// 1000+ validators (attack): ~전체 stake loss

// 경제적 보안:
// - Casper FFG는 finality reorg = 1/3+ slashing 필요
// - 1/3 = ~333K validator × 32 ETH = ~10.6M ETH
// - 현재 ETH 가치 기준 수십억 달러 손실
// - 따라서 "finalized = 사실상 irreversible"`}
        </pre>
        <p className="leading-7">
          Slashing은 <strong>epoch offset 후 집단 penalty</strong>.<br />
          같은 epoch의 다수 slashing → proportional multiplier로 증폭.<br />
          1/3+ validator slashing = 수십억 달러 손실 → finality 사실상 불가역.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 churn_limit 제한</strong> — 한 에폭에 활성화/이탈할 수 있는 검증자 수를 제한.<br />
          급격한 검증자 집합 변동을 방지하여 네트워크 안정성 확보.<br />
          슬래싱 패널티 = slashed_balance * 슬래싱 비율 / total_balance.
        </p>
      </div>
    </section>
  );
}
