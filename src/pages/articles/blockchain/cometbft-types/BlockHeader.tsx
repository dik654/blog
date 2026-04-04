import BlockStructViz from './viz/BlockStructViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BlockHeader({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="block-header" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Block & Header 구조체</h2>
      <div className="not-prose mb-8">
        <BlockStructViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Header.Hash()가 Merkle 트리인 이유</strong> — 14개 필드를 단순 concat 후 SHA256하면
          어떤 필드가 변경됐는지 증명 불가.<br />
          Merkle 트리를 쓰면 변경된 필드만 O(log n) 증명이 가능하다.
        </p>
      </div>
    </section>
  );
}
