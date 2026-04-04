import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Actor 시스템</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Filecoin의 모든 온체인 엔티티는 <strong>Actor</strong>
          <br />
          이더리움 Account와 유사하지만, 코드CID와 상태CID를 추가로 보유
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('state-tree', codeRefs['state-tree'])} />
            <span className="text-[10px] text-muted-foreground self-center">statetree.go</span>
            <CodeViewButton onClick={() => onCodeRef('hamt-find', codeRefs['hamt-find'])} />
            <span className="text-[10px] text-muted-foreground self-center">hamt.go</span>
          </div>
        )}
      </div>
    </section>
  );
}
