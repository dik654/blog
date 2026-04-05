import ExecContextViz from './viz/ExecContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ExecutionContext({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="execution-context" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 컨텍스트: CALL vs DELEGATECALL</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM은 컨트랙트 간 호출 시 새로운 실행 프레임 생성
          <br />
          CALL — 대상 컨트랙트의 storage 사용, msg.sender = 호출자
          <br />
          DELEGATECALL — 호출자의 storage 사용, msg.sender 유지 → 프록시 패턴의 핵심
        </p>
      </div>
      <div className="not-prose">
        <ExecContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Call Type 상세 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// CALL (opcode 0xF1)
// - 새 execution context
// - storage = target contract의 storage
// - msg.sender = 호출자 (caller)
// - msg.value = 전달한 ETH
// - 새 gas frame

// Example:
// A.callFn() -> CALL -> B.someFn()
// In B: msg.sender = A, storage = B's storage

// DELEGATECALL (opcode 0xF4, Homestead)
// - 호출자의 storage 사용!
// - msg.sender = 호출자의 msg.sender (원래 sender)
// - msg.value 유지
// - "library" 패턴의 기반

// Example:
// User -> A.call() -> DELEGATECALL -> B.fn()
// In B's code: msg.sender = User, storage = A's storage

// Use case: Proxy pattern
// Proxy contract forwards all calls to Implementation
// - Proxy storage 유지
// - Implementation의 코드 로직 사용
// - 업그레이드 가능 (Implementation 교체)

// STATICCALL (opcode 0xFA, Byzantium)
// - CALL과 같지만 state 변경 금지
// - SSTORE, LOG, CREATE, SELFDESTRUCT, CALL with value 모두 불가
// - view/pure function 강제
// - Re-entrancy 방지

// CALLCODE (opcode 0xF2, DEPRECATED)
// - DELEGATECALL의 예전 버전
// - msg.sender를 current contract로 설정
// - 사용 금지 (DELEGATECALL 사용)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Proxy Pattern 예시</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Proxy Contract (EIP-1967 storage pattern)
contract Proxy {
    // Implementation address를 특정 slot에 저장
    bytes32 private constant IMPL_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    fallback() external payable {
        address impl = _implementation();
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    function upgrade(address newImpl) external onlyAdmin {
        assembly { sstore(IMPL_SLOT, newImpl) }
    }
}

// Implementation V1
contract LogicV1 {
    uint256 public counter;
    function increment() external { counter += 1; }
}

// Implementation V2 (upgrade)
contract LogicV2 {
    uint256 public counter;  // 같은 slot 유지 필수!
    function increment() external { counter += 2; }
}

// 업그레이드 흐름
// 1) LogicV1 배포
// 2) Proxy에 LogicV1 설정
// 3) Users가 Proxy 주소로 tx
// 4) Upgrade: Proxy admin이 Proxy의 IMPL_SLOT 변경
// 5) Now tx가 LogicV2 코드 실행, 같은 storage`}</pre>

      </div>
    </section>
  );
}
