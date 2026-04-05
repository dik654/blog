import NativeAAViz from './viz/NativeAAViz';
import CodePanel from '@/components/ui/code-panel';

const nativeCode = `// Native Account Abstraction — 프로토콜 레벨 AA

// EIP-7701: Native AA (type 4 트랜잭션)
//   EVM 프로토콜에 AA를 직접 내장
//   별도의 Bundler/EntryPoint 불필요
//   계정 코드에 validateTransaction() 구현
//   EL(실행 레이어)이 직접 검증 및 실행

// RIP-7560: Rollup 표준 Native AA
//   L2 롤업에서의 AA 표준
//   EntryPoint 로직을 프리컴파일로 구현
//   가스 효율 향상 — 컨트랙트 호출 오버헤드 제거

// 비교: ERC-4337 vs Native AA
//   ERC-4337: 프로토콜 변경 없음, Bundler 인프라 필요
//   Native AA: 프로토콜 변경 필요, 더 낮은 가스, 더 간단한 구조
//   장기적으로 Native AA가 ERC-4337을 대체할 전망`;

const nativeAnnotations: { lines: [number, number]; color: 'sky' | 'emerald' | 'amber'; note: string }[] = [
  { lines: [3, 7], color: 'sky', note: 'EIP-7701 — EL 내장 AA' },
  { lines: [9, 12], color: 'emerald', note: 'RIP-7560 — 롤업 Native AA' },
  { lines: [14, 17], color: 'amber', note: 'ERC-4337 vs Native AA 비교' },
];

export default function NativeAA() {
  return (
    <section id="native-aa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Native AA: EIP-7701 & RIP-7560</h2>
      <div className="not-prose mb-8"><NativeAAViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ERC-4337은 프로토콜 변경 없이 AA를 구현하지만,
          Bundler 인프라와 EntryPoint 컨트랙트 호출 오버헤드가 존재합니다.<br />
          Native AA는 프로토콜 레벨에서 AA를 지원하여 이 오버헤드를 제거합니다.
        </p>
        <CodePanel title="Native AA 제안" code={nativeCode}
          annotations={nativeAnnotations} />
        <p className="leading-7">
          zkSync Era, StarkNet 등 일부 L2는 이미 Native AA를 구현했습니다.<br />
          이더리움 L1은 EIP-7701로 점진적 도입을 논의 중입니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Native AA 구현 및 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Native Account Abstraction Landscape
//
// Timeline:
//   2020: EIP-2938 (Native AA tx type) — rejected
//   2021: ERC-4337 (pseudo-AA) — adopted
//   2023: EIP-7702 (set code to EOA) — simpler stepping stone
//   2024: EIP-7701/RIP-7560 (Native AA) — proposed

// EIP-7702: Set EOA Code (Pectra, 2025):
//
//   Idea: EOA can delegate to a smart contract
//   New tx type 0x04: authorization list
//
//   Transaction:
//     type: 0x04
//     authorization_list: [
//       { chain_id, address, nonce, signature }
//     ]
//
//   Effect: EOA code becomes "0xef0100 ++ address"
//   EOA now executes smart contract code
//
//   Advantages:
//     - Existing EOA can become smart wallet
//     - No deployment needed
//     - Revocable (new auth replaces old)
//
//   Caveats:
//     - Storage still belongs to EOA
//     - nonce still incremented for every tx
//     - Signature still required to authorize

// EIP-7701 (Native AA, proposed):
//
//   New tx type 0x04 (AA_TX_TYPE)
//
//   Execution phases:
//     1. validation phase:
//        sender.validateTransaction(tx)
//          - gas-limited frame
//          - sender's code validates
//     2. paymaster phase (optional):
//        paymaster.validatePaymasterTransaction(tx)
//     3. execution phase:
//        sender.executeTransaction(tx)
//     4. post-op phase (optional):
//        paymaster.postPaymasterTransaction()
//
//   All phases in ONE transaction (no bundler!)
//
//   Gas rules:
//     - Validation gas: separate budget
//     - Execution gas: separate budget
//     - Postop gas: separate budget

// RIP-7560 (Rollup Native AA):
//
//   Same as EIP-7701 but as Rollup Improvement Proposal
//   Targets L2s first (easier to deploy)
//   Reference implementation: Geth 7560 branch

// zkSync Era Native AA (live since 2023):
//
//   Every account is a smart contract (no EOAs!)
//
//   contract Account is IAccount {
//     function validateTransaction(
//       bytes32 txHash,
//       bytes32 suggestedSignedHash,
//       Transaction calldata transaction
//     ) external payable returns (bytes4 magic);
//
//     function executeTransaction(...) external;
//     function payForTransaction(...) external;
//     function prepareForPaylord(...) external;
//   }
//
//   DefaultAccount: ECDSA-like behavior
//   Custom accounts: multisig, MPC, social recovery

// StarkNet Native AA (live since 2020):
//
//   All accounts are contracts
//   Cairo language for account logic
//
//   __validate__ entrypoint
//   __execute__ entrypoint
//   __validate_declare__ entrypoint
//   __validate_deploy__ entrypoint
//
//   StarkNet tx:
//     - No "from" (contract validates self)
//     - No built-in signature scheme
//     - 100% customizable validation

// Comparison matrix:
//
//                    ERC-4337   EIP-7702   EIP-7701   zkSync
//   Protocol change: No         Yes (mini) Yes (full) Yes
//   Bundler needed:  Yes        No         No         No
//   EOA support:     Coexists   Delegates  Coexists   None
//   Gas cost:        Higher     Medium     Low        Low
//   Live on:         All EVM    Pectra+    Proposed   Live
//   Complexity:      High       Low        Medium     Medium

// Security considerations (Native AA):
//
//   1) Griefing attacks:
//      Invalid validation wastes block gas
//      Mitigation: per-sender rate limits, validation gas cap
//
//   2) Front-running validation:
//      Attacker submits same validation, depletes nonce
//      Mitigation: atomic validate+execute
//
//   3) Storage access:
//      Account can read any storage during validation
//      Mitigation: validation gas limits, EVM rules
//
//   4) Cross-account calls during validation:
//      Could enable DoS or reentrancy
//      Mitigation: RIP-7562 opcode/storage restrictions`}
        </pre>
      </div>
    </section>
  );
}
