import { codeRefs } from './codeRefs';
import ReceiveRoutineViz from './viz/ReceiveRoutineViz';
import type { CodeRef } from '@/components/code/types';

export default function ReceiveRoutine({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="receive-routine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">receiveRoutine & handleMsg 디스패치</h2>
      <div className="not-prose mb-8">
        <ReceiveRoutineViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 단일 goroutine 설계</strong> — 락 없이 채널 직렬화로 동시성 버그 원천 차단<br />
          internalMsgQueue → WriteSync(fsync) → 크래시 후 자신의 서명 복구로 이중 서명 방지
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 handleMsg 디스패치</strong> — ProposalMessage → setProposal, VoteMessage → tryAddVote<br />
          BlockPartMessage는 파트 조립 완성 시 enterPrevote로 즉시 전이
        </p>
      </div>
    </section>
  );
}
