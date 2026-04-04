import ChainedVotingViz from './viz/ChainedVotingViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const commitRuleCode = `Chained HotStuff 3-chain Commit Rule:

View v:   리더가 B1 제안 → prepareQC(B1) 생성
View v+1: 리더가 B2 제안 → B2.qc = prepareQC(B1)
           → B1은 pre-committed
View v+2: 리더가 B3 제안 → B3.qc = prepareQC(B2)
           → B2 pre-committed, B1 committed
View v+3: B3 committed → B1 DECIDE (확정)

3-chain rule:
  B1.view + 1 == B2.view
  B2.view + 1 == B3.view
  → B1이 확정됨 (3개 연속 QC 체인)`;

export default function ChainedVoting() {
  return (
    <section id="chained-voting" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체인 투표 (Chained HotStuff)</h2>
      <div className="not-prose mb-8"><ChainedVotingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Yin et al., PODC 2019 — §5 Chained HotStuff" citeKey={1} type="paper"
          href="https://arxiv.org/abs/1803.05069">
          <p className="italic">
            "Chained HotStuff pipelines the protocol phases across views, achieving a one-block latency in the steady state."
          </p>
        </CitationBlock>

        <CodePanel title="3-chain Commit Rule" code={commitRuleCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: 'View v: B1 Prepare' },
            { lines: [5, 7], color: 'emerald', note: 'View v+1: B1 Pre-Commit' },
            { lines: [8, 9], color: 'amber', note: 'View v+2~v+3: B1 Commit & Decide' },
            { lines: [11, 14], color: 'violet', note: '3-chain 조건' },
          ]} />
      </div>
    </section>
  );
}
