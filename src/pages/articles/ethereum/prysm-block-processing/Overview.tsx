import ContextViz from './viz/ContextViz';
import BlockProcessingViz from './viz/BlockProcessingViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 처리 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 블록 수신부터 상태 반영까지의 6단계 검증 파이프라인을 코드 수준으로 추적한다.
        </p>

        {/* ── process_block 파이프라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">process_block — 6단계 파이프라인</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-1"><code>ProcessBlock(state *BeaconState, block *BeaconBlock) error</code></p>
            <p className="text-xs text-foreground/60">consensus-specs process_block (Deneb)</p>
          </div>
          <div className="space-y-2">
            {[
              { step: '1', fn: 'processBlockHeader', desc: 'proposer_index 검증 + proposer slashing 확인 + latest_block_header 업데이트', time: '~1ms', color: 'text-sky-400' },
              { step: '2', fn: 'processRandao', desc: 'proposer의 randao_reveal 서명 검증 + randao_mixes[epoch % 65536] XOR 업데이트', time: '~2ms', color: 'text-violet-400' },
              { step: '3', fn: 'processEth1Data', desc: 'eth1_data_votes에 추가, 과반 시 eth1_data 확정', time: '~1ms', color: 'text-emerald-400' },
              { step: '4', fn: 'processOperations', desc: 'proposer/attester slashings, attestations, deposits, voluntary_exits, bls_to_execution_changes', time: '~100ms', color: 'text-amber-400' },
              { step: '5', fn: 'processSyncAggregate', desc: 'sync committee 집계 서명 검증 + 참여자 보상 지급 (Altair+)', time: '~5ms', color: 'text-pink-400' },
              { step: '6', fn: 'processExecutionPayload', desc: 'EL에 payload 전달 → engine_newPayload → VALID/INVALID/SYNCING (Bellatrix+)', time: '~수십ms', color: 'text-red-400' },
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
            <p className="text-xs text-foreground/70">총 <strong>~200ms</strong> per block — 12초 slot 대비 매우 여유. Operations(attestations)가 전체의 50%+ 차지.</p>
          </div>
        </div>
        <p className="leading-7">
          블록 처리는 <strong>6단계 파이프라인</strong>.<br />
          각 단계가 독립적 검증 + state 업데이트.<br />
          attestations 처리가 가장 큰 비중 — ~100ms.
        </p>
      </div>
      <div className="not-prose mt-6"><BlockProcessingViz /></div>
    </section>
  );
}
