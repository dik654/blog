import { CitationBlock } from '../../../../components/ui/citation';
import PBFTFlowViz from './viz/PBFTFlowViz';
import PBFTSequenceViz from './viz/PBFTSequenceViz';

export default function PBFT() {
  return (
    <section id="pbft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT (Practical Byzantine Fault Tolerance)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PBFT(1999, Castro &amp; Liskov) — 최초의 실용적 BFT 프로토콜<br />
          비동기 네트워크에서 safety(잘못된 합의 불가) 보장<br />
          부분 동기(partial synchrony)에서 liveness(합의 진행 보장) 제공<br />
          f개 비잔틴 노드 허용에 최소 3f+1개 노드 필요
        </p>

        <CitationBlock source="Castro & Liskov, OSDI 1999 — §4" citeKey={1} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic">
            "The algorithm works correctly in asynchronous systems like the Internet and it incorporates
            important optimizations that allow it to perform well so that it can be used in practice."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계 프로토콜</h3>
        <div className="not-prose mb-6"><PBFTSequenceViz /></div>
        <PBFTFlowViz />

        <CitationBlock source="PBFT 논문 Figure 1 — 정상 경로 메시지 패턴" citeKey={2} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic">
            "The algorithm requires 3f+1 replicas to tolerate f faults."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">View Change (리더 교체)</h3>
        <p>
          <strong>PBFT</strong> — 타임아웃 → ViewChange 브로드캐스트 → 2f+1 수집 → NewView 전송, 통신 복잡도 O(n³)<br />
          <strong>이더리움</strong> — 슬롯 제안자 미스 → LMD-GHOST 포크 선택 규칙으로 자동 진행, View Change 불필요<br />
          <strong>CometBFT</strong> — 타임아웃 → 자동 Round+1 진행, O(n²)로 PBFT보다 단순
        </p>

        <CitationBlock source="PBFT 논문 §4.4 View Changes" citeKey={3} type="paper">
          <p className="italic">
            "A replica suspects the primary is faulty if it hasn't received a valid message within a timeout."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 한계</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">O(n²) 통신 복잡도</p>
            <p className="text-sm">
              검증자 수가 늘어나면 메시지 수가 기하급수적으로 증가.
              이더리움처럼 수십만 검증자는 불가능.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">O(n³) View Change</p>
            <p className="text-sm">
              리더 장애 시 복구 비용이 매우 높음.
              HotStuff가 이를 O(n)으로 개선.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
