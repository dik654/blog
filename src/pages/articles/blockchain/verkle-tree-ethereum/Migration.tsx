import { CitationBlock } from '../../../../components/ui/citation';

export default function Migration() {
  return (
    <section id="migration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MPT에서 VKT로의 마이그레이션</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Overlay 방식의 점진적 전환</h3>
        <p>
          수억 개의 상태 항목을 한 번에 변환하는 것은 불가능합니다.
          따라서 이더리움은 <strong>Overlay 방식</strong>의 점진적 마이그레이션 전략을 채택합니다.
          전환 시점(fork) 이후 새로운 상태 변경은 Verkle Tree에 기록하고,
          기존 상태는 MPT에 그대로 유지합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Overlay 마이그레이션 구조:

전환 이전 (Pre-fork):
┌──────────────────────────────┐
│        MPT (모든 상태)        │
│  account A: balance=100      │
│  account B: storage[0]=0xff  │
│  ...수억 개 항목...            │
└──────────────────────────────┘

전환 이후 (Post-fork):
┌──────────────────────────────┐  ← 새로운 상태 기록
│        VKT (Verkle Tree)      │
│  account C: balance=50 (new)  │
│  account A: balance=90 (수정) │
└──────────────────────────────┘
               │
               │ 상태 조회 시: VKT 먼저 → 없으면 MPT
               ▼
┌──────────────────────────────┐  ← 기존 상태 유지
│        MPT (레거시 상태)       │
│  account B: storage[0]=0xff  │
│  ...아직 접근 안 된 항목...     │
└──────────────────────────────┘`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">점진적 마이그레이션: 접근 시 이동</h3>
        <p>
          기존 MPT의 상태는 <strong>접근될 때</strong> VKT로 이동합니다.
          트랜잭션이 특정 계정이나 스토리지 슬롯을 읽거나 쓸 때,
          해당 데이터가 MPT에만 존재하면 VKT로 복사합니다.
          시간이 지나면서 활발히 사용되는 상태가 자연스럽게 VKT로 이전됩니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`점진적 마이그레이션 흐름:

TX가 account X의 balance를 읽을 때:

1. VKT에서 X 조회
   → 존재하면: VKT 값 반환 (끝)
   → 없으면: 2단계로

2. MPT에서 X 조회
   → 존재하면: 값을 VKT에 복사 + 반환
   → 없으면: 계정 없음

코드:
  func getBalance(addr Address) uint256 {
      // 1. VKT 먼저
      if val, ok := verkleTree.Get(addr); ok {
          return val
      }
      // 2. MPT 폴백
      if val, ok := mpt.Get(addr); ok {
          verkleTree.Put(addr, val)  // VKT로 이동
          return val
      }
      return 0
  }

시간에 따른 마이그레이션:
  Fork 직후:    VKT 0%  / MPT 100%
  1개월 후:     VKT 30% / MPT 70%  (활성 계정 이동)
  6개월 후:     VKT 80% / MPT 20%  (대부분 이동)
  완전 전환:    VKT 100% / MPT 제거 가능`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">가스 비용 변경: EIP-4762</h3>
        <p>
          Verkle Tree 도입에 따라 상태 접근의 가스 비용 체계가 변경됩니다.
          <strong>EIP-4762 (Stateless Gas Cost Changes)</strong>는 witness 크기에 비례하는
          새로운 가스 비용 모델을 정의합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`EIP-4762: Stateless Gas Cost Changes

핵심 변경사항:
──────────────────────────────────────────────
연산                현재 가스        EIP-4762
──────────────────────────────────────────────
SLOAD (warm)        100             200
SLOAD (cold)        2,100           2,100
SSTORE (warm)       100             200
SSTORE (cold)       22,100          변동 (witness 비용)
BALANCE (cold)      2,600           2,600
CODE (cold)         2,600           분할 과금
──────────────────────────────────────────────

새로운 개념: "witness chunk" 기반 과금
  - 코드가 31-byte 청크 단위로 접근됨
  - 코드 전체가 아닌 실행된 청크만 witness에 포함
  - 큰 컨트랙트도 실행 경로의 코드만 비용 발생

  예: 10KB 컨트랙트에서 200B만 실행
    현재: EXTCODESIZE + 전체 코드 로드 비용
    EIP-4762: 200B / 31B ≈ 7 청크만 과금`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">새로운 블록 헤더 필드</h3>
        <p>
          Verkle Tree 도입과 함께 블록 헤더에 새로운 필드가 추가됩니다.
          이 필드들은 stateless client가 블록을 검증하는 데 필요한 증명을 포함합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`새로운 블록 구조:

Block {
  header: {
    ...기존 필드...
    state_root:      Bytes32,    // VKT root (MPT root 대체)
  },
  body: {
    transactions:    [...],
    // 새로운 필드들:
    execution_witness: {
      state_diff: [              // 상태 변경 목록
        {
          stem:    Bytes31,      // Verkle 트리 경로
          suffix_diffs: [
            { suffix: uint8, current_value: bytes, new_value: bytes }
          ]
        },
        ...
      ],
      verkle_proof: {
        commitments_by_path: [...],   // 경로별 커밋먼트
        d:     Point,                 // IPA 증명 요소
        ipa_proof: {
          cl: [Point; 8],             // 왼쪽 커밋먼트
          cr: [Point; 8],             // 오른쪽 커밋먼트
          final_evaluation: Scalar,   // 최종 평가값
        }
      }
    }
  }
}`}</code>
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Kaustinen 테스트넷과 타임라인</h3>
        <p>
          <strong>Kaustinen</strong>은 Verkle Tree 전용 테스트넷으로,
          실제 Verkle 상태 전환을 테스트하기 위해 운영되고 있습니다.
          현재 여러 이터레이션을 거치며 EIP-4762, EIP-6800 등의 사양을 검증하고 있으며,
          <strong>Hegota 업그레이드(2026 H2)</strong>에서 메인넷 도입이 목표입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Verkle 도입 타임라인:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2023-2024:  Kaustinen testnet v1-v6
            → 기본 Verkle 전환 테스트
            → go-verkle 라이브러리 안정화

2025 Q1:    Pectra 업그레이드 (메인넷)
            → Verkle 미포함, EL/CL 개선

2025-2026:  Fusaka 업그레이드
            → PeerDAS, EOF 등
            → Verkle 최종 사양 확정

2026 H2:    Hegotá 업그레이드 (목표)
            → Verkle Tree 메인넷 활성화
            → MPT → VKT overlay 전환 시작
            → Stateless client 지원 시작

이후:        완전한 Stateless Ethereum
            → MPT 완전 제거
            → State expiry 도입 가능`}</code>
        </pre>

        <CitationBlock source="EIP-6800 — Ethereum state using a unified verkle tree" citeKey={3} type="paper" href="https://eips.ethereum.org/EIPS/eip-6800">
          <p className="italic text-foreground/80">"This EIP introduces a new Verkle state tree alongside the existing hexary Patricia tree. After the fork, the existing state is maintained in the legacy MPT, and new state changes are written to the Verkle tree."</p>
          <p className="mt-2 text-xs">이 EIP는 기존 헥사리 패트리시아 트리와 함께 새로운 Verkle 상태 트리를 도입합니다. 포크 이후 기존 상태는 레거시 MPT에 유지되고, 새로운 상태 변경은 Verkle 트리에 기록됩니다.</p>
        </CitationBlock>

        <CitationBlock source="ethereum/go-verkle codebase" citeKey={4} type="code" href="https://github.com/ethereum/go-verkle">
          <p className="italic text-foreground/80">"Package verkle implements a Verkle tree suitable for Ethereum's state model. It uses the Bandersnatch curve for polynomial commitments and IPA for proofs."</p>
          <p className="mt-2 text-xs">verkle 패키지는 이더리움의 상태 모델에 적합한 Verkle 트리를 구현합니다. 다항식 커밋먼트에 Bandersnatch 곡선을, 증명에 IPA를 사용합니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
