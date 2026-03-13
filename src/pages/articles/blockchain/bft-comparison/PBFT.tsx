import { CitationBlock } from '../../../../components/ui/citation';
import PBFTFlowViz from './viz/PBFTFlowViz';

export default function PBFT() {
  return (
    <section id="pbft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT (Practical Byzantine Fault Tolerance)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PBFT(1999, Castro & Liskov)는 비동기 네트워크에서 safety를 보장하고,
          부분 동기(partial synchrony) 하에서 liveness를 보장하는 최초의
          실용적 BFT 프로토콜입니다. f개의 비잔틴 노드를 허용하려면
          최소 3f+1개 노드가 필요합니다.
        </p>

        <CitationBlock source="Castro & Liskov, OSDI 1999 — §4" citeKey={1} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic text-foreground/80">
            "The algorithm works correctly in asynchronous systems like the Internet and it incorporates
            important optimizations that allow it to perform well so that it can be used in practice."
          </p>
          <p className="mt-2 text-xs">
            PBFT는 이전의 BFT 프로토콜(Rampart, SecureRing)이 동기 네트워크를 가정했던 것과 달리,
            비동기 환경에서도 safety를 보장한 최초의 실용적 프로토콜입니다.
            3f+1 노드 요구사항은 비잔틴 장애의 이론적 하한(Dolev-Strong bound)과 일치합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계 프로토콜</h3>

        <PBFTFlowViz />

        <CitationBlock source="PBFT 논문 Figure 1 — 정상 경로 메시지 패턴" citeKey={2} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic text-foreground/80">
            "The algorithm requires 3f+1 replicas to tolerate f faults. The three-phase protocol
            (pre-prepare, prepare, commit) ensures that non-faulty replicas agree on a total order
            for the execution of requests."
          </p>
          <p className="mt-2 text-xs">
            Pre-Prepare는 요청에 시퀀스 번호를 부여하고, Prepare는 non-faulty replica 간 순서 합의,
            Commit은 이를 확정합니다. 각 단계에서 2f+1 메시지를 수집해야 다음으로 진행 가능합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">View Change (리더 교체)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`PBFT View Change (이더리움의 missed slot과 비교):

PBFT:
  타임아웃 발생 → ViewChange 메시지 브로드캐스트
  → 2f+1 ViewChange 수집 → 새 Primary가 NewView 전송
  → 통신 복잡도: O(n³) ← 병목!

이더리움:
  슬롯 내 제안자 미스 → 다음 슬롯 제안자가 자동 진행
  → 포크 선택 규칙(LMD-GHOST)이 자동으로 최선 체인 선택
  → View Change 없이 liveness 유지

Tendermint (CometBFT):
  타임아웃 → 자동으로 다음 라운드(Round+1)로 진행
  → PBFT보다 단순한 view change
  → 통신 복잡도: O(n²)`}</code>
        </pre>

        <CitationBlock source="PBFT 논문 §4.4 View Changes" citeKey={3} type="paper">
          <p className="italic text-foreground/80">
            "A replica suspects the primary is faulty if it hasn't received a valid message from it
            within a timeout period. It then multicasts a VIEW-CHANGE message for view v+1."
          </p>
          <p className="mt-2 text-xs">
            View Change가 O(n³)인 이유: 새 Primary는 2f+1개의 ViewChange 메시지를 수집해야 하고,
            각 ViewChange에는 최대 O(n)개의 prepared 인증서가 포함됩니다. 이를 다시 모든 replica에게
            전송하므로 O(n) × O(n) × O(n) = O(n³)입니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 한계</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">O(n²) 통신 복잡도</p>
            <p className="text-sm text-muted-foreground">
              검증자 수가 늘어나면 메시지 수가 기하급수적으로 증가.
              이더리움처럼 수십만 검증자는 불가능.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">O(n³) View Change</p>
            <p className="text-sm text-muted-foreground">
              리더 장애 시 복구 비용이 매우 높음.
              HotStuff가 이를 O(n)으로 개선.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
