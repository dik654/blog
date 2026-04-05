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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Smart Account execute 함수들

// Pattern 1: Single call
function execute(
    address dest,
    uint256 value,
    bytes calldata func
) external onlyEntryPoint {
    (bool success,) = dest.call{value: value}(func);
    require(success, "Execute failed");
}

// Pattern 2: Batch call (여러 tx를 한 userOp로)
function executeBatch(
    address[] calldata dest,
    uint256[] calldata value,
    bytes[] calldata func
) external onlyEntryPoint {
    for (uint i = 0; i < dest.length; i++) {
        (bool success,) = dest[i].call{value: value[i]}(func[i]);
        require(success, "Batch item failed");
    }
}

// Pattern 3: execute with return data
function executeCall(
    address dest,
    uint256 value,
    bytes calldata data
) external onlyEntryPoint returns (bytes memory result) {
    (bool success, bytes memory ret) = dest.call{value: value}(data);
    require(success, "Call failed");
    return ret;
}

// Pattern 4: delegatecall (권한 위임, 주의!)
function executeDelegate(
    address dest,
    bytes calldata data
) external onlyEntryPoint {
    (bool success,) = dest.delegatecall(data);
    require(success, "Delegate failed");
}

// Security: onlyEntryPoint modifier
modifier onlyEntryPoint() {
    require(
        msg.sender == address(entryPoint) || msg.sender == owner,
        "Not authorized"
    );
    _;
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">UserOperationEvent</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// EntryPoint emits after each UserOp

event UserOperationEvent(
    bytes32 indexed userOpHash,
    address indexed sender,
    address indexed paymaster,
    uint256 nonce,
    bool success,
    uint256 actualGasCost,
    uint256 actualGasUsed
);

// 용도
// - Indexer가 이벤트 모니터링
// - UX: "Transaction 상태 추적"
// - Analytics: 성공률, gas usage
// - Fraud detection

// 관련 이벤트
event AccountDeployed(...)         // 최초 배포 시
event UserOperationRevertReason(...) // 실패 reason
event PrefundWithdrawal(...)        // 예치금 출금
event SignatureAggregatorChanged(...) // aggregator 변경

// Post-execution state
// 1) account.balance 갱신 (value 전송)
// 2) storage 변경 (callData 실행)
// 3) nonce 증가
// 4) deposit 차감
// 5) events 기록

// Gas accounting (final)
// paid = actualGasCost = actualGasUsed * effectiveGasPrice
// beneficiary (bundler) receives: paid
// sender refund: (prefund - paid) back to deposit`}</pre>

      </div>
    </section>
  );
}
