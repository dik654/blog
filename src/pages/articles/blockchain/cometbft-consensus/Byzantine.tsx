import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CodeViewButton } from '@/components/code';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Byzantine({ onCodeRef }: Props) {
  return (
    <section id="byzantine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비잔틴 탐지 & 증거 수집</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('try-add-vote', codeRefs['try-add-vote'])} />
          <span className="text-[10px] text-muted-foreground self-center">tryAddVote() — 이중 투표 감지</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 이중 투표 탐지</strong> — 같은 높이/라운드/타입에 다른 BlockID 투표 발견<br />
          evpool.ReportConflictingVotes(voteA, voteB) → DuplicateVoteEvidence 생성<br />
          다음 블록 제안에 포함하여 슬래싱 트리거
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 1/3 이하 비잔틴 보장</strong> — 정직 2/3+ 시 Lock 메커니즘이 분기 방지<br />
          비잔틴 {'>'} 1/3 시 liveness 상실, safety는 유지
        </p>
      </div>
    </section>
  );
}
