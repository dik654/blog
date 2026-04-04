import BuilderFlowViz from './viz/BuilderFlowViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function OpStackIntegration({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="op-stack-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OP Stack 통합</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          reth 실행 클라이언트 확장: 커스텀 TX 풀 + 페이로드 빌더<br />
          rollup-boost로 외부 블록 빌더 지원
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('wc-tx-pool', codeRefs['wc-tx-pool'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              pool — TX 풀
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('wc-payload-builder', codeRefs['wc-payload-builder'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              builder
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <BuilderFlowViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
