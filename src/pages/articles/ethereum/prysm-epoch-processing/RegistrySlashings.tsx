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
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3"><code>ProcessRegistryUpdates(state)</code> — 매 epoch</p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                { step: '1', label: 'Activation eligibility', detail: 'pending deposit → eligible status, ActivationEligibilityEpoch = currentEpoch + 1' },
                { step: '2', label: 'Queue activations', detail: 'churn limit까지만 활성화 — eligible validators를 eligibility epoch 순 정렬 후 제한' },
                { step: '3', label: 'Voluntary exits', detail: 'exit_epoch + MIN_VALIDATOR_WITHDRAWABILITY_DELAY 후 출금 가능 (slashing 포함)' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">{s.label}</p>
                    <p className="text-foreground/60">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Churn Limit 공식</p>
            <div className="text-xs text-foreground/70 space-y-1">
              <div><code>churn_limit = max(MIN_PER_EPOCH_CHURN_LIMIT(4), active_count / CHURN_LIMIT_QUOTIENT(65536))</code></div>
              <div>메인넷 1M active: <code>max(4, 1M/65536)</code> = <strong>15 per epoch</strong></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { year: '2021', value: '4 (min)' },
              { year: '2022', value: '~5' },
              { year: '2023', value: '~10' },
              { year: '2024+', value: '~15' },
            ].map(h => (
              <div key={h.year} className="rounded-lg border border-border p-2 text-center">
                <span className="text-xs font-bold text-muted-foreground">{h.year}</span>
                <p className="text-xs text-foreground/70">{h.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-foreground/70">
              epoch당 15명 activate + 15명 exit → 하루 3,375명 → 1달 ~100,000명 최대 변동.<br />
              EIP-7251 MaxEB(32 → 2048 ETH) 도입 시 validator 수 감소 → churn 비율 증가.
            </p>
          </div>
        </div>
        <p className="leading-7">
          <strong>Churn limit</strong>이 validator set 안정성 보장.<br />
          활성 validator의 1/65536 per epoch 변동 제한.<br />
          급격한 mass exit/entry 방지 → 네트워크 안정성.
        </p>

        {/* ── Slashings processing ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slashings Penalty — epoch offset 분산</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">Slashing 즉시 효과</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-foreground/70">
              <div className="rounded border border-border p-2"><code>validator.slashed = true</code></div>
              <div className="rounded border border-border p-2">초기 penalty: <code>effective_balance / 64</code> (Altair: 0.5 ETH)</div>
              <div className="rounded border border-border p-2"><code>exit_epoch</code>, <code>withdrawable_epoch</code> 설정</div>
              <div className="rounded border border-border p-2">blockchain에 slash record 기록</div>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2"><code>ProcessSlashings(state)</code> — epoch offset 후 "큰 penalty"</p>
            <div className="space-y-2 text-xs text-foreground/70">
              <div>적용 시점: <code>slashed_epoch + EPOCHS_PER_SLASHINGS_VECTOR/2</code> (4096 epochs)</div>
              <div><code>adjustedTotalSlashingBalance = min(sum(Slashings) * MULTIPLIER, totalBalance)</code></div>
              <div><code>penalty = (effectiveBalance / increment) * adjustedTotal / totalBalance * increment</code></div>
              <div className="text-foreground/50"><code>PROPORTIONAL_SLASHING_MULTIPLIER</code>: 3 (Altair) / 2 (Phase0) — N명 slashed → penalty x N x 3 / totalBalance</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">동시 slashing 시나리오</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>1 validator: ~0.5 ETH penalty (1/64)</div>
                <div>100 validators: ~50 ETH/validator</div>
                <div>1000+ validators (attack): ~전체 stake loss</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">경제적 보안</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>Finality reorg = 1/3+ slashing 필요</div>
                <div>1/3 = ~333K validator x 32 ETH = ~10.6M ETH</div>
                <div>수십억 달러 손실 → <strong>finalized = 사실상 irreversible</strong></div>
              </div>
            </div>
          </div>
        </div>
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
