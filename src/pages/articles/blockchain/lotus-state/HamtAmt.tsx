import { codeRefs } from './codeRefs';
import HamtDetailViz from './viz/HamtDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function HamtAmt({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="hamt-amt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HAMT & AMT 자료구조</h2>
      <div className="not-prose mb-8">
        <HamtDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 비트폭 5가 최적인 이유</strong> — 2^5=32 슬롯/노드
          <br />
          IPLD 블록 크기(~256KB)와 I/O 깊이의 균형점
          <br />
          버킷 크기 3은 해시 충돌 시 리프 분할 빈도를 최소화
        </p>
      </div>
    </section>
  );
}
