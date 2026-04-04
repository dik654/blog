import TwoPhaseViz from './viz/TwoPhaseViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const tcCode = `HotStuff-2 핵심: timeout-certificate (TC)

기존 HotStuff:
  Prepare → Pre-Commit → Commit
  Pre-Commit = "투표의 투표" (QC의 QC)
  → View Change 시 안전성 보장 역할

HotStuff-2:
  Prepare → Commit (2단계)
  TC = 2f+1 노드의 timeout 메시지 집합
  → View Change 시 TC가 Pre-Commit 역할 대체

TC의 역할:
  - 노드가 view v에서 타임아웃 시 (view, highQC) 전송
  - 2f+1 timeout 수집 → TC 형성
  - 새 리더가 TC 검증 → 안전하게 새 view 시작
  - Pre-Commit 없이도 Safety 보장`;

export default function TwoPhase() {
  return (
    <section id="two-phase" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2단계 프로토콜</h2>
      <div className="not-prose mb-8"><TwoPhaseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Malkhi & Nayak, 2023 — HotStuff-2" citeKey={1} type="paper"
          href="https://eprint.iacr.org/2023/397">
          <p className="italic">
            "We show that in the steady state, two phases suffice for a BFT SMR protocol with linear communication complexity."
          </p>
        </CitationBlock>

        <CodePanel title="timeout-certificate (TC)" code={tcCode}
          annotations={[
            { lines: [3, 6], color: 'sky', note: 'HotStuff: Pre-Commit 필요' },
            { lines: [8, 11], color: 'emerald', note: 'HotStuff-2: TC로 대체' },
            { lines: [13, 18], color: 'amber', note: 'TC 메커니즘 상세' },
          ]} />
      </div>
    </section>
  );
}
