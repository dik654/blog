import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import EntryPointViz from './viz/EntryPointViz';
import { codeRefs } from './codeRefs';

export default function EntryPointSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="entrypoint" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EntryPoint.handleOps() 내부 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>handleOps()</code>는 번들러가 수집한 UserOp 배열을 3단계로 처리합니다.
          검증과 실행을 분리하여, 하나의 실패가 전체 번들에 영향을 주지 않도록 설계되었습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('handle-ops', codeRefs['handle-ops'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleOps() 전체</span>
          <CodeViewButton onClick={() => onCodeRef('validate-prepayment', codeRefs['validate-prepayment'])} />
          <span className="text-[10px] text-muted-foreground self-center">_validatePrepayment()</span>
        </div>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — 검증-실행 분리의 이유: Phase 1에서 모든 UserOp의 가스비를 선확보하므로,
          Phase 2 실행 중 가스 부족으로 번들러가 손해보는 것을 방지합니다.
        </p>
      </div>
      <div className="mt-8"><EntryPointViz /></div>
    </section>
  );
}
