import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function JustificationFinalization({ onCodeRef }: Props) {
  return (
    <section id="justification-finalization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Justification & Finalization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-justification', codeRefs['process-justification'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessJustification()</span>
        </div>

        {/* ── Casper FFG ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Casper FFG — 2-phase finality</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-2">Casper FFG (Friendly Finality Gadget)</p>
            <p className="text-xs text-foreground/60 mb-3">Ethereum 2.0의 economic finality 메커니즘 — "Casper the Friendly Finality Gadget" (Vitalik, 2017)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border p-2">
                <strong className="text-indigo-400">Justified checkpoint</strong>
                <span className="text-foreground/60"> — 2/3+ validators가 지지</span>
              </div>
              <div className="rounded border border-border p-2">
                <strong className="text-indigo-400">Finalized checkpoint</strong>
                <span className="text-foreground/60"> — justified의 supermajority link</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm text-sky-400 mb-2">FFG Finalization Rules</p>
              <div className="space-y-2 text-xs text-foreground/70">
                <div><strong>Rule 1:</strong> N과 N+1이 모두 justified + N → N+1 supermajority link (연속 2 epoch)</div>
                <div><strong>Rule 2:</strong> N, N+1, N+2가 justified + N → N+2 supermajority link</div>
                <div className="text-foreground/50">Supermajority link = 전체 active balance 2/3+ validator가 source=N, target=M 투표</div>
              </div>
            </div>
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
              <p className="font-semibold text-sm text-violet-400 mb-2">BeaconState 관련 필드</p>
              <div className="space-y-1 text-xs">
                <div><code className="text-violet-300">justification_bits: Bitvector[4]</code> <span className="text-foreground/60">— 최근 4 epoch 상태</span></div>
                <div><code className="text-violet-300">previous_justified_checkpoint: Checkpoint</code></div>
                <div><code className="text-violet-300">current_justified_checkpoint: Checkpoint</code></div>
                <div><code className="text-violet-300">finalized_checkpoint: Checkpoint</code></div>
              </div>
              <div className="mt-2 text-xs text-foreground/50">bits[0]=epoch-4 (oldest) ... bits[3]=epoch-1 (recent)</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Casper FFG는 <strong>2-phase finality</strong> 제공.<br />
          justified → finalized 2단계 진행으로 economic security 보장.<br />
          finalized 되돌리면 전체 staker의 1/3 이상 슬래싱 필요 → 수십억 달러 비용.
        </p>

        {/* ── processJustification 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">processJustificationAndFinalization 로직</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3"><code>ProcessJustificationAndFinalization(state)</code></p>
            <p className="text-xs text-foreground/50 mb-3">Guard: <code>currentEpoch &lt;= GENESIS_EPOCH + 1</code> → 첫 2 epoch skip</p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                { step: '1', label: '참여 잔액 계산', detail: 'getTotalActiveBalance + getAttestingBalance(previousEpoch, TARGET) / (currentEpoch, TARGET)' },
                { step: '2', label: 'JustificationBits shift', detail: '기존 bits를 한 칸 shift — bits[3] → bits[2] → ... + newBits[3] = false' },
                { step: '3', label: '이전 epoch justified 체크', detail: 'previousTargetBalance * 3 >= totalActiveBalance * 2 → 2/3+ supermajority → newBits[1] = true' },
                { step: '4', label: '현재 epoch justified 체크', detail: 'currentTargetBalance * 3 >= totalActiveBalance * 2 → newBits[0] = true' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">{s.label}</p>
                    <p className="text-foreground/60"><code>{s.detail}</code></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-3">Finalization 체크 (3 Rules)</p>
            <div className="space-y-2 text-xs text-foreground/70">
              <div className="rounded border border-border p-2">
                <strong>Rule 1:</strong> <code>bits[1:4]</code> all true + <code>oldJustified.Epoch + 3 == currentEpoch</code> → N-3 finalized
              </div>
              <div className="rounded border border-border p-2">
                <strong>Rule 2:</strong> <code>bits[1:3]</code> all true + <code>oldJustified.Epoch + 2 == currentEpoch</code> → N-2 finalized
              </div>
              <div className="rounded border border-border p-2">
                <strong>Rule 3:</strong> <code>bits[0:2]</code> all true + <code>previousJustified.Epoch + 1 == currentEpoch</code> → previousJustified finalized <span className="text-foreground/50">(정상 동작 시 대부분 이 rule)</span>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          매 epoch 2/3 target vote 체크 → justified 마킹.<br />
          연속 2+ epoch justified + supermajority link → finalized.<br />
          4-bit vector로 최근 history 추적.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 2/3 슈퍼 매저리티</strong> — 이전/현재 에폭의 타겟 투표 잔액이 전체의 2/3를 넘으면 justified.<br />
          2개 연속 에폭이 justified되면 첫 번째가 finalized — 경제적 최종성.<br />
          JustificationBits 4비트 벡터로 최근 4에폭의 상태를 추적.
        </p>
      </div>
    </section>
  );
}
