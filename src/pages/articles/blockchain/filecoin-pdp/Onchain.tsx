import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Onchain({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="onchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">온체인 검증 &amp; 스케줄링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PDP Actor가 DRAND 비콘으로 챌린지 에폭을 결정. SP가 SubmitProof 메시지로 제출.<br />
          SHA256 재계산 → 머클 루트 복원 → 등록 루트와 대조. 가스 비용이 낮음
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('pdp-main', codeRefs['pdp-main'])} />
          <span className="text-[10px] text-muted-foreground self-center">VerifyOnChain()</span>
        </div>
      </div>
    </section>
  );
}
