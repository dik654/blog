import ViewChangeViz from './viz/ViewChangeViz';
import { CitationBlock } from '@/components/ui/citation';

export default function ViewChange() {
  return (
    <section id="view-change" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">View Change (리더 교체)</h2>
      <div className="not-prose mb-8"><ViewChangeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Castro & Liskov, OSDI 1999 — §4.4" citeKey={2} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic">
            "View changes provide liveness by allowing the system to make progress when the primary fails."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">View Change 과정</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">1. 타임아웃 감지</p>
            <p className="text-sm">
              Backup이 일정 시간 내 진행 없으면 Primary 장애로 판단.<br />
              VIEW-CHANGE 메시지를 전체 브로드캐스트
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">2. 새 Primary 선출</p>
            <p className="text-sm">
              v+1 = (v+1) mod n 으로 결정론적 교체.<br />
              2f+1 VIEW-CHANGE 수집 → NEW-VIEW 전송
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">3. 상태 복구</p>
            <p className="text-sm">
              이전 view의 prepared 상태를 새 view로 이월.<br />
              Safety 유지: 이미 committed된 값은 변경 불가
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">비용: O(n³)</p>
            <p className="text-sm">
              2f+1개의 VIEW-CHANGE 메시지, 각각에 O(n) 준비 증거 포함.<br />
              HotStuff가 이를 O(n)으로 개선
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
