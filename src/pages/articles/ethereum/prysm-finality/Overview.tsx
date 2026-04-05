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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 블록 생성부터 finalization까지의 timeline
//
// Slot 0 (T=0s): block 생성
// Slot 31 (T=372s): epoch 0 끝
// Epoch 1 시작 (T=384s):
//   → epoch 0의 블록들에 attestation 수집
//   → 2/3 이상이면 epoch 0 justified
// Slot 63 (T=756s): epoch 1 끝
// Epoch 2 시작 (T=768s):
//   → epoch 1의 blocks justified 체크
//   → epoch 1도 justified면 epoch 0 FINALIZED (12.8분 후)

// Finality latency:
// Best case: 2 epochs = ~12.8 분
// Worst case (inactivity leak): 수 시간~수 일

// Prysm의 tracking:
type Service struct {
    justifiedCheckpoint Checkpoint
    finalizedCheckpoint Checkpoint
    prevJustifiedCheckpoint Checkpoint
}

// Finality 단계:
// 1. Attestation 수집 (epoch 경계에서 집계)
// 2. processJustificationAndFinalization() 실행
// 3. state.current_justified_checkpoint 업데이트
// 4. state.finalized_checkpoint 업데이트 (조건 충족 시)
// 5. Fork choice store에 반영
// 6. 노드별 action:
//    - DB에 finalized checkpoint 저장
//    - fork choice tree 프루닝
//    - hot state cache 정리
//    - Engine API로 EL에 finalized 알림

// Notification 체인:
// consensus state change → stategen service → fork choice store → RPC subscribers`}
        </pre>
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
