import ContextViz from './viz/ContextViz';
import CryptoModelViz from './viz/CryptoModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">대칭/비대칭 암호</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          블록체인의 신뢰 기반인 암호학의 핵심 개념과 응용.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><CryptoModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">대칭 vs 비대칭 암호 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 대칭 암호 (Symmetric Cryptography)
//
// 특성:
//   - 암호화/복호화에 같은 키 사용
//   - 속도: 빠름 (100MB/s~GB/s)
//   - 키 길이: 128~256 bits
//   - 보안 기반: 치환·순열의 혼합
//
// 주요 알고리즘:
//   AES (Advanced Encryption Standard)
//     - 2001년 Rijndael 선정
//     - 128/192/256 bit keys
//     - 블록 크기: 128 bits
//     - 모드: ECB, CBC, CTR, GCM, XTS
//
//   ChaCha20-Poly1305
//     - 스트림 암호 + 인증
//     - 소프트웨어 구현 빠름
//     - 모바일 친화적 (AES 하드웨어 없는 경우)
//
//   3DES (legacy, deprecated)
//
// 한계:
//   - 키 교환 문제 (어떻게 안전하게 전달?)
//   - n명이 통신하려면 n(n-1)/2 키 필요

// 비대칭 암호 (Asymmetric / Public Key)
//
// 특성:
//   - 공개키(encrypt) + 개인키(decrypt) 쌍
//   - 속도: 느림 (KB/s~MB/s)
//   - 키 길이: 256~4096 bits
//   - 보안 기반: 수학적 어려운 문제
//     - RSA: 큰 수 인수분해
//     - ECC: 타원곡선 이산로그
//     - Lattice: 격자 기반 문제
//
// 주요 알고리즘:
//   RSA (Rivest-Shamir-Adleman, 1977)
//     - n = p × q (큰 소수)
//     - 2048/3072/4096 bits
//
//   ECC (Elliptic Curve Cryptography)
//     - secp256k1 (Bitcoin/Ethereum)
//     - Curve25519 (Signal, TLS)
//     - P-256 (NIST)
//
//   Ed25519 / X25519 (Curve25519 기반)
//     - 빠름 + 안전
//     - 현대 표준
//
// 하이브리드 사용:
//   TLS: 비대칭으로 키 교환 → 대칭으로 데이터 암호화
//   → 양자의 장점 결합`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">암호학의 수학적 기반</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 암호학에서 사용되는 어려운 문제들
//
// 1. Integer Factorization
//    n = p × q에서 p, q 찾기
//    - RSA 기반
//    - 2048-bit: 고전 컴퓨터로 수천 년
//    - 양자 컴퓨터(Shor): 다항 시간
//
// 2. Discrete Logarithm (DLP)
//    g^x mod p = y에서 x 찾기
//    - DH, DSA 기반
//    - 고전: 어려움
//    - 양자: Shor로 해결
//
// 3. Elliptic Curve DLP (ECDLP)
//    P = x·G에서 x 찾기
//    - ECDSA, EdDSA 기반
//    - 256-bit가 RSA 3072-bit와 동등
//    - 양자: Shor 적용 가능
//
// 4. Lattice Problems
//    Shortest Vector Problem (SVP)
//    Learning With Errors (LWE)
//    - Post-quantum 후보
//    - Kyber, Dilithium (NIST 2022)

// 양자 후 암호 (Post-Quantum):
//   2022 NIST 표준:
//     - Kyber: KEM (Lattice)
//     - Dilithium: 서명 (Lattice)
//     - Falcon: 서명 (Lattice)
//     - SPHINCS+: 서명 (Hash-based)
//
//   전환 시기:
//     2024: 하이브리드 배포 시작
//     2030+: 양자 컴퓨터 위협 현실화
//     완전 전환 필수`}
        </pre>
      </div>
    </section>
  );
}
