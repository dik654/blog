import { codeRefs } from './codeRefs';
import CListViz from './viz/CListViz';
import type { CodeRef } from '@/components/code/types';

export default function CList({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="clist" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CListMempool 이중 연결 리스트</h2>
      <div className="not-prose mb-8">
        <CListViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 CList를 쓰는 이유</strong> — Go slice 중간 삭제 O(n).
          멤풀은 블록마다 수백~수천 TX를 한꺼번에 제거해야 하므로 O(1) linked list 필수.<br />
          txByKey map으로 O(1) 조회 보장, NextWaitChan()으로 CPU 낭비 없이 대기.
        </p>
      </div>
    </section>
  );
}
