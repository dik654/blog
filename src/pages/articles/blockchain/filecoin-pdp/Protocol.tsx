import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Protocol({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SHA2 챌린지 &amp; 160바이트 응답</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DRAND 비콘으로 랜덤 오프셋 결정. SP는 해당 오프셋에서 160B를 읽고 SHA256 해시를 계산.<br />
          머클 경로(siblings)를 함께 제출해 리프가 루트에 속함을 증명
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('pdp-main', codeRefs['pdp-main'])} />
          <span className="text-[10px] text-muted-foreground self-center">GenerateProof()</span>
        </div>
      </div>
    </section>
  );
}
