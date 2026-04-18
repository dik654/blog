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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Account execute() 패턴</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Pattern 1: Single Call</p>
              <p className="text-sm text-muted-foreground"><code>execute(address dest, uint256 value, bytes func)</code></p>
              <p className="text-sm text-muted-foreground mt-1"><code>dest.call&#123;value&#125;(func)</code> &rarr; 단일 외부 호출</p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Pattern 2: Batch Call</p>
              <p className="text-sm text-muted-foreground"><code>executeBatch(address[] dest, uint256[] value, bytes[] func)</code></p>
              <p className="text-sm text-muted-foreground mt-1">여러 tx를 한 UserOp로 &mdash; loop로 순차 실행</p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Pattern 3: With Return Data</p>
              <p className="text-sm text-muted-foreground"><code>executeCall(...)</code> &rarr; <code>bytes memory result</code></p>
              <p className="text-sm text-muted-foreground mt-1">호출 결과를 반환값으로 받는 패턴</p>
            </div>
            <div className="rounded-lg border border-red-500/30 p-4">
              <p className="font-semibold text-sm text-red-400 mb-2">Pattern 4: Delegatecall (주의)</p>
              <p className="text-sm text-muted-foreground"><code>executeDelegate(address dest, bytes data)</code></p>
              <p className="text-sm text-muted-foreground mt-1"><code>dest.delegatecall(data)</code> &mdash; 권한 위임, storage 접근 가능</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-muted-foreground mb-2">Security: <code>onlyEntryPoint</code> modifier</p>
            <p className="text-sm text-muted-foreground">
              <code>msg.sender == address(entryPoint) || msg.sender == owner</code> &mdash; EntryPoint 또는 owner만 실행 가능
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">UserOperationEvent</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>UserOperationEvent</code> &mdash; EntryPoint emits after each UserOp</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div><code>userOpHash</code>: <code>bytes32</code> (indexed)</div>
              <div><code>sender</code>: <code>address</code> (indexed)</div>
              <div><code>paymaster</code>: <code>address</code> (indexed)</div>
              <div><code>nonce</code>: <code>uint256</code></div>
              <div><code>success</code>: <code>bool</code></div>
              <div><code>actualGasCost</code>: <code>uint256</code></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mt-3">
              <div><strong>용도</strong>: Indexer 모니터링, TX 상태 추적, Analytics, Fraud detection</div>
              <div><strong>관련 이벤트</strong>: <code>AccountDeployed</code>, <code>UserOperationRevertReason</code>, <code>PrefundWithdrawal</code></div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Post-execution State</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code>account.balance</code> 갱신 (value 전송)</li>
              <li>storage 변경 (<code>callData</code> 실행 결과)</li>
              <li>nonce 증가</li>
              <li>deposit 차감</li>
              <li>events 기록</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">Gas Accounting (final)</p>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p><code>paid = actualGasCost = actualGasUsed * effectiveGasPrice</code></p>
              <p>Beneficiary (bundler) receives: <strong>paid</strong></p>
              <p>Sender refund: <strong>(prefund - paid)</strong> &rarr; back to deposit</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
