import ContextViz from './viz/ContextViz';
import FinalityFlowViz from './viz/FinalityFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Casper FFG 메커니즘</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 Casper FFG의 justified → finalized 전환 과정과 Prysm의 체크포인트 관리를 코드 수준으로 추적한다.
        </p>

        {/* ── Finality 타임라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Finality 타임라인 — justified → finalized</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">블록 생성 → Finalization 타임라인</div>
            <div className="text-sm space-y-1">
              <div><strong>Slot 0</strong> (T=0s) — block 생성</div>
              <div><strong>Slot 31</strong> (T=372s) — epoch 0 끝</div>
              <div><strong>Epoch 1 시작</strong> (T=384s) — epoch 0 attestation 수집 → 2/3 이상이면 epoch 0 <strong>justified</strong></div>
              <div><strong>Slot 63</strong> (T=756s) — epoch 1 끝</div>
              <div><strong>Epoch 2 시작</strong> (T=768s) — epoch 1도 justified면 epoch 0 <strong>FINALIZED</strong> (~12.8분)</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="text-xs font-semibold text-green-400 mb-2">Best Case</div>
              <p className="text-sm">2 epochs = <strong>~12.8분</strong></p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <div className="text-xs font-semibold text-red-400 mb-2">Worst Case (inactivity leak)</div>
              <p className="text-sm"><strong>수 시간~수 일</strong></p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Prysm Finality 단계</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Attestation 수집 (epoch 경계에서 집계)</li>
              <li><code>processJustificationAndFinalization()</code> 실행</li>
              <li><code>state.current_justified_checkpoint</code> 업데이트</li>
              <li><code>state.finalized_checkpoint</code> 업데이트 (조건 충족 시)</li>
              <li>Fork choice store에 반영</li>
              <li>노드별 action — DB 저장, tree 프루닝, hot state cache 정리, Engine API로 EL 알림</li>
            </ol>
            <p className="text-sm mt-2 text-muted-foreground">Notification 체인: consensus state change → stategen → fork choice store → RPC subscribers</p>
          </div>
        </div>
        <p className="leading-7">
          Finality 타임라인: <strong>epoch 0 → epoch 2 = ~12.8분</strong>.<br />
          2개 연속 epoch justified + supermajority link → finalize.<br />
          Inactivity leak 시 지연 → 수 시간~수 일.
        </p>
      </div>
      <div className="not-prose mt-6"><FinalityFlowViz /></div>
    </section>
  );
}
