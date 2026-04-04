import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Kzg({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="kzg" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG Commitment 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-validate', codeRefs['blob-validate'])} />
          <span className="text-[10px] text-muted-foreground self-center">KZG 검증 흐름</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-4844-standalone', codeRefs['header-4844-standalone'])} />
          <span className="text-[10px] text-muted-foreground self-center">헤더 blob gas 독립 검증</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>왜 versioned hash?</strong> — commitment에서 SHA256 + 버전 바이트(0x01)로 변환.<br />
          향후 KZG가 아닌 다른 커밋먼트 방식으로 교체 가능하도록 버전 바이트를 포함합니다.
        </p>
        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-3">
          <strong>point evaluation precompile</strong> — KZG precompile(0x0a)은 L2가<br />
          L1 blob의 특정 지점을 검증할 때 사용. 사기 증명에 활용 가능합니다.
        </p>
      </div>
    </section>
  );
}
