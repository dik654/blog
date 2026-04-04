import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ExecutionPayload({ onCodeRef }: Props) {
  return (
    <section id="execution-payload" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 페이로드 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validate-execution', codeRefs['validate-execution'])} />
          <span className="text-[10px] text-muted-foreground self-center">validateExecutionOnBlock()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Optimistic Sync</strong> — EL이 SYNCING을 반환하면 CL은 블록을 낙관적으로 수락<br />
          이후 EL 동기화 완료 시 재검증하여 최종 확정<br />
          VALID/INVALID/SYNCING 3가지 응답 상태로 분기
        </p>
      </div>
    </section>
  );
}
