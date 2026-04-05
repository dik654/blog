import CommitmentViz from './viz/CommitmentViz';

export default function CommitmentScheme() {
  return (
    <section id="commitment-scheme" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pedersen 커밋먼트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          값을 확정하되 공개하지 않는 &ldquo;봉인된 봉투&rdquo; &mdash; Bulletproofs, PLONK의 기반 빌딩 블록.
        </p>
      </div>
      <div className="not-prose"><CommitmentViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Commitment Scheme 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Commitment Scheme
//
// 비유: "봉인된 봉투"
//   - Commit: 값을 봉투에 넣어 봉인 (공개 불가)
//   - Open: 나중에 봉투를 열어 공개
//
// 2대 성질:
//
// 1. Hiding
//    커밋값 c로부터 v에 대한 정보 얻을 수 없음
//    - Perfect hiding: 완전한 무정보
//    - Computational hiding: 계산적으로 불가
//
// 2. Binding
//    같은 c로 두 다른 v를 open 불가
//    - Perfect binding
//    - Computational binding
//
// Hiding ↔ Binding 트레이드오프:
//   - 둘 다 perfect 불가
//   - 하나 perfect + 다른 하나 computational

// Pedersen Commitment:
//
// Setup:
//   g, h: 큰 그룹의 generators (관계 모름)
//
// Commit:
//   r ← random (blinding factor)
//   c = g^v · h^r  mod p
//
// Open:
//   공개: v, r
//   Verifier: c == g^v · h^r ?
//
// 성질:
//   - Perfect Hiding: r이 랜덤이면 c 분포 균일
//   - Computational Binding: DLP 어려움 가정

// 다른 Commitment Schemes:
//
// 1. Hash-based
//    c = H(v || r)
//    - Perfect binding (충돌 저항 → 고정)
//    - Computational hiding (random oracle)
//    - 가장 간단, 널리 사용
//
// 2. ElGamal Commitment
//    c = (g^r, g^v · h^r)
//    - Homomorphic
//    - Perfect binding
//
// 3. KZG (Kate) Commitment
//    다항식 커밋먼트
//    c = p(τ) · G  (trusted setup)
//    - Constant-size proof
//    - Batch opening
//    - Ethereum EIP-4844 (blobs)
//
// 4. Bulletproofs IPA
//    Inner-Product Argument
//    - No trusted setup
//    - Logarithmic proof size
//    - Bulletproofs 코어

// 사용 사례:
//   - Coin flipping
//   - Auction (sealed bids)
//   - Voting
//   - ZK proof 내부
//   - Range proofs
//   - Confidential transactions (Monero)`}
        </pre>
      </div>
    </section>
  );
}
