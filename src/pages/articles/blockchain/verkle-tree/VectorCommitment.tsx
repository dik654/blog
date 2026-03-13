import { CitationBlock } from '../../../../components/ui/citation';

export default function VectorCommitment() {
  return (
    <section id="vector-commitment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">벡터 커밋먼트와 IPA</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">벡터 커밋먼트 (Vector Commitment)</h3>
        <p>
          벡터 커밋먼트는 벡터(순서가 있는 값들의 목록) 전체를 하나의 짧은 값으로 커밋하고,
          나중에 특정 위치의 값이 올바르다는 것을 증명할 수 있는 암호학적 도구입니다.
          Merkle 트리도 일종의 벡터 커밋먼트이지만, 증명 크기가 O(k * log_k(n))인 반면,
          전용 벡터 커밋먼트 스킴은 O(1) 크기의 opening proof를 제공합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`벡터 커밋먼트의 세 가지 연산:

1. Commit(v₁, v₂, ..., vₖ) → C
   - 벡터 전체를 하나의 커밋먼트 C로 압축
   - C의 크기는 벡터 길이와 무관 (상수)

2. Open(C, i, vᵢ) → π
   - 위치 i의 값이 vᵢ임을 증명하는 proof π 생성
   - π의 크기도 상수 (핵심 장점!)

3. Verify(C, i, vᵢ, π) → bool
   - 증명 π를 검증하여 C에서 위치 i의 값이 vᵢ인지 확인`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">IPA (Inner Product Argument)</h3>
        <p>
          IPA는 Pedersen 커밋먼트를 기반으로 한 벡터 커밋먼트 방식입니다.
          벡터의 각 원소를 타원곡선 위의 독립적인 생성자(generator)에 곱하여 합산합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Pedersen Vector Commitment:

  C = v₁·G₁ + v₂·G₂ + ... + vₖ·Gₖ

  여기서 G₁, G₂, ..., Gₖ는 독립적인 타원곡선 생성자
  (nothing-up-my-sleeve 방식으로 선택)

IPA Opening Proof:
  "위치 i의 값이 vᵢ이다"를 증명하려면...

  1. 커밋먼트를 반으로 접기 (folding)
     C' = C_left + r·C_right  (r은 Fiat-Shamir 챌린지)

  2. 재귀적으로 벡터 크기를 절반씩 줄임
     k → k/2 → k/4 → ... → 1

  3. 최종적으로 하나의 스칼라 값으로 검증

  증명 크기: O(log k) 그룹 원소
  검증 시간: O(k) (생성자 다시 계산 필요)

장점: trusted setup 불필요
단점: 검증 시간이 O(k)로 KZG보다 느림`}</code></pre>

        <CitationBlock source="Pedersen Commitment & Inner Product Argument" citeKey={1} type="paper"
          href="https://eprint.iacr.org/2017/1066.pdf">
          <p className="italic text-foreground/80">
            "The inner product argument allows a prover to convince a verifier that the inner product
            of two committed vectors equals a claimed value, with logarithmic communication."
          </p>
          <p className="mt-2 text-xs">
            Bulletproofs 논문 (Bunz et al., 2018)에서 체계적으로 정리된 IPA는
            Pedersen 커밋먼트의 동형성(homomorphic property)을 활용하여
            로그 크기의 증명을 생성합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG Commitment</h3>
        <p>
          KZG(Kate-Zaverucha-Goldberg) 커밋먼트는 다항식 커밋먼트 스킴으로,
          벡터를 다항식으로 인코딩한 후 타원곡선 페어링을 사용하여 검증합니다.
          IPA보다 짧은 증명(단일 그룹 원소)과 빠른 검증(O(1) 페어링)을 제공하지만,
          trusted setup이 필요합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`KZG Commitment:

Setup (trusted):
  τ를 비밀로 선택, [τ⁰]₁, [τ¹]₁, ..., [τᵈ]₁ 공개
  (Powers of Tau ceremony)

Commit:
  벡터 (v₁, ..., vₖ) → 다항식 p(X) (라그랑주 보간)
  C = [p(τ)]₁ = Σ pᵢ · [τⁱ]₁

Open (위치 i에서 값 vᵢ 증명):
  q(X) = (p(X) - vᵢ) / (X - ωⁱ)
  π = [q(τ)]₁

Verify:
  e(C - [vᵢ]₁, [1]₂) = e(π, [τ - ωⁱ]₂)
  → 단일 페어링 검증!

증명 크기: 48 bytes (BLS12-381 기준, 단일 G₁ 원소)
검증 시간: O(1) — 2개의 페어링
단점: trusted setup 필요`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Verkle Tree에서의 적용</h3>
        <p>
          Verkle 트리는 k-ary 트리 구조에서 각 내부 노드가 자식들의 벡터 커밋먼트를 저장합니다.
          Merkle 트리와의 핵심 차이는 증명에 형제 노드의 해시가 필요 없다는 점입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Verkle Tree 증명 구조 (k-ary, depth d):

Merkle Tree 증명:
  각 레벨에서 (k-1)개의 형제 해시 필요
  총 증명 크기 = d × (k-1) × 32 bytes
  = O(k · log_k(n)) · 32B

  예: k=256, n=256² → d=2
  증명 = 2 × 255 × 32B = 16,320 bytes

Verkle Tree 증명:
  각 레벨에서 1개의 opening proof만 필요
  총 증명 크기 = d × (proof 크기)
  = O(log_k(n)) × const

  IPA 사용 시: d × O(log k) group elements
  예: k=256, n=256² → d=2
  증명 ≈ 2 × (8 × 32B) ≈ 512 bytes

  KZG 사용 시: d × 48 bytes
  예: k=256, n=256² → d=2
  증명 = 2 × 48B = 96 bytes`}</code></pre>

        <CitationBlock source="Kuszmaul, J. — Verkle Trees (2018)" citeKey={2} type="paper"
          href="https://math.mit.edu/research/highschool/primes/materials/2018/Kuszmaul.pdf">
          <p className="italic text-foreground/80">
            "We propose a new data structure called a Verkle tree, which is like a Merkle tree
            but uses vector commitments in place of hash functions at each node. This
            results in much smaller proofs."
          </p>
          <p className="mt-2 text-xs">
            John Kuszmaul의 2018년 논문으로, Verkle Tree의 원래 제안입니다.
            "Vector commitment + Merkle tree"의 합성어로, 증명 크기를 획기적으로 줄이는
            새로운 인증 자료구조를 소개합니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
