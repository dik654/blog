import UseCaseViz from './viz/UseCaseViz';

export default function UseCases() {
  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AA 활용: 소셜 로그인, 세션 키, 배치</h2>
      <div className="not-prose mb-8"><UseCaseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>소셜 로그인 (Passkey / WebAuthn)</h3>
        <p className="leading-7">
          사용자가 생체 인증(Face ID, 지문)으로 트랜잭션에 서명합니다.<br />
          P-256(secp256r1) 서명을 validateUserOp()에서 검증합니다.<br />
          시드 구문 없이 지갑을 생성하고 사용할 수 있습니다.
        </p>

        <h3>세션 키 (Session Key)</h3>
        <p className="leading-7">
          제한된 권한의 임시 키를 발급합니다.<br />
          유효 기간, 호출 가능 함수, 지출 한도를 온체인에서 강제합니다.<br />
          게임, DeFi 자동화 등 빈번한 트랜잭션에 적합합니다.
        </p>

        <h3>배치 트랜잭션 (Batch Transaction)</h3>
        <p className="leading-7">
          approve + swap을 하나의 UserOp로 묶어 실행합니다.<br />
          사용자 경험이 향상되고 가스도 절약됩니다.<br />
          executeBatch()로 여러 콜데이터를 순차 실행합니다.
        </p>

        <h3>가스 대납 (Paymaster)</h3>
        <p className="leading-7">
          프로젝트가 사용자의 가스비를 대신 지불합니다.<br />
          ERC-20 토큰으로 가스 결제, 무료 체험, 구독 모델 등이 가능합니다.<br />
          Web2 수준의 온보딩 경험을 제공합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">AA 활용 패턴 구현 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Real-world AA Patterns
//
// 1) Passkey / WebAuthn Authentication
//
//    Secure Enclave generates P-256 keypair
//    Private key NEVER leaves device
//    User signs with Face ID / Touch ID / Windows Hello
//
//    validateUserOp():
//      bytes32 hash = sha256(authenticatorData || sha256(clientData))
//      (r, s) = decode(signature)
//      return ecRecover_P256(hash, r, s) == expectedPubKey
//
//    Gas cost: ~200K (P-256 precompile RIP-7212 reduces to 20K)
//
//    Live: Coinbase Smart Wallet, Safe{Wallet}, OKX

// 2) Session Keys
//
//    Problem: DeFi automation requires many signatures
//    Solution: delegate limited key
//
//    struct SessionKey {
//        address signer;        // temp key
//        uint48 validAfter;     // start time
//        uint48 validUntil;     // expiry
//        address[] targets;     // allowed contracts
//        bytes4[] selectors;    // allowed functions
//        uint256 spendLimit;    // max ETH per window
//    }
//
//    validateUserOp():
//      if (session not expired && target whitelisted):
//        return ecRecover(hash, sig) == session.signer
//
//    Used: Argent X, Zerion, games (e.g., Sequence)

// 3) Batch Operations
//
//    function executeBatch(
//        address[] targets,
//        uint256[] values,
//        bytes[] datas
//    ) external onlyEntryPoint {
//        for (uint i = 0; i < targets.length; i++) {
//            (bool ok,) = targets[i].call{value: values[i]}(datas[i]);
//            require(ok, "batch failed");
//        }
//    }
//
//    DEX swap example:
//      1. approve(USDC, router, amount)
//      2. router.swap(USDC, WETH, amount)
//    → 1 UserOp, atomic, cheaper gas

// 4) Multi-signature Threshold
//
//    struct MultiSig {
//        address[] owners;
//        uint256 threshold;  // e.g., 2 of 3
//    }
//
//    validateUserOp():
//      bytes[] memory sigs = decode(userOp.signature)
//      uint256 valid = 0
//      for (sig in sigs):
//        signer = ecRecover(hash, sig)
//        if (isOwner[signer]): valid++
//      return valid >= threshold ? 0 : SIG_VALIDATION_FAILED

// 5) Social Recovery
//
//    Guardian system (Argent-style):
//      struct Wallet {
//          address owner;
//          address[] guardians;
//          uint256 recoveryThreshold;
//      }
//
//      Recovery flow:
//        1. N guardians sign new_owner message
//        2. Wait recovery period (e.g., 48h)
//        3. Owner can veto during waiting period
//        4. After period: new_owner takes control
//
//    Variants:
//      - Email OTP guardian
//      - Hardware key guardian
//      - Recovery by friend (contract)
//      - zk-guardian (proves knowledge of secret)

// 6) Paymaster Sponsorship
//
//    VerifyingPaymaster flow:
//      1. Frontend sends UserOp to paymaster API
//      2. Paymaster service signs (op, validUntil, validAfter)
//      3. Signature added to paymasterAndData
//      4. On-chain: paymaster verifies signature
//      5. Paymaster pays gas to EntryPoint
//
//    Token Paymaster flow:
//      1. User pays in USDC (not ETH)
//      2. Paymaster takes USDC.transferFrom
//      3. Paymaster pays ETH to EntryPoint
//      4. Oracle gives USDC/ETH rate
//
//    Sponsorship criteria examples:
//      - Whitelisted addresses (KYC'd users)
//      - Max N transactions per day
//      - Specific target contract only (dApp)
//      - NFT holder gets free tx

// 7) Gas Abstraction (ERC-20 gas)
//
//    User has USDC, no ETH:
//      UserOp.paymasterAndData = TokenPaymaster
//
//    Steps:
//      1. Paymaster locks USDC via transferFrom
//      2. Paymaster calls EntryPoint with prefund
//      3. Gas refunded in USDC via postOp

// 8) Programmable Permissions (ERC-7579 modules)
//
//    Modular Smart Account standard:
//      - Validators (signature logic)
//      - Executors (custom execution)
//      - Fallback handlers
//      - Hooks (pre/post execution)
//
//    Plug-and-play modules:
//      Install SocialRecoveryValidator
//      Install TwoFactorValidator
//      Install GaslessSessionKeyModule
//      Install IntentHandler

// Production examples:
//   - Rhinestone: AA security modules
//   - Pimlico: bundler + paymaster infra
//   - Stackup: infra + SDK
//   - ZeroDev: Kernel modular account
//   - Biconomy: paymaster platform
//   - Safe{Core}: enterprise AA`}
        </pre>
      </div>
    </section>
  );
}
