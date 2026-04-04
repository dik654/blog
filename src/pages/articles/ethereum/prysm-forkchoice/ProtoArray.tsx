import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProtoArray({ onCodeRef }: Props) {
  return (
    <section id="protoarray" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">doubly-linked-tree</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fc-store', codeRefs['fc-store'])} />
          <span className="text-[10px] text-muted-foreground self-center">ForkChoiceStore 구조체</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 배열 → 트리 전환</strong> — proto-array(배열)에서 doubly-linked-tree로 교체<br />
          삽입 O(1), 삭제 O(1) — 포인터 변경만으로 finality 후 프루닝<br />
          bestDescendant 캐싱으로 computeHead 시 서브트리 재탐색 불필요
        </p>
      </div>
    </section>
  );
}
