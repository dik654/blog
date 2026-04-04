import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Contribution({ onCodeRef }: Props) {
  return (
    <section id="contribution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기여 집계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-sync-aggregate', codeRefs['process-sync-aggregate'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessSyncAggregate()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 4개 서브넷 집계</strong> — 512명을 4개 서브넷(각 128명)으로 분할<br />
          각 서브넷에서 BLS aggregate → Contribution → SyncAggregate<br />
          512비트 참여 비트필드 + 1개 집계 BLS 서명으로 블록에 포함
        </p>
        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 보상 & 패널티</strong> — 참여 보상 = totalActiveBalance / 512 / 32 per slot<br />
          불참 시 동일 금액 차감 — 참여 인센티브로 높은 참여율 유지<br />
          라이트 클라이언트는 SyncAggregate 검증만으로 헤드 확인
        </p>
      </div>
    </section>
  );
}
