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
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">CL (Consensus Layer) — Beacon Chain</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>validator 관리 (활성화/슬래싱/출금)</li>
              <li>슬롯 & 에폭 타이밍 (12초 x 32 슬롯 = 6.4분)</li>
              <li>fork choice (LMD-GHOST + Casper FFG)</li>
              <li>attestation 수집 & 집계</li>
              <li>block proposal 순서 결정</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">EL (Execution Layer) — Reth/Geth</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>TX 실행, state root 계산</li>
              <li>EVM, txpool, devp2p</li>
              <li>CL의 <code>payload_attributes</code>에 따라 블록 빌드</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">CL &rarr; EL 통신: Engine API</p>
          </div>
        </div>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
          {[
            { name: 'Prysm', lang: 'Go', share: '~40%' },
            { name: 'Lighthouse', lang: 'Rust', share: '~35%' },
            { name: 'Teku', lang: 'Java', share: '~15%' },
            { name: 'Nimbus', lang: 'Nim', share: '~7%' },
            { name: 'Lodestar', lang: 'TypeScript', share: '~3%' },
          ].map(c => (
            <div key={c.name} className="rounded-lg border border-border/60 p-3 text-center">
              <p className="font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.lang} &middot; {c.share}</p>
            </div>
          ))}
        </div>
        <div className="not-prose rounded-lg border border-border/60 p-4 my-4">
          <p className="font-semibold text-sm text-amber-400 mb-2">Prysm 특징</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>Go 생태계 활용 (<code>libp2p</code>, <code>boltdb</code>, <code>grpc</code>)</li>
            <li>Prysmatic Labs 개발 &mdash; 가장 오래된 CL 구현체 중 하나 (2018년~)</li>
            <li>REST + gRPC 이중 API</li>
          </ul>
        </div>
        <p className="leading-7">
          CL과 EL의 <strong>분리 구조</strong>가 PoS 이더리움의 핵심.<br />
          CL이 합의/validator 관리, EL이 실행 → 각자 최적화 가능.<br />
          Engine API가 CL ↔ EL의 유일한 통신 경로.
        </p>

        {/* ── Prysm 모듈 맵 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Prysm 모듈 맵 — Go 패키지 구조</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">beacon-chain/ (비콘 체인 노드)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>blockchain/</code> — fork choice, block processing</li>
              <li><code>core/</code> — state transition (slot/block/epoch)</li>
              <li><code>db/</code> — BoltDB 래퍼</li>
              <li><code>p2p/</code> — libp2p integration</li>
              <li><code>sync/</code> — initial/regular sync</li>
              <li><code>rpc/</code> — gRPC server + REST gateway</li>
              <li><code>cache/</code> — state cache, epoch cache</li>
              <li><code>operations/</code> — attestation, slashing pools</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">validator/ (검증자 클라이언트, 별도 바이너리)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>client/</code> — duty assignment, block signing</li>
              <li><code>keymanager/</code> — wallet, remote signer</li>
              <li><code>slashing-protection/</code> — EIP-3076 slash 방지</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-border/40">
              <p className="font-semibold text-sm text-amber-400 mb-1">공통 패키지</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code>consensus-types/</code> — Block, State 등 공통 타입</li>
                <li><code>crypto/bls/</code> — BLS12-381 (BLST CGo 바인딩)</li>
                <li><code>crypto/hash/</code> — SHA-256, keccak</li>
                <li><code>encoding/ssz/</code> — SSZ 직렬화</li>
                <li><code>network/forks/</code> — 하드포크별 분기</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Prysm은 <strong>2개 별도 바이너리</strong> — beacon-chain(노드) + validator(키 관리).<br />
          분리로 보안 강화 — validator 서명 키는 beacon-chain과 별도 프로세스에서 보호.<br />
          slashing-protection으로 EIP-3076 기반 중복 서명 차단.
        </p>

        {/* ── 설계 판단 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 설계 판단 3가지</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">1. Go + libp2p</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Go: 동시성(goroutine), 빠른 빌드</li>
              <li>libp2p: 이더리움 채택 P2P 프레임워크</li>
              <li><code>libp2p-go</code> 공식 구현체 활용</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">2. gRPC + REST 이중 API</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>gRPC: 내부 통신 (validator &harr; beacon)</li>
              <li>REST: Beacon API 표준 (EIP-3075)</li>
              <li><code>grpc-gateway</code>로 동일 서비스 2개 프로토콜 노출</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">3. BLST CGo 바인딩</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>BLS 서명 검증 = CPU-intensive (pairing)</li>
              <li>BLST: C++ 최적화, 가장 빠름</li>
              <li>pure Go 대비 2~5배 빠름</li>
            </ul>
          </div>
        </div>
        <div className="not-prose rounded-lg border border-border/60 p-4 my-4">
          <p className="font-semibold text-sm mb-2">Prysm vs Lighthouse 성능 비교</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="text-center"><p className="text-muted-foreground">블록 처리</p><p className="font-mono">동등 ~50ms</p></div>
            <div className="text-center"><p className="text-muted-foreground">state 재구성</p><p className="font-mono text-red-400">Lighthouse 우세</p></div>
            <div className="text-center"><p className="text-muted-foreground">p2p throughput</p><p className="font-mono text-green-400">Prysm 우세</p></div>
            <div className="text-center"><p className="text-muted-foreground">메모리 사용</p><p className="font-mono text-red-400">Lighthouse 우세</p></div>
          </div>
        </div>
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
