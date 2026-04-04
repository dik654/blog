import ThreePhaseViz from './viz/ThreePhaseViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const msgCode = `PBFT 메시지 구조 (각 단계별):

PRE-PREPARE: ⟨PRE-PREPARE, v, n, d⟩_σp
  v = view 번호, n = 시퀀스 번호
  d = 요청 다이제스트, σp = Primary 서명

PREPARE: ⟨PREPARE, v, n, d, i⟩_σi
  i = replica 번호
  2f+1 PREPARE 수집 → prepared(m, v, n) = true

COMMIT: ⟨COMMIT, v, n, D(m), i⟩_σi
  2f+1 COMMIT 수집 → committed-local
  → 요청 실행 → Reply 전송`;

export default function ThreePhase() {
  return (
    <section id="three-phase" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3단계 프로토콜</h2>
      <div className="not-prose mb-8"><ThreePhaseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Castro & Liskov, OSDI 1999 — §4.2" citeKey={1} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic">
            "The three-phase protocol ensures that non-faulty replicas agree on a total order for the requests within a view."
          </p>
        </CitationBlock>

        <CodePanel title="PBFT 메시지 구조" code={msgCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'Pre-prepare: 리더가 순서 제안' },
            { lines: [7, 9], color: 'emerald', note: 'Prepare: 전체 합의 O(n²)' },
            { lines: [11, 13], color: 'amber', note: 'Commit: 최종 확정' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">통신 복잡도 분석</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Pre-prepare</p>
            <p className="text-sm">1 → n-1 = O(n)</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Prepare</p>
            <p className="text-sm">n × (n-1) = O(n²)</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Commit</p>
            <p className="text-sm">n × (n-1) = O(n²)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
