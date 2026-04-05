import MerkleDamgardViz from './viz/MerkleDamgardViz';
import CompressionFnViz from './viz/CompressionFnViz';
import SpongeViz from './viz/SpongeViz';
import AbsorbViz from './viz/AbsorbViz';
import PermutationViz from './viz/PermutationViz';
import SqueezeViz from './viz/SqueezeViz';

export default function Constructions() {
  return (
    <section id="constructions" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle-Damgard & Sponge</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          내부 압축 함수를 반복 적용하여 임의 길이 &rarr; 고정 길이.
          반복 방식이 두 갈래.
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-3">Merkle-Damgard 구성</h3>
      <div className="not-prose mb-6"><MerkleDamgardViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">압축함수 f 내부</h4>
      <div className="not-prose mb-8"><CompressionFnViz /></div>

      <h3 className="text-xl font-semibold mb-3">Sponge 구성 (Keccak/SHA-3)</h3>
      <div className="not-prose mb-6"><SpongeViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">흡수 (Absorb)</h4>
      <div className="not-prose mb-8"><AbsorbViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">순열 (Keccak-f)</h4>
      <div className="not-prose mb-8"><PermutationViz /></div>
      <h4 className="text-lg font-semibold mt-6 mb-3">압출 (Squeeze)</h4>
      <div className="not-prose"><SqueezeViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle-Damgård 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Merkle-Damgård Construction (1989)
//
// 구조:
//   메시지 m → 블록 m_1, m_2, ..., m_k (패딩)
//
//   h_0 = IV (initialization vector)
//   h_i = f(h_{i-1}, m_i)  for i = 1..k
//   H(m) = h_k
//
// 압축 함수 f:
//   {0,1}^n × {0,1}^b → {0,1}^n
//   (이전 상태 + 블록 → 새 상태)
//
// 안전성 증명:
//   "만약 f가 충돌 저항 → H도 충돌 저항"
//   (Merkle, Damgård 정리)
//
// 길이 확장 공격 (Length Extension):
//   H(m)과 |m|만 알면
//   H(m || pad || m') 계산 가능
//
//   영향: SHA-1, SHA-256, SHA-512
//   방어: HMAC, SHA-3, BLAKE2

// 실제 압축 함수 내부:
//
// SHA-256 f:
//   - 64라운드
//   - 32-bit words
//   - ROTR, SHR, ADD, XOR, AND, OR
//   - 8개 상태 레지스터 (a-h)
//
// 라운드 연산:
//   t1 = h + Σ1(e) + Ch(e,f,g) + K_i + W_i
//   t2 = Σ0(a) + Maj(a,b,c)
//   h = g; g = f; f = e; e = d + t1
//   d = c; c = b; b = a; a = t1 + t2

// Davies-Meyer:
//   블록 암호 → 해시 압축 함수
//   f(h, m) = E_m(h) XOR h
//   (메시지를 키로 사용)

// 채택 현황:
//   SHA-1 (deprecated), SHA-256, SHA-512
//   BLAKE, BLAKE2 (Davies-Meyer 기반)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sponge Construction 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sponge Construction (Keccak/SHA-3, 2015)
//
// 구조:
//   State S: b = r + c bits
//     - r: rate (흡수/방출 부분)
//     - c: capacity (보안 마진)
//
//   3 phases:
//   1. Absorbing (흡수)
//      for block in message:
//          S_r ^= block
//          S = permutation(S)
//
//   2. Transitioning
//      (선택적)
//
//   3. Squeezing (방출)
//      output = ""
//      while len(output) < required:
//          output += S_r
//          S = permutation(S)

// Keccak-f[1600]:
//   - State: 5 × 5 × 64 = 1600 bits
//   - 24 rounds
//   - 5 steps per round: θ, ρ, π, χ, ι
//
// SHA-3 파라미터:
//   SHA3-224: r=1152, c=448
//   SHA3-256: r=1088, c=512
//   SHA3-384: r=832, c=768
//   SHA3-512: r=576, c=1024
//
// SHAKE (Extendable Output):
//   SHAKE128: r=1344, c=256
//   SHAKE256: r=1088, c=512
//   → 임의 길이 출력 가능

// Sponge 장점:
//   - Length extension 방어
//   - Flexible output length
//   - 간단한 구조
//   - 하드웨어 친화적
//   - Keyed hash (MAC), stream cipher 등 다용도

// Duplex 변형:
//   - Authenticated encryption
//   - Ascon (NIST lightweight 2023)

// 사용 예:
//   SHA-3: NIST 표준
//   Keccak-256: Ethereum
//   SHAKE: Post-quantum 후보들
//   BLAKE3: 빠른 해싱 (hybrid)`}
        </pre>
      </div>
    </section>
  );
}
