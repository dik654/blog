import HashSecurityViz from './viz/HashSecurityViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">해시 안전성 정의</h2>
      <div className="not-prose mb-8"><HashSecurityViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">암호학적 해시 함수의 3대 속성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Cryptographic Hash Function Properties
//
// 정의: H: {0,1}* → {0,1}^n
//   임의 길이 입력 → 고정 길이 출력
//
// 3대 필수 속성:
//
// 1. Preimage Resistance (일방향성)
//    주어진 h에 대해 H(x) = h인 x 찾기 어려움
//    - 복잡도: 2^n (brute force)
//    - SHA-256: 2^256 시도 필요
//
// 2. Second Preimage Resistance (2차 원상)
//    주어진 x1에 대해 H(x1) = H(x2)인 x2≠x1 찾기 어려움
//    - 복잡도: 2^n
//    - x1이 주어진 상태에서 충돌 찾기
//
// 3. Collision Resistance (충돌 저항)
//    H(x1) = H(x2)인 x1 ≠ x2 쌍 찾기 어려움
//    - 복잡도: 2^(n/2) (생일 공격)
//    - 가장 강한 속성
//    - SHA-256: 2^128 시도 필요

// 생일 공격 (Birthday Attack):
//   n명 중 생일이 겹치는 사람이 있을 확률
//   23명이면 50% (일반 직관: 183명)
//
//   해시 충돌:
//   2^(n/2) 샘플에서 50% 확률로 충돌
//   SHA-256 (n=256): 2^128 samples
//   MD5 (n=128): 2^64 samples (이미 깨짐)

// 해시 함수 역사:
//   MD5 (1991):      128-bit, 깨짐 (2004)
//   SHA-1 (1995):    160-bit, 깨짐 (2017)
//   SHA-2 (2001):    224/256/384/512-bit, 안전
//   SHA-3 (2015):    Keccak 기반, 안전
//   BLAKE2/3 (2012): SHA-2보다 빠름
//
// 공격 방법:
//   - Length extension (SHA-2 취약)
//   - Chosen-prefix collision (MD5, SHA-1)
//   - Rainbow tables
//   - Quantum (Grover): 2^(n/2) → 근본 변화 없음`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">블록체인의 해시 사용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Blockchain Hash Applications
//
// 1. Block Identity
//    - 블록 해시 = 블록 식별자
//    - 이전 블록 해시 포함 → 체인 구조
//    - 변조 즉시 탐지
//
// 2. Proof of Work (Bitcoin)
//    nonce를 찾아 H(block) < target
//    - 일방향성 활용
//    - 계산 비용 = 채굴 난이도
//
// 3. Merkle Root
//    거래들의 해시 트리 루트
//    - 블록에 포함
//    - SPV (Simple Payment Verification)
//    - O(log n) 증명
//
// 4. Address Derivation
//    Bitcoin: RIPEMD-160(SHA-256(pubkey))
//    Ethereum: keccak256(pubkey)[12:]
//    - 주소 = pubkey 해시
//    - 충돌 저항이 보안 기반
//
// 5. Digital Signatures
//    sign(hash(message)), 전체 메시지 서명 X
//    - 효율성
//    - 결정성

// 주요 블록체인의 해시 선택:
//   Bitcoin: SHA-256 (double)
//   Ethereum: Keccak-256 (SHA-3 변형)
//   Zcash: BLAKE2b
//   Solana: SHA-256, Poseidon (ZK)
//   Filecoin: SHA-256, Poseidon, BLAKE2b
//   Ethereum 2.0: SHA-256

// ZK-friendly 해시 트렌드 (2020~):
//   - Poseidon
//   - Rescue
//   - MiMC
//   - Griffin
//   → R1CS constraint 최소화`}
        </pre>
      </div>
    </section>
  );
}
