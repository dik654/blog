import ContextViz from "./viz/ContextViz";
import FinalityFlowViz from "./viz/FinalityFlowViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Casper FFG는 justified checkpoint를 irreversible finality로 올린다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 Casper FFG의 justified → finalized 전환 과정과 Prysm의
          체크포인트 관리를 코드 수준으로 추적한다.
        </p>

        {/* ── Finality 타임라인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Finality 타임라인 — justified → finalized
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              체크포인트 투표 → Finalization
            </div>
            <div className="text-sm space-y-1">
              <div>
                <strong>1. Vote</strong> — attestation이 source checkpoint와
                target checkpoint의 supermajority link를 표현
              </div>
              <div>
                <strong>2. Tally</strong> — 이전·현재 epoch target에 투표한
                effective balance 집계
              </div>
              <div>
                <strong>3. Justify</strong> — 2/3 가중치 조건을 만족한 target을
                justified로 표시하고 justification bits 이동
              </div>
              <div>
                <strong>4. Finalize</strong> — 스펙이 허용하는 justification-bit
                패턴과 checkpoint 거리 조건이 맞으면 이전 justified checkpoint
                확정
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="text-xs font-semibold text-green-400 mb-2">
                Best Case
              </div>
              <p className="text-sm">
                높은 참여율에서는 보통 <strong>약 두 epoch</strong>
              </p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <div className="text-xs font-semibold text-red-400 mb-2">
                Worst Case (inactivity leak)
              </div>
              <p className="text-sm">
                2/3 link가 회복될 때까지 <strong>고정 상한 없음</strong>
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Prysm Finality 단계
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Attestation 수집 (epoch 경계에서 집계)</li>
              <li>
                <code>processJustificationAndFinalization()</code> 실행
              </li>
              <li>
                <code>state.current_justified_checkpoint</code> 업데이트
              </li>
              <li>
                <code>state.finalized_checkpoint</code> 업데이트 (조건 충족 시)
              </li>
              <li>Fork choice store에 반영</li>
              <li>
                노드별 action — DB 저장, tree 프루닝, hot state cache 정리,
                Engine API로 EL 알림
              </li>
            </ol>
            <p className="text-sm mt-2 text-muted-foreground">
              Notification 체인: consensus state change → stategen → fork choice
              store → RPC subscribers
            </p>
          </div>
        </div>
        <p className="leading-7">
          건강한 네트워크에서는 보통 <strong>약 두 epoch</strong>에 finality가
          진행된다. 다만 단순히 “연속 두 epoch가 justified”만 보는 것이 아니라
          justification bits의 여러 패턴과 checkpoint 거리를 평가하며,
          2/3 link가 끊기면 finality는 무기한 지연될 수 있고 inactivity leak가
          참여 quorum 회복을 돕는다.
        </p>
      </div>
      <div className="not-prose mt-6">
        <FinalityFlowViz />
      </div>
    </section>
  );
}
