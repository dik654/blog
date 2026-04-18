import ContextViz from './viz/ContextViz';
import EpochPipelineViz from './viz/EpochPipelineViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에폭 전환 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 ProcessEpoch의 7단계 파이프라인이 검증자 보상을 정산하는 전체 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── Epoch processing 7단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ProcessEpoch — 7단계 파이프라인</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-1"><code>ProcessEpoch(state *BeaconState) error</code></p>
            <p className="text-xs text-foreground/60">epoch 경계 (32 slot마다) 실행 — 1 epoch = 6.4분</p>
          </div>
          <div className="space-y-2">
            {[
              { step: '1', fn: 'processJustificationAndFinalization', desc: '이전/현재 epoch attestation 집계 → 2/3+ supermajority → justified/finalized checkpoint 갱신', time: '~50ms', color: 'text-sky-400' },
              { step: '2', fn: 'processInactivityUpdates', desc: 'finality 지연 시 inactivity score 증가 → leak 메커니즘 트리거 (Altair+)', time: '~20ms', color: 'text-violet-400' },
              { step: '3', fn: 'processRewardsAndPenalties', desc: '모든 validator에게 보상/패널티 적용 — source, target, head vote 평가', time: '~200ms', color: 'text-amber-400' },
              { step: '4', fn: 'processRegistryUpdates', desc: 'activation queue + exit queue 처리, churn limit 적용', time: '~30ms', color: 'text-emerald-400' },
              { step: '5', fn: 'processSlashings', desc: '슬래싱 페널티 적용 — epoch offset으로 slashing period 분산', time: '~10ms', color: 'text-red-400' },
              { step: '6', fn: 'processEth1DataReset', desc: 'eth1_data_votes 초기화 (SLOTS_PER_ETH1_VOTING_PERIOD = 2048)', time: '~5ms', color: 'text-indigo-400' },
              { step: '7', fn: 'processFinalUpdates', desc: 'effective_balance 재계산 (hysteresis) + slashings offset + randao mix + historical summaries', time: '~5ms', color: 'text-pink-400' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted shrink-0 ${s.color}`}>{s.step}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-semibold">{s.fn}</code>
                    <span className="text-xs text-muted-foreground">{s.time}</span>
                  </div>
                  <p className="text-xs text-foreground/70 mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs text-foreground/70">총 <strong>~320ms</strong> per epoch (1M validator 기준) — 6.4분 간격 대비 매우 여유. Rewards 단계가 전체의 60%+ 차지.</p>
          </div>
        </div>
        <p className="leading-7">
          Epoch processing은 <strong>7단계 파이프라인</strong>.<br />
          매 epoch(6.4분) 1회만 실행 → validator 보상 일괄 정산.<br />
          총 ~320ms 소요 — slot processing보다 무겁지만 빈도 낮음.
        </p>
      </div>
      <div className="not-prose mt-6"><EpochPipelineViz /></div>
    </section>
  );
}
