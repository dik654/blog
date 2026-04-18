import ExecFlowViz from './viz/ExecFlowViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ExecutionFlow({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execution-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">트랜잭션 → EVM 실행 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          블록에 포함된 트랜잭션이 상태 전이를 일으키는 전체 과정
          <br />
          geth의 <code>stateTransition.execute()</code>가 5단계로 처리
        </p>
      </div>
      <div className="not-prose mb-8">
        <ExecFlowViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          {/* 트랜잭션에 받는 주소(To)가 지정되지 않은 경우 */}
          msg.To == nil이면 컨트랙트 생성(Create) — init code를 실행하여 결과를 배포
          <br />
          msg.To != nil이면 일반 호출(Call) — 대상 주소의 코드를 인터프리터 루프로 실행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Transaction Execution 5단계</h3>
        <p className="text-sm text-muted-foreground mb-4">
          <code>stateTransition.execute()</code> (geth) 기준
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Phase 1: Pre-validation</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Sender signature verify</li>
              <li>Nonce match</li>
              <li>Balance check: <code className="text-xs">&gt;= gas*gasPrice + value</code></li>
              <li>Intrinsic gas: <code className="text-xs">21000</code> base + calldata cost</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Phase 2: Gas Deduction</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">sender.balance -= gas * gasPrice</code> (upfront)</li>
              <li>Block gas pool -= gas</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">Phase 3: Execute</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">to == nil</code> → <code className="text-xs">Create(contract)</code></li>
              <li><code className="text-xs">to != nil</code> → <code className="text-xs">Call(recipient, value, data)</code></li>
              <li>Run EVM interpreter + track gas consumed</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Phase 4: Refund</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Gas refund 계산 (EIP-3529 제한)</li>
              <li><code className="text-xs">sender.balance += remaining_gas * gasPrice</code></li>
              <li><code className="text-xs">miner.balance += used_gas * gasPrice</code> (coinbase)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">Phase 5: Post-processing</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Create receipt (logs, status, gas used) + Update state root</li>
              <li>EIP-1559: burn base fee / EIP-4844: blob fee 처리</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Gas Accounting</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Intrinsic: <code className="text-xs">21000</code> (base)</li>
              <li>Per zero byte: <code className="text-xs">4</code> / Non-zero: <code className="text-xs">16</code></li>
              <li>Create: <code className="text-xs">+32000</code></li>
              <li>Access list: per account/slot</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">Gas 사용 예시</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Simple transfer: <code className="text-xs">21,000</code></li>
              <li>ERC20 transfer: <code className="text-xs">~50,000</code></li>
              <li>Uniswap swap: <code className="text-xs">~150,000</code></li>
              <li>Complex DeFi: <code className="text-xs">500,000+</code></li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
