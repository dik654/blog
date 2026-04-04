import AptosArchViz from './viz/AptosArchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Aptos 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Aptos — Meta Diem 파생 L1 블록체인<br />
          <strong>Block-STM 병렬 실행</strong> + <strong>Move 언어</strong> + DiemBFT v4 합의
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('apt-blockstm-exec', codeRefs['apt-blockstm-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              executor.rs — Block-STM 코어
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <AptosArchViz />
      </div>
    </section>
  );
}
