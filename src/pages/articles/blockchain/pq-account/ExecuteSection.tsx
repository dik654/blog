import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ExecuteViz from './viz/ExecuteViz';
import { codeRefs } from './codeRefs';

export default function ExecuteSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execute" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">execute() 실행 &amp; 상태 변경</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>_executeUserOp()</code>는 검증 통과한 UserOp의 callData를 스마트 계정에 전달합니다.
          <code>op.sender.call&#123;gas: callGasLimit&#125;(op.callData)</code>로 실행을 위임합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('execute-userop', codeRefs['execute-userop'])} />
          <span className="text-[10px] text-muted-foreground self-center">_executeUserOp() 내부</span>
        </div>
        <p>
          실행 결과는 <code>UserOperationEvent</code>로 기록됩니다.
          success=false여도 트랜잭션 자체는 revert되지 않습니다.
          가스비는 이미 Phase 1에서 확보했으므로, 실패해도 번들러에게 보상됩니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — 실행 실패가 번들러 손실이 아닌 이유: Phase 1에서 예치금을 선차감했으므로,
          callData 실행이 실패해도 가스비는 번들러에게 정상 지급됩니다.
        </p>
      </div>
      <div className="mt-8"><ExecuteViz /></div>
    </section>
  );
}
