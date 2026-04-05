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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// stateTransition.execute() (geth)

// Phase 1: Pre-validation
// - Sender signature verify
// - Nonce match
// - Balance check (>= gas*gasPrice + value)
// - Intrinsic gas (21000 base + calldata cost)

// Phase 2: Gas deduction
// - sender.balance -= gas * gasPrice  (upfront)
// - Block's gas pool -= gas

// Phase 3: Execute
// - if to == nil: Create(contract)
// - else: Call(recipient, value, data)
// - Run EVM interpreter
// - Track gas consumed

// Phase 4: Refund
// - Gas refund 계산 (EIP-3529 제한)
// - sender.balance += remaining_gas * gasPrice
// - miner.balance += used_gas * gasPrice (coinbase)

// Phase 5: Post-processing
// - Create receipt (logs, status, gas used)
// - Update state root
// - EIP-1559: burn base fee
// - EIP-4844: blob fee 처리

// Gas Accounting
// - intrinsic: 21000 (base)
// - per byte zero: 4
// - per byte non-zero: 16
// - create: + 32000
// - access list: per account/slot

// Example
// simple transfer: 21000 gas
// ERC20 transfer: ~50000 gas
// Uniswap swap: ~150000 gas
// Complex DeFi: 500000+ gas`}</pre>

      </div>
    </section>
  );
}
