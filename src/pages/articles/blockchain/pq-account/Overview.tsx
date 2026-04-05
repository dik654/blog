import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">양자 위협 &amp; AA 해결책</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Shor 알고리즘은 이산 로그 문제를 다항 시간에 해결합니다.
          이더리움의 ECDSA(secp256k1)는 이산 로그에 기반하므로,
          충분한 큐비트의 양자 컴퓨터가 등장하면 <strong>공개키에서 개인키를 복원</strong>할 수 있습니다.
        </p>
        <p>
          해결책: <strong>격자 기반 서명(CRYSTALS-Dilithium)</strong>을 Account Abstraction과 결합합니다.
          AA 스마트 계정은 서명 검증 로직을 코드로 교체할 수 있으므로,
          ECDSA 대신 양자 내성 서명을 사용할 수 있습니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('handle-ops', codeRefs['handle-ops'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleOps()</span>
          <CodeViewButton onClick={() => onCodeRef('dilithium-keygen', codeRefs['dilithium-keygen'])} />
          <span className="text-[10px] text-muted-foreground self-center">keygen()</span>
        </div>
      </div>
      <div className="mt-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">양자 위협 타임라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Shor's algorithm (1994)
// - 이산 로그 polynomial time 해결
// - 큰 정수 인수분해 polynomial time
// - RSA, ECDSA, DH 모두 취약

// 큐비트 요구량
// - RSA-2048: ~4000 logical qubits
// - ECDSA secp256k1: ~2500 logical qubits
// - 현재 최대: ~1000 physical qubits (noisy)
// - Fault-tolerant 1 logical = ~1000 physical
// - 필요한 physical qubits: ~2,500,000

// 현실적 타임라인
// - 2024: ~1000 noisy qubits
// - 2030: 100k logical qubits 가능?
// - 2040: cryptographically relevant QC?

// "Harvest now, decrypt later" 위협
// - 지금 데이터 수집 → 나중에 복호화
// - 블록체인은 public data → 특히 취약
// - 장기 보안 필요한 자산 위험

// NIST PQC 표준화 (2024)
// - ML-KEM (key encapsulation)
// - ML-DSA (digital signature = Dilithium)
// - SLH-DSA (stateless hash-based signature)
// - FN-DSA (fast lattice signature)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">ERC-4337 AA + PQC 조합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// ERC-4337 (Account Abstraction) 2023
// - Smart contract accounts 표준
// - Custom signature verification
// - EntryPoint가 user operations 처리

// 핵심: validateUserOp(userOp, signature)
// - 개발자가 직접 구현
// - ECDSA 대신 Dilithium 가능

// PQC Smart Account 구조
contract PQSmartAccount is IAccount {
    bytes32 public dilithiumPublicKey;

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external returns (uint256 validationData) {
        // Dilithium 서명 검증
        bool valid = verifyDilithium(
            dilithiumPublicKey,
            userOpHash,
            userOp.signature
        );

        if (!valid) return SIG_VALIDATION_FAILED;

        // Gas 지불
        if (missingAccountFunds > 0) {
            payable(msg.sender).transfer(missingAccountFunds);
        }

        return 0;
    }
}

// 장점
// ✓ 양자 안전 (post-quantum)
// ✓ ECDSA 기반 infrastructure와 호환
// ✓ Gradual migration 가능

// 단점
// ✗ Signature 크기 증가 (2.4KB vs 65B)
// ✗ Gas 비용 증가 (on-chain verify 비쌈)
// ✗ 아직 표준화 진행 중`}</pre>

      </div>
    </section>
  );
}
