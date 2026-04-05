import SchnorrViz from './viz/SchnorrViz';
import WhyParamsViz from './viz/WhyParamsViz';
import PohligHellmanViz from './viz/PohligHellmanViz';

export default function SchnorrProtocol() {
  return (
    <section id="schnorr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Schnorr 식별 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Sigma 프로토콜의 가장 단순한 구현 — 이산로그 문제(DLP) 기반.
          <br />
          Ed25519, Schnorr 서명의 이론적 기반.
        </p>
      </div>

      <h3 className="text-lg font-bold mb-4">왜 소수 p, 부분군 위수 q, 생성원 g?</h3>
      <div className="not-prose mb-8"><WhyParamsViz /></div>

      <h3 className="text-lg font-bold mb-4">Pohlig-Hellman 공격</h3>
      <div className="not-prose mb-8"><PohligHellmanViz /></div>

      <h3 className="text-lg font-bold mb-4">수치 예시 (p=23, q=11, x=3)</h3>
      <div className="not-prose"><SchnorrViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Schnorr Identification Protocol</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Schnorr Identification Protocol (1989)
//
// Setup:
//   p: 큰 소수
//   q: p-1의 큰 소인수 (|q| = 256 bits)
//   g: order q의 generator
//
// Key generation:
//   x ← random in [1, q-1]  (private)
//   y = g^x mod p             (public)
//
// 증명: "나는 log_g(y) = x를 안다"
//
// 3-move protocol:
//
// Round 1 (Commitment):
//   Prover: k ← random in [1, q-1]
//   Prover: a = g^k mod p
//   Prover → Verifier: a
//
// Round 2 (Challenge):
//   Verifier: e ← random in [1, 2^t]  (t = 보안 파라미터)
//   Verifier → Prover: e
//
// Round 3 (Response):
//   Prover: z = k + e·x mod q
//   Prover → Verifier: z
//
// Verification:
//   Verifier: g^z ≡ a · y^e mod p ?
//
// 왜 동작하나?:
//   g^z = g^(k + e·x)
//       = g^k · g^(e·x)
//       = g^k · (g^x)^e
//       = a · y^e ✓

// 보안 분석:
//
// Completeness:
//   정직한 P: g^z = a · y^e 항상 성립 ✓
//
// Special Soundness:
//   같은 a에 대해 (e, z), (e', z') 알면:
//   g^z / g^z' = y^(e - e')
//   z - z' = x · (e - e') mod q
//   x = (z - z') / (e - e') mod q
//   → x 추출 가능!
//
// HVZK (Honest Verifier ZK):
//   Simulator:
//     1. z' ← random in [1, q-1]
//     2. e' ← random in [1, 2^t]
//     3. a' = g^z' · y^(-e') mod p
//     4. output (a', e', z')
//   → 실제 transcript와 동일 분포`}
        </pre>
      </div>
    </section>
  );
}
