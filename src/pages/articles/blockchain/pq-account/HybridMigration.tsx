import MigrationViz from './viz/MigrationViz';

export default function HybridMigration() {
  return (
    <section id="hybrid-migration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">하이브리드 전환: ECDSA → PQ</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          양자 위협은 아직 현실화되지 않았지만, 준비는 지금 시작해야 합니다.
          ERC-4337 스마트 계정은 서명 검증 로직을 업그레이드할 수 있으므로,
          <strong>점진적 전환</strong>이 가능합니다.
        </p>
        <h3>4단계 마이그레이션</h3>
        <ol>
          <li><strong>Phase 1</strong> — AA 스마트 계정 배포, 기존 ECDSA로 운영</li>
          <li><strong>Phase 2</strong> — Dilithium 공개키 추가 등록</li>
          <li><strong>Phase 3</strong> — 하이브리드 모드: ECDSA + Dilithium 동시 검증</li>
          <li><strong>Phase 4</strong> — ECDSA 제거, PQ 전용 운영</li>
        </ol>
        <p>
          Phase 3의 하이브리드 모드는 "두 서명 모두 유효해야 통과"입니다.
          Dilithium이 깨지면 ECDSA가, ECDSA가 깨지면 Dilithium이 보호합니다.
          양쪽 모두 동시에 깨지지 않는 한 안전합니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — EOA는 프로토콜 레벨 하드포크 없이는 서명 방식을 변경할 수 없습니다.
          AA 스마트 계정만이 사용자 수준에서 양자 내성으로 전환할 수 있는 유일한 경로입니다.
        </p>
      </div>
      <div className="mt-8"><MigrationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Phase별 구현 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Phase 1: ECDSA-only AA Account (baseline)
contract SmartAccountV1 {
    address public owner;  // ECDSA

    function validateUserOp(..., bytes signature) external {
        address recovered = ECDSA.recover(hash, signature);
        require(recovered == owner, "Invalid sig");
    }
}

// Phase 2: Add Dilithium key (storage only)
contract SmartAccountV2 {
    address public owner;             // ECDSA
    bytes32 public dilithiumPkHash;   // 추가
    bool public dilithiumEnabled = false;

    function registerDilithium(bytes calldata pk) external onlyOwner {
        dilithiumPkHash = keccak256(pk);
        // Store pk separately (too large for single slot)
    }
}

// Phase 3: Hybrid (ECDSA AND Dilithium)
contract SmartAccountV3 {
    function validateUserOp(..., bytes signature) external {
        (bytes memory ecdsaSig, bytes memory dilithiumSig) =
            abi.decode(signature, (bytes, bytes));

        // Both must pass
        require(ECDSA.recover(hash, ecdsaSig) == owner);
        require(DilithiumVerifier.verify(dilithiumPk, hash, dilithiumSig));
    }
}

// Phase 4: PQ-only (remove ECDSA)
contract SmartAccountV4 {
    function validateUserOp(..., bytes signature) external {
        require(DilithiumVerifier.verify(dilithiumPk, hash, signature));
    }
}

// Upgrade mechanism
// - Transparent/UUPS proxy 사용
// - Owner only upgradeability
// - Timelock for safety (예: 7일)
// - Social recovery 선택사항`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Migration 실전 고려사항</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// When to migrate?

// Trigger events
// 1) NIST PQC 표준 완전 채택 (2024~)
// 2) 실용적 quantum computer 등장 signal
// 3) Harvest-now-decrypt-later 공격 뉴스
// 4) 대형 금융기관 PQ 전환 발표

// Checklist (per account)
// ☐ AA smart account 사용 중인가?
// ☐ Upgrade mechanism 존재?
// ☐ Dilithium signer 지갑 준비?
// ☐ Recovery 계획 설정?

// Wallet support (2024 현재)
// - Argent: AA 기반, PQ 연구 중
// - Safe (Gnosis): 멀티시그, PQ module 가능
// - ZeroDev: AA SDK, PQ 통합 쉬움
// - Biconomy, Pimlico: PQ paymasters 계획

// 일반 EOA 사용자
// → AA account로 먼저 migrate
// → 그 후 PQ 전환
// → 대부분 사용자는 2단계 필요

// Governance token holders
// → Voting 시 PQ signature 지원 필요
// → DAO tooling 업데이트 필수
// → Snapshot signature schemes 확장`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: EOA의 근본 취약점</p>
          <p>
            <strong>문제</strong>: EOA는 프로토콜 레벨에서 ECDSA 고정<br />
            <strong>양자 이후</strong>: secp256k1 서명 scheme 영구 취약<br />
            <strong>해결 불가능</strong>: 하드포크 없이는 EOA 전환 불가
          </p>
          <p className="mt-2">
            <strong>AA의 유일성</strong>:<br />
            - 사용자가 서명 로직 선택 가능<br />
            - Upgrade 가능<br />
            - Quantum-ready<br />
            - <strong>Account Abstraction = quantum migration의 유일 경로</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
