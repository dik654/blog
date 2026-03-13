import { CitationBlock } from '../../../../components/ui/citation';

export default function StatelessClient() {
  return (
    <section id="stateless-client" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Stateless Client와 Witness</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">현재: Full Node의 상태 저장 부담</h3>
        <p>
          현재 이더리움 풀 노드는 전체 상태 데이터베이스를 로컬에 저장해야 합니다.
          계정 잔액, 컨트랙트 코드, 스토리지 슬롯 등을 포함하는 이 상태 DB는
          <strong> 수백 GB</strong>에 달하며, 지속적으로 증가하고 있습니다.
          이는 노드 운영의 <strong>진입 장벽</strong>을 높이고 탈중앙화를 저해하는 요인입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`현재 Full Node 요구사항 (2026 기준):
──────────────────────────────────
  상태 DB (MPT):     ~300+ GB
  체인 히스토리:      ~1.2 TB
  디스크 총합:        ~2 TB SSD
  메모리:            16+ GB RAM
  동기화 시간:        수 시간~수 일
──────────────────────────────────

문제: 블록 검증을 위해 전체 상태를 유지해야 함
  tx가 account A의 balance를 읽으면
  → 로컬 DB에서 A의 현재 balance를 조회
  → 없으면 검증 불가`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">목표: Witness 기반 블록 검증</h3>
        <p>
          Stateless client의 핵심 아이디어는 단순합니다.
          블록 실행에 필요한 모든 상태 데이터를 블록 자체에 <strong>witness</strong>로 첨부하면,
          검증 노드는 상태 DB 없이도 블록을 검증할 수 있습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Stateless Client 블록 검증 흐름:

Block Producer (Full Node):
  1. 블록 실행 중 접근한 모든 키-값 쌍 기록
  2. 해당 키-값에 대한 Verkle 증명 생성
  3. Block + Witness를 네트워크에 전파

  Block = {
    header,
    transactions,
    execution_witness: {
      state_diff: [              // 접근된 키-값 쌍
        { key: 0x..., value: 0x..., ... },
        ...
      ],
      verkle_proof: {            // IPA 기반 증명
        commitments: [...],
        proof: bytes,
      }
    }
  }

Stateless Client:
  1. Block 수신
  2. execution_witness의 verkle_proof 검증
     → state_diff의 키-값이 올바른지 확인
  3. 검증된 키-값으로 트랜잭션 재실행
  4. 결과 state_root가 헤더와 일치하는지 확인
  → 상태 DB 불필요!`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">증명 크기: MPT vs Verkle</h3>
        <p>
          Stateless client가 MPT에서는 비현실적이고 Verkle Tree에서는 가능한 이유는
          <strong> 증명 크기</strong>의 극적인 차이입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`증명 크기 비교:
──────────────────────────────────────────
                  MPT              Verkle
──────────────────────────────────────────
접근 당 증명      ~4 KB            ~150 bytes
  → 분기 16,      → IPA 증명은
    각 sibling     분기 계수에
    해시 포함       독립적

일반적 블록 (1000 접근):
  MPT witness:   ~4 MB            불가능
  Verkle witness: -               ~150 KB

블록 크기 영향:
  현재 블록:     ~100 KB
  + MPT witness: ~4 MB  → 40배 증가 (비현실적)
  + VKT witness: ~150 KB → 2.5배 증가 (수용 가능)
──────────────────────────────────────────`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">IPA (Inner Product Argument) 벡터 커밋먼트</h3>
        <p>
          Verkle Tree의 핵심 암호학적 구성요소는 <strong>IPA 기반 벡터 커밋먼트</strong>입니다.
          IPA는 여러 값에 대한 커밋먼트를 하나의 타원곡선 점으로 표현하며,
          개별 값의 존재를 로그 크기의 증명으로 입증할 수 있습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`IPA 벡터 커밋먼트:

  값 벡터: v = (v₀, v₁, ..., v₂₅₅)
  기저 점: G = (G₀, G₁, ..., G₂₅₅)  — 타원곡선 위의 점

  커밋먼트: C = v₀·G₀ + v₁·G₁ + ... + v₂₅₅·G₂₅₅
           = Σᵢ vᵢ·Gᵢ  (단일 타원곡선 점)

  증명: "C에 커밋된 벡터의 i번째 값이 vᵢ이다"
    → IPA proof ≈ log₂(256) = 8 라운드
    → 증명 크기 ≈ 8 × 2 × 32B = ~512 bytes (단일 노드)
    → 경로 전체: ~150 bytes (증명 집계 후)

Merkle 해시 방식과의 차이:
  Merkle: sibling 해시를 모두 포함 → O(branching_factor)
  IPA:    증명 크기가 branching_factor에 독립 → O(log)`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Bandersnatch 곡선</h3>
        <p>
          IPA의 기반 곡선으로 <strong>Bandersnatch</strong>가 사용됩니다.
          이는 BLS12-381 곡선의 <strong>endomorphism</strong>(자기준동형)을 활용하는
          twisted Edwards 곡선으로, BLS12-381의 스칼라 필드 위에 정의됩니다.
          기존 BLS 인프라(Beacon Chain 서명)와의 호환성을 유지하면서도
          IPA에 최적화된 연산 효율을 제공합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Bandersnatch 곡선:
  타입: Twisted Edwards curve
  기반: BLS12-381의 스칼라 필드 Fr
  차수: ~2²⁵³ (충분한 보안 수준)

  장점:
  - BLS12-381과 동일 필드 → snark-friendly
  - GLV endomorphism → 스칼라 곱 2배 속도
  - 고정 기저 멀티스칼라 곱 최적화 가능

  go-verkle 구현:
    github.com/ethereum/go-verkle
    → geth에 통합, Kaustinen 테스트넷에서 실행 중`}</code>
        </pre>

        <CitationBlock source="Vitalik Buterin — 'Verkle trees' blog post" citeKey={1} type="paper" href="https://vitalik.eth.limo/general/2021/06/18/verkle.html">
          <p className="italic text-foreground/80">"Verkle trees are a powerful upgrade to Merkle proofs that allow for much smaller proof sizes. Instead of needing to provide all 'sister nodes' at each level, the prover need only provide a single proof that covers all parent-child links between a commitment and all its children."</p>
          <p className="mt-2 text-xs">Verkle tree는 머클 증명의 강력한 업그레이드로, 훨씬 작은 증명 크기를 가능하게 합니다. 각 레벨에서 모든 형제 노드를 제공하는 대신, 커밋먼트와 모든 자식 간의 부모-자식 링크를 커버하는 단일 증명만 제공하면 됩니다.</p>
        </CitationBlock>

        <CitationBlock source="go-verkle GitHub repository" citeKey={2} type="code" href="https://github.com/ethereum/go-verkle">
          <p className="italic text-foreground/80">"A Go implementation of Verkle Trees, as specified for Ethereum. This library implements the Verkle tree data structure used in the Ethereum Verkle transition."</p>
          <p className="mt-2 text-xs">이더리움 사양에 따른 Verkle Tree의 Go 구현체입니다. 이더리움 Verkle 전환에 사용되는 Verkle 트리 데이터 구조를 구현하며 geth에 통합됩니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
