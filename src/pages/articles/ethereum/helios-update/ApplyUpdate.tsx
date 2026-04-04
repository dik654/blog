import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ApplyViz from './viz/ApplyViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ApplyUpdate({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="apply-update" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          검증을 통과한 Update는 Store에 적용된다.
          <br />
          finalized 헤더 갱신, 위원회 교체, optimistic 헤더 갱신 순서.
        </p>
        <p className="leading-7">
          <strong>💡 Reth vs Helios:</strong> Reth는 블록 실행 후 상태 트라이를 갱신한다.
          <br />
          Helios는 헤더 2개만 교체한다 — 상태 저장이 없다.
        </p>
      </div>
      <div className="not-prose">
        <ApplyViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-apply', codeRefs['hl-apply'])} />
          <span className="text-[10px] text-muted-foreground">update.rs</span>
        </div>
      </div>
    </section>
  );
}
