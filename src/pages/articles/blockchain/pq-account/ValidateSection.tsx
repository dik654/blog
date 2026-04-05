import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ValidateViz from './viz/ValidateViz';
import { codeRefs } from './codeRefs';

export default function ValidateSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="validate" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">validateUserOp() 검증 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>_validatePrepayment()</code>은 nonce 확인, 예치금 차감, 서명 검증을 순서대로 수행합니다.
          PQ 계정에서는 마지막 단계에서 ECDSA + Dilithium 하이브리드 서명을 검증합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('validate-prepayment', codeRefs['validate-prepayment'])} />
          <span className="text-[10px] text-muted-foreground self-center">_validatePrepayment() 내부</span>
        </div>
        <p>
          <code>validationData</code>의 반환값 규약: 0은 성공, 1은 서명 실패,
          나머지 비트에는 유효 기간(validAfter, validUntil)이 인코딩됩니다.
        </p>
        <p className="text-sm border-l-2 border-blue-400 pl-3 bg-blue-50/50 dark:bg-blue-950/20 py-2 rounded-r">
          <strong>Insight</strong> — nonce를 검증 전에 증가시키는 이유: 실패한 UserOp가 재전송되는 것을 방지합니다.
          검증 실패해도 nonce가 소비되어, 동일 UserOp를 다시 번들에 포함할 수 없습니다.
        </p>
      </div>
      <div className="mt-8"><ValidateViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">PQ Account validateUserOp 구현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// PQSmartAccount.validateUserOp

function validateUserOp(
    UserOperation calldata userOp,
    bytes32 userOpHash,
    uint256 missingFunds
) external returns (uint256 validationData) {
    // 1) Signature 분리 (hybrid: ECDSA 65B || Dilithium 2420B)
    bytes memory ecdsaSig = userOp.signature[0:65];
    bytes memory dilithiumSig = userOp.signature[65:];

    // 2) ECDSA 1차 검증 (bundler validation 단계에서 쉬운 필터)
    address recovered = ECDSA.recover(userOpHash, ecdsaSig);
    if (recovered != ecdsaOwner) {
        return SIG_VALIDATION_FAILED;  // 1
    }

    // 3) Dilithium 본 검증 (PQ 안전성)
    bool dilithiumValid = DilithiumVerifier.verify(
        dilithiumPublicKey,
        userOpHash,
        dilithiumSig
    );
    if (!dilithiumValid) {
        return SIG_VALIDATION_FAILED;
    }

    // 4) Prefund (gas 선지불)
    if (missingFunds > 0) {
        (bool success,) = payable(msg.sender).call{value: missingFunds}("");
        require(success, "Prefund failed");
    }

    // 5) 유효 기간 (optional)
    // validationData = _packValidationData(valid, validUntil, validAfter)

    return 0;  // success, no time limit
}

// Hybrid 이점
// - ECDSA는 빠른 prefilter (3k gas)
// - Dilithium은 진짜 보안 (2.5M gas)
// - 둘 다 유효해야 통과 → AND
// - Classical + Quantum 저항
// - Gradual migration 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">validationData 인코딩</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// validationData: 256-bit packed value
// [20B authorizer] [6B validUntil] [6B validAfter]

// authorizer:
//   0x00...00: success
//   0x00...01: signature failure
//   else: paymaster address (if applicable)

// validUntil (6 bytes):
//   0: no expiration
//   timestamp: 유효 마감 시간

// validAfter (6 bytes):
//   0: immediately valid
//   timestamp: 유효 시작 시간

// Helper function
function _packValidationData(
    bool valid,
    uint48 validUntil,
    uint48 validAfter
) internal pure returns (uint256) {
    return (valid ? 0 : 1) |
           (uint256(validUntil) << 160) |
           (uint256(validAfter) << 208);
}

// EntryPoint가 후속 처리
// - 현재 block timestamp 확인
// - timeRange 내인지 검증
// - 실패 시 revert

// Time-based access control 사용 사례
// - 예약 실행 (validAfter 설정)
// - 만료 시간 (validUntil 설정)
// - Session key (일정 기간만 유효)
// - Recovery delay (7일 후 활성화)`}</pre>

      </div>
    </section>
  );
}
