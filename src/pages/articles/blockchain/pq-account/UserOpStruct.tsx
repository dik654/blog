import UserOpViz from './viz/UserOpViz';

export default function UserOpStruct() {
  return (
    <section id="userop-struct" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UserOperation 구조체</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ERC-4337의 <code>UserOperation</code>은 사용자의 의도를 담은 데이터 구조입니다.
          기존 트랜잭션과 달리, EOA의 서명 대신 스마트 계정이 자체적으로 서명을 검증합니다.
        </p>
        <h3>핵심 필드</h3>
        <ul>
          <li><code>sender</code> — 스마트 계정 주소 (EOA가 아님)</li>
          <li><code>nonce</code> — EntryPoint가 관리하는 재사용 방지 카운터</li>
          <li><code>callData</code> — 실행할 함수 호출 (ABI 인코딩)</li>
          <li><code>signature</code> — 하이브리드: ECDSA(65B) + Dilithium(2420B)</li>
        </ul>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — Dilithium 서명은 ECDSA보다 37배 크지만(2420B vs 65B),
          calldata 비용은 EIP-4844 이후 크게 줄었습니다. L2에서는 부담이 더 작습니다.
        </p>
      </div>
      <div className="mt-8"><UserOpViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">UserOperation 전체 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// ERC-4337 UserOperation (PackedUserOperation)

struct UserOperation {
    address sender;              // smart account address
    uint256 nonce;               // managed by EntryPoint
    bytes initCode;              // 최초 배포 시 factory + calldata
    bytes callData;              // 실제 실행 함수 호출
    uint256 callGasLimit;        // callData 실행 가스 한도
    uint256 verificationGasLimit; // validateUserOp 가스 한도
    uint256 preVerificationGas;  // calldata zero/non-zero 비용
    uint256 maxFeePerGas;        // EIP-1559 max fee
    uint256 maxPriorityFeePerGas; // EIP-1559 priority
    bytes paymasterAndData;      // gas 대납자 + 데이터
    bytes signature;             // custom (Dilithium for PQ)
}

// UserOp hash 계산 (signature 대상)
userOpHash = keccak256(
    abi.encode(
        sender, nonce, keccak256(initCode), keccak256(callData),
        callGasLimit, verificationGasLimit, preVerificationGas,
        maxFeePerGas, maxPriorityFeePerGas, keccak256(paymasterAndData)
    )
)
// 최종 signable hash
hash = keccak256(abi.encode(userOpHash, entrypoint, chainId))

// Signature 검증 흐름
// 1) Bundler가 UserOp 수집
// 2) EntryPoint.handleOps() 호출
// 3) EntryPoint → account.validateUserOp(userOp, hash)
// 4) account: verify(signature, hash, publicKey)
// 5) 통과 시 callData 실행`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Calldata Gas Cost</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Calldata gas cost (EVM)
// zero byte: 4 gas
// non-zero byte: 16 gas (EIP-2028)

// UserOp with ECDSA
// Signature: 65 bytes ~= ~1,000 gas

// UserOp with Dilithium
// Signature: 2,420 bytes ~= ~35,000 gas
// 약 34x 증가

// 완화 방법
// 1) EIP-4844 blobs
//    - blob 데이터: much cheaper (~1 gas/byte)
//    - L2 rollup 사용 시 혜택
// 2) L2 execution
//    - L1 blob posting이 주요 비용
//    - L2 execution은 거의 무료
// 3) Signature aggregation
//    - 여러 user op signature를 합침
//    - BLS 같은 aggregable scheme

// L1 native cost breakdown
// ECDSA UserOp (~500B): ~8K calldata + 3K ecrecover = ~11K gas
// Dilithium UserOp (~2.9KB): ~45K calldata + 2.5M verify = ~2.55M gas
// 232x more expensive total!

// L2 (Optimism/Base)
// L1 data: EIP-4844 blobs
// L2 execution: constant
// Dilithium 비용: ~80K gas (vs 30K for ECDSA) = 2.7x`}</pre>

      </div>
    </section>
  );
}
