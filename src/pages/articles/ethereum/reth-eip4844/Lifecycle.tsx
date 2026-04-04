import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import LifecycleViz from './viz/LifecycleViz';
import type { CodeRef } from '@/components/code/types';

export default function Lifecycle({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob 생명주기</h2>
      <div className="not-prose mb-8"><LifecycleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('canon-tracker', codeRefs['canon-tracker'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlobStoreCanonTracker — finalization 정리</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-4844-standalone', codeRefs['header-4844-standalone'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_4844_header_standalone()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>왜 BTreeMap?</strong> — 블록 번호 순서대로 정렬되므로<br />
          finalized 블록까지 범위 삭제가 효율적입니다. first_entry()로 O(1) 접근.
        </p>
        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-3">
          <strong>re-org 처리</strong> — re-org 시 blob TX가 재주입됩니다.<br />
          이때 BlobStore에 blob이 남아있으면 KZG 재검증을 건너뜁니다.
        </p>
      </div>
    </section>
  );
}
