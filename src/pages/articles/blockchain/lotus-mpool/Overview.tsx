import ContextViz from './viz/ContextViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메시지 풀 구조</h2>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MessagePool — 블록 포함 전 대기하는 메시지 저장소
          <br />
          가스 가격 기반 정렬 → 마이너가 수익 높은 메시지 우선 선택
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('mpool-add', codeRefs['mpool-add'])} />
            <span className="text-[10px] text-muted-foreground self-center">messagepool.go — Add()</span>
            <CodeViewButton onClick={() => onCodeRef('mpool-estimate', codeRefs['mpool-estimate'])} />
            <span className="text-[10px] text-muted-foreground self-center">GasEstimate</span>
          </div>
        )}
      </div>
    </section>
  );
}
