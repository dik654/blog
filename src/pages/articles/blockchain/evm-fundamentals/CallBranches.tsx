import CallBranchesViz from './viz/CallBranchesViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function CallBranches({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="call-branches" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Call() 내부 분기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Call()은 단순한 함수 호출이 아님 — 스냅샷, 전송, 프리컴파일 분기, 컨트랙트 생성을 모두 처리
          <br />
          각 단계에서 실패하면 즉시 롤백 — 이전 상태로 되돌리고 에러 반환
        </p>
      </div>
      <div className="not-prose">
        <CallBranchesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Precompiled Contracts</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Precompile = EVM이 네이티브 코드로 제공하는 특별 주소
// bytecode 없이 C++/Rust에서 직접 실행 (훨씬 빠름)

// 0x01: ecrecover(hash, v, r, s) → signer address
//       - secp256k1 signature recovery
//       - Gas: 3000

// 0x02: sha256(data) → 32-byte hash
//       - SHA-256 (not Keccak!)
//       - Gas: 60 + 12 per word

// 0x03: ripemd160(data) → 20-byte hash
//       - RIPEMD-160 (Bitcoin compatibility)
//       - Gas: 600 + 120 per word

// 0x04: identity(data) → data
//       - Datacopy (useful for memory ops)
//       - Gas: 15 + 3 per word

// 0x05: modexp(base, exp, mod) → result
//       - Large number modular exponentiation
//       - EIP-198 (Byzantium)
//       - Variable gas based on inputs

// 0x06: bn256Add(x1, y1, x2, y2) → x3, y3
// 0x07: bn256ScalarMul(x1, y1, scalar) → x3, y3
// 0x08: bn256Pairing(...) → bool
//       - BN254 curve operations (SNARKs)
//       - ZK-rollups 사용

// 0x09: blake2f(rounds, h, m, t, f) → h
//       - BLAKE2b compression
//       - EIP-152

// 0x0A: pointEvaluation (EIP-4844)
//       - KZG commitment verification
//       - Blob transactions

// 사용 예
// ecrecover로 signature 검증
function verify(bytes32 hash, uint8 v, bytes32 r, bytes32 s)
    external pure returns (address)
{
    return ecrecover(hash, v, r, s);
}
// 내부적으로 0x01 주소 호출됨`}</pre>

      </div>
    </section>
  );
}
