import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function DutyAssignment({ onCodeRef }: Props) {
  return (
    <section id="duty-assignment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">의무 할당 & 슬롯 루프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validator-loop', codeRefs['validator-loop'])} />
          <span className="text-[10px] text-muted-foreground self-center">Run() 메인 루프</span>
          <CodeViewButton onClick={() => onCodeRef('roles-at', codeRefs['roles-at'])} />
          <span className="text-[10px] text-muted-foreground self-center">RolesAt()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 고루틴 병렬 실행</strong> — ProposeBlock, SubmitAttestation, SubmitSyncCommitteeMessage를 각각 고루틴으로 실행<br />
          하나의 슬롯에서 여러 역할이 동시에 할당될 수 있기 때문<br />
          비콘 노드에 gRPC로 DutiesAt(slot) 질의 → 역할 분기
        </p>
      </div>
    </section>
  );
}
