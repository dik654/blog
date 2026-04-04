import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function AttestationCreation({ onCodeRef }: Props) {
  return (
    <section id="attestation-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">생성 & 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('submit-attestation', codeRefs['submit-attestation'])} />
          <span className="text-[10px] text-muted-foreground self-center">SubmitAttestation()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 3중 투표 구조</strong> — Source(이전 justified), Target(현재 에폭), Head(헤드 블록)<br />
          슬래싱 방지 DB를 먼저 조회하여 이중 투표/서라운드 투표 차단<br />
          서명 도메인은 DOMAIN_BEACON_ATTESTER 사용
        </p>
      </div>
    </section>
  );
}
