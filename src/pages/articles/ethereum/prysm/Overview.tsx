import PrysmArchViz from './viz/PrysmArchViz';

const ARTICLES = [
  /* 기초: 직렬화 & 암호 */
  { href: '/blockchain/prysm-ssz', title: 'SSZ 직렬화 & Merkleization', desc: '인코딩 · HashTreeRoot · Multiproof' },
  { href: '/blockchain/prysm-bls', title: 'BLS 서명 (BLST 바인딩)', desc: 'BLS12-381 · CGo 바인딩 · 배치 검증' },
  /* 상태 */
  { href: '/blockchain/prysm-beacon-state', title: 'BeaconState 구조', desc: 'Copy-on-Write · FieldTrie 해시 캐싱' },
  { href: '/blockchain/prysm-slot-processing', title: '슬롯 처리 & 상태 루트', desc: 'ProcessSlots 루프 · 에폭 경계 감지' },
  { href: '/blockchain/prysm-epoch-processing', title: '에폭 처리', desc: 'Justification · 보상/패널티 · 슬래싱' },
  /* 합의 */
  { href: '/blockchain/prysm-block-processing', title: '블록 처리 & 상태 전환', desc: 'RANDAO · operations · execution payload' },
  { href: '/blockchain/prysm-block-proposal', title: '블록 제안 & 조립', desc: 'ProposerIndex · attestation 수집 · BLS 서명' },
  { href: '/blockchain/prysm-forkchoice', title: 'Fork Choice (LMD-GHOST)', desc: 'doubly-linked-tree · GetHead' },
  { href: '/blockchain/prysm-finality', title: 'Casper FFG & Finality', desc: '체크포인트 · Finalization · Weak Subjectivity' },
  /* 검증자 */
  { href: '/blockchain/prysm-validator-client', title: '검증자 클라이언트', desc: '의무 할당 · Keymanager · 슬래싱 방지' },
  { href: '/blockchain/prysm-attestation', title: '어테스테이션', desc: '생성 · 집계 · 서브넷 · 블록 포함' },
  { href: '/blockchain/prysm-sync-committee', title: '싱크 위원회', desc: '위원회 참여 · 기여 집계' },
  /* 네트워크 */
  { href: '/blockchain/prysm-p2p-libp2p', title: 'libp2p 네트워킹', desc: 'Discv5 · 피어 스코어링 · 연결 게이팅' },
  { href: '/blockchain/prysm-gossipsub', title: 'Gossipsub', desc: '토픽 · 포크 다이제스트 · SSZ-Snappy' },
  { href: '/blockchain/prysm-sync', title: '동기화 전략', desc: 'Initial · Checkpoint · Regular Sync' },
  /* 저장 */
  { href: '/blockchain/prysm-beacon-db', title: 'BeaconDB', desc: 'BoltDB 버킷 · 블록/상태 CRUD · 프루닝' },
  { href: '/blockchain/prysm-state-cache', title: '상태 캐시', desc: 'Hot/Cold · State Summary · 재생' },
  /* API */
  { href: '/blockchain/prysm-beacon-api', title: 'Beacon API', desc: 'gRPC + REST Gateway · Validator API' },
  { href: '/blockchain/prysm-engine-api', title: 'Engine API (CL → EL)', desc: 'NewPayload · ForkchoiceUpdated · GetPayload' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prysm 내부 아키텍처 개요</h2>
      <div className="not-prose mb-8"><PrysmArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <strong>Prysm</strong> — Go로 구현된 이더리움 CL(합의 계층) 클라이언트<br />
          비콘 체인 상태 관리, 포크 선택, 검증자 의무 수행, P2P 네트워킹 담당<br />
          Engine API로 EL(Reth 등)에 실행 페이로드 검증을 위임
        </p>

        {/* ── CL의 역할 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CL(Consensus Layer)의 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PoS 전환(2022-09) 이후 이더리움 이중 구조:
//
// CL (Consensus Layer) — Beacon Chain
//   - validator 관리 (활성화/슬래싱/출금)
//   - 슬롯 & 에폭 타이밍 (12초 × 32 슬롯 = 6.4분)
//   - fork choice (LMD-GHOST + Casper FFG)
//   - attestation 수집 & 집계
//   - block proposal 순서 결정
//
//         ↓ Engine API
//
// EL (Execution Layer) — Reth/Geth/Nethermind
//   - TX 실행, state root 계산
//   - EVM, txpool, devp2p
//   - CL의 payload_attributes에 따라 블록 빌드

// CL 클라이언트 구현체:
// - Prysm (Go): ~40% 점유율
// - Lighthouse (Rust): ~35% 점유율
// - Teku (Java): ~15% 점유율
// - Nimbus (Nim): ~7% 점유율
// - Lodestar (TypeScript): ~3% 점유율

// Prysm만의 특징:
// - Go 생태계 활용 (libp2p, boltdb, grpc)
// - Prysmatic Labs 개발
// - 가장 오래된 CL 구현체 중 하나 (2018년부터)
// - REST + gRPC 이중 API`}
        </pre>
        <p className="leading-7">
          CL과 EL의 <strong>분리 구조</strong>가 PoS 이더리움의 핵심.<br />
          CL이 합의/validator 관리, EL이 실행 → 각자 최적화 가능.<br />
          Engine API가 CL ↔ EL의 유일한 통신 경로.
        </p>

        {/* ── Prysm 모듈 맵 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm 모듈 맵 — Go 패키지 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`prysm/
├── beacon-chain/          # 비콘 체인 노드 (main binary)
│   ├── blockchain/        #   fork choice, block processing
│   ├── core/              #   state transition (slot/block/epoch)
│   ├── db/                #   BoltDB 래퍼
│   ├── p2p/               #   libp2p integration
│   ├── sync/              #   initial/regular sync
│   ├── rpc/               #   gRPC server + REST gateway
│   ├── cache/             #   state cache, epoch cache
│   └── operations/        #   attestation, slashing pools
│
├── validator/             # 검증자 클라이언트 (별도 바이너리)
│   ├── client/            #   duty assignment, block signing
│   ├── keymanager/        #   wallet, remote signer
│   └── slashing-protection/ # EIP-3076 slash 방지
│
├── consensus-types/       # 공통 타입 (Block, State 등)
├── crypto/
│   ├── bls/               #   BLS12-381 (BLST CGo 바인딩)
│   └── hash/              #   SHA-256, keccak
├── encoding/
│   └── ssz/               #   SSZ 직렬화
├── network/forks/         # 하드포크별 분기
└── runtime/prereqs/       # 시스템 점검`}
        </pre>
        <p className="leading-7">
          Prysm은 <strong>2개 별도 바이너리</strong> — beacon-chain(노드) + validator(키 관리).<br />
          분리로 보안 강화 — validator 서명 키는 beacon-chain과 별도 프로세스에서 보호.<br />
          slashing-protection으로 EIP-3076 기반 중복 서명 차단.
        </p>

        {/* ── 설계 판단 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 설계 판단 3가지</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. Go + libp2p 조합
// - Go: 동시성(goroutine), 빠른 빌드, 성숙한 생태계
// - libp2p: 이더리움이 채택한 P2P 프레임워크 (Rust/JS/Go 구현)
// - libp2p-go 공식 구현체 활용

// 2. gRPC + REST 이중 API
// - gRPC: 내부 통신 (validator ↔ beacon-chain)
// - REST: Beacon API 표준 (EIP-3075) 준수
// - grpc-gateway로 동일 서비스를 2가지 프로토콜로 노출

// 3. BLST CGo 바인딩
// - BLS 서명 검증은 CPU-intensive (pairing 연산)
// - BLST (supranational): C++ 최적화 라이브러리, 가장 빠름
// - pure Go 구현(blst-go) 대비 2~5배 빠름
// - cgo overhead는 배치 검증으로 상쇄

// 성능 프로파일 (메인넷 vs Lighthouse):
// - 블록 처리: 동등 (~50ms)
// - state 재구성: Lighthouse가 빠름 (Rust 메모리 효율)
// - p2p throughput: Prysm 우세 (libp2p-go 성숙)
// - 메모리 사용: Lighthouse가 낮음 (Rust vs Go GC)`}
        </pre>
        <p className="leading-7">
          Prysm의 3가지 설계 선택 — <strong>Go, gRPC+REST, BLST</strong>.<br />
          Lighthouse(Rust) 대비 약간 높은 메모리 사용 + libp2p 생태계 활용.<br />
          validator 점유율 ~40%로 가장 많이 사용되는 CL 구현.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">심층 분석 아티클</h3>
        <p>기초(SSZ/BLS) → 상태 → 합의 → 검증자 → 네트워크 → 저장 → API 순서로 읽으면 이해가 쉬움</p>
      </div>
      <div className="not-prose grid gap-3 mt-4">
        {ARTICLES.map((a) => (
          <a key={a.href} href={a.href}
            className="block rounded-lg border border-border/60 p-4 hover:bg-accent transition-colors">
            <p className="font-semibold text-foreground">{a.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
