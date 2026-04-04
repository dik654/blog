import VoteSetViz from './viz/VoteSetViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function VoteCommit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="vote-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Vote · VoteSet · 2/3+ 판정</h2>
      <div className="not-prose mb-8">
        <VoteSetViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} votesByBlock 맵을 쓰는 이유</strong> — 같은 라운드에서 여러 블록에 투표가 분산될 수 있다.
          blockKey별로 sum을 분리 집계해야 정확한 2/3+ 판정이 가능하다.<br />
          equivocation(이중 투표)도 이 구조에서 탐지한다.
        </p>
      </div>
    </section>
  );
}
