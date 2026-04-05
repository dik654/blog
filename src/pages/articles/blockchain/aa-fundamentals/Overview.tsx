import AAModelViz from './viz/AAModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EOA vs CA: Account Abstraction 필요성</h2>
      <div className="not-prose mb-8"><AAModelViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이더리움 계정은 EOA(Externally Owned Account)와 CA(Contract Account) 두 종류입니다.<br />
          EOA만이 트랜잭션을 개시할 수 있고, 반드시 ECDSA 서명이 필요합니다.<br />
          이 제약이 사용자 경험과 보안 모두에 한계를 만듭니다.
        </p>

        <h3>EOA의 한계</h3>
        <p className="leading-7">
          시드 구문 분실 시 자산 영구 손실. 서명 알고리즘 변경 불가.<br />
          가스비를 반드시 ETH로 지불. 단일 트랜잭션에 하나의 작업만 가능.<br />
          소셜 복구, 일일 한도 등 프로그래머블 보안 정책을 적용할 수 없습니다.
        </p>

        <h3>Account Abstraction (AA)</h3>
        <p className="leading-7">
          AA는 계정의 유효성 검증 로직을 프로그래밍 가능하게 합니다.<br />
          서명 알고리즘, 가스 지불 방식, 트랜잭션 배치를
          스마트 컨트랙트 레벨에서 커스터마이즈할 수 있습니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">EOA vs CA 기술적 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ethereum Account Types
//
// EOA (Externally Owned Account):
//   - Address = keccak256(pubkey)[12:]
//   - Secret: ECDSA private key (secp256k1)
//   - Can initiate transactions
//   - Signature required: yes (always)
//   - Code: none
//   - Storage: none
//   - Cost: free to create (no on-chain action)
//
// CA (Contract Account):
//   - Address = keccak256(rlp([sender, nonce]))[12:]
//     or keccak256(0xff ++ sender ++ salt ++ keccak256(initcode))[12:] (CREATE2)
//   - Can NOT initiate transactions (pre-AA)
//   - Code: EVM bytecode
//   - Storage: 2^256 slots
//   - Cost: deployment gas

// Pre-AA transaction flow:
//
//   User (EOA) → signs tx with private key
//     ↓
//   EVM: tx.from must be EOA
//   EVM: ECDSA verify (built-in, no choice)
//     ↓
//   Execute: either transfer or contract call

// Limitations of EOA model:
//
//   1. Fixed signature scheme (only ECDSA secp256k1)
//      → No post-quantum signatures
//      → No biometric/Passkey auth
//      → No BLS aggregation
//
//   2. Fixed fee token (ETH only)
//      → User must hold ETH for gas
//      → Onboarding friction
//
//   3. Atomic single call
//      → approve + swap = 2 transactions
//      → 2 signatures required
//
//   4. No recovery mechanism
//      → Lost seed = lost funds forever
//      → No social recovery
//
//   5. No spending limits
//      → Full authority on every signature
//      → No time-bounded keys

// AA unlocks:
//
//   validateUserOp(UserOperation op) external returns (uint256 validationData) {
//     // ANY validation logic
//     // ECDSA? Yes
//     // WebAuthn? Yes
//     // Multisig? Yes
//     // ZK proof? Yes
//     // Time-based? Yes
//     // Social recovery check? Yes
//   }
//
//   Key insight: validation becomes programmable

// Historical approaches to AA:
//
//   2016: Vitalik's original proposal (EIP-86)
//     - Protocol-level, never implemented
//     - Too complex for protocol
//
//   2019: Argent, Gnosis Safe (multisig wallets)
//     - Hack around EOA model
//     - User still needs EOA + gas to deploy
//
//   2020: EIP-2938 (AA transaction type)
//     - Rejected, too invasive to protocol
//
//   2021: ERC-4337 proposal (Vitalik, Bunz, et al.)
//     - No protocol changes!
//     - Uses alternative mempool + EntryPoint
//
//   2023: ERC-4337 deployed on Ethereum mainnet
//
//   2024+: EIP-7702 + EIP-7701 Native AA
//     - Hybrid: EOA delegation to smart contract
//     - Protocol-level Native AA roadmap`}
        </pre>
      </div>
    </section>
  );
}
