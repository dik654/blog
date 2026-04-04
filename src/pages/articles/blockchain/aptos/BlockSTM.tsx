import BlockSTMViz from './viz/BlockSTMViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function BlockSTM({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="block-stm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Block-STM 병렬 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Block-STM — Software Transactional Memory 기반 낙관적 병렬 실행<br />
          Solana Sealevel과 달리 사전 계정 선언 없이 모든 TX 동시 실행, 충돌 시 재실행
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('apt-blockstm-exec', codeRefs['apt-blockstm-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              executor.rs
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('apt-mvhashmap', codeRefs['apt-mvhashmap'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              MVHashMap
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <BlockSTMViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
