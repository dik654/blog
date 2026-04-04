import { codeRefs } from './codeRefs';
import VoteHandlingViz from './viz/VoteHandlingViz';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function VoteHandling({ onCodeRef }: Props) {
  return (
    <section id="vote-handling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">투표 처리: tryAddVote → addVote → 임계값 감지</h2>
      <div className="not-prose mb-8">
        <VoteHandlingViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 2단계 임계값</strong> — HasTwoThirdsAny(아무 블록이든 2/3)와 TwoThirdsMajority(특정 블록 2/3) 구분<br />
          HasTwoThirdsAny → 타임아웃 스케줄(아직 합의 미달), TwoThirdsMajority → 즉시 상태 전이
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 이중 투표 방어</strong> — tryAddVote에서 ErrVoteConflictingVotes 감지<br />
          evpool.ReportConflictingVotes로 증거 수집 → 다음 블록에 포함하여 슬래싱 트리거
        </p>
      </div>
    </section>
  );
}
