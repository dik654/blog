import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Operations({ onCodeRef }: Props) {
  return (
    <section id="operations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">오퍼레이션 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-operations', codeRefs['process-operations'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessOperations()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 5가지 오퍼레이션 순서</strong> — Attestation → Deposit → Exit → Slashing 순서 고정<br />
          어테스테이션은 소스/타겟/헤드 + 위원회 비트를 검증<br />
          디포짓은 eth1 Merkle Proof로 검증 후 레지스트리에 추가
        </p>
      </div>
    </section>
  );
}
