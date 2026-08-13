import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function RegistrySlashings({ onCodeRef }: Props) {
  return (
    <section id="registry-slashings" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">레지스트리 & 슬래싱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("process-slashings", codeRefs["process-slashings"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            AttestingBalance()
          </span>
        </div>

        {/* ── Registry updates ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Registry Updates — activation/exit queue
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">
              <code>ProcessRegistryUpdates(state)</code> — 매 epoch
            </p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                {
                  step: "1",
                  label: "Activation eligibility",
                  detail:
                    "pending deposit → eligible status, ActivationEligibilityEpoch = currentEpoch + 1",
                },
                {
                  step: "2",
                  label: "Queue activations",
                  detail:
                    "churn limit까지만 활성화 — eligible validators를 eligibility epoch 순 정렬 후 제한",
                },
                {
                  step: "3",
                  label: "Voluntary exits",
                  detail:
                    "exit_epoch + MIN_VALIDATOR_WITHDRAWABILITY_DELAY 후 출금 가능 (slashing 포함)",
                },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">
                      {s.label}
                    </p>
                    <p className="text-foreground/60">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">
              Churn 규칙은 fork에 따라 달라진다
            </p>
            <div className="text-xs text-foreground/70 space-y-1">
              <div>
                이전 fork: active validator count로 validator 단위 churn limit
                계산
              </div>
              <div>
                Electra 이후: 총 활성 balance에서 balance 단위 activation/exit
                churn을 계산하고 별도 상한을 적용
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "입력", value: "total active balance" },
              { label: "단위", value: "validator 또는 Gwei" },
              { label: "제약", value: "fork별 min/max" },
              { label: "queue", value: "activation·exit 분리" },
            ].map((h) => (
              <div
                key={h.label}
                className="rounded-lg border border-border p-2 text-center"
              >
                <span className="text-xs font-bold text-muted-foreground">
                  {h.label}
                </span>
                <p className="text-xs text-foreground/70">{h.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs leading-5 text-foreground/70">
              Queue 처리량을 “epoch당 validator 몇 명”으로 고정하면 balance-based churn을 설명할 수 없습니다. Electra 이후에는 compounding validator와 더 큰 effective balance를 고려해 Gwei 단위 activation·exit budget이 각 request에서 얼마나 소비되는지 추적해야 합니다.
            </p>
          </div>
        </div>
        <p>
          <strong>Churn limit</strong>은 activation과 exit가 한 epoch에 validator set을 급격하게 바꾸지 못하도록 제한합니다. 정확한 단위와 formula는 활성 fork에 따라 validator count 또는 effective-balance budget을 사용하므로, queue position을 계산할 때 현재 network configuration과 pending request의 balance를 함께 봐야 합니다.
        </p>

        {/* ── Slashings processing ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Slashings Penalty — epoch offset 분산
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">
              Slashing 즉시 효과
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-foreground/70">
              <div className="rounded border border-border p-2">
                <code>validator.slashed = true</code>
              </div>
              <div className="rounded border border-border p-2">
                초기 penalty: fork별 quotient로 effective balance에서 계산
              </div>
              <div className="rounded border border-border p-2">
                <code>exit_epoch</code>, <code>withdrawable_epoch</code> 설정
              </div>
              <div className="rounded border border-border p-2">
                blockchain에 slash record 기록
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">
              <code>ProcessSlashings(state)</code> — epoch offset 후 "큰
              penalty"
            </p>
            <div className="space-y-2 text-xs text-foreground/70">
              <div>
                적용 시점:{" "}
                <code>slashed_epoch + EPOCHS_PER_SLASHINGS_VECTOR/2</code>
              </div>
              <div>
                <code>
                  adjustedTotalSlashingBalance = min(sum(Slashings) *
                  MULTIPLIER, totalBalance)
                </code>
              </div>
              <div>
                <code>
                  penalty = (effectiveBalance / increment) * adjustedTotal /
                  totalBalance * increment
                </code>
              </div>
              <div className="text-foreground/50">
                <code>PROPORTIONAL_SLASHING_MULTIPLIER</code>와 quotient는
                fork별 상수이며 총 slashed balance 비율이 커질수록 상관 패널티가
                커진다.
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                동시 slashing 시나리오
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>단독 slashing: 초기 penalty + exit까지의 미참여 영향</div>
                <div>동시 slashing 증가: 상관 패널티 상승</div>
                <div>대규모 위반: 총 slashed balance 비율에 따라 큰 손실</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                경제적 보안
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  상충하는 finalized checkpoint는 최소 1/3 지분의 slashable 위반
                  증거를 뜻함
                </div>
                <div>
                  비용은 validator 개수가 아니라 위반한 effective balance로 계산
                </div>
                <div>
                  finality는 경제적 안전성과 사회적 복구 경계를 함께 제공
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          Slashed validator는 즉시 초기 penalty를 받고 정해진 epoch offset에서 주변 slashed balance에 비례한 correlation penalty를 추가로 받습니다. 같은 기간에 많은 effective balance가 slash될수록 penalty가 커지며, conflicting finality를 만들려면 validator 수가 아니라 최소 3분의 1 voting weight가 slashable violation에 참여해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>Churn과 slashing은 다른 제어입니다.</strong> Churn budget은 정상적인 entry·exit 속도를 제한하고, slashing formula는 위반 validator의 effective balance와 같은 기간의 total slashed balance를 사용해 penalty를 계산합니다. 둘 모두 fork별 specification을 기준으로 계산해야 합니다.
        </p>
      </div>
    </section>
  );
}
