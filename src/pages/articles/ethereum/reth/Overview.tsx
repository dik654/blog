const ARTICLES = [
  /* 기초 */
  { href: '/blockchain/reth-cli', title: 'CLI & 노드 빌더', desc: 'NodeBuilder 패턴 · NodeComponents trait · 시작 라이프사이클' },
  { href: '/blockchain/reth-chainspec', title: 'ChainSpec & 하드포크', desc: 'Hardfork enum · ForkCondition · Genesis 초기화' },
  { href: '/blockchain/reth-alloy-primitives', title: 'alloy 프리미티브 & RLP', desc: 'alloy-rlp derive 매크로 · Address · B256 · U256' },
  /* 저장 */
  { href: '/blockchain/reth-db', title: 'DB (MDBX & Tables)', desc: 'Tables 매크로 · Cursor · StaticFiles 고대 데이터' },
  { href: '/blockchain/reth-provider', title: 'State Provider', desc: 'StateProvider trait · BundleState · HistoricalStateProvider' },
  { href: '/blockchain/reth-trie', title: 'Trie & 상태 루트', desc: 'PrefixSet · StateRoot 계산 · Parallel Trie' },
  /* 실행 */
  { href: '/blockchain/reth-pipeline', title: 'Pipeline & Stages', desc: 'Stage trait · Headers→Bodies→Senders→Execution→Merkle' },
  { href: '/blockchain/reth-block-execution', title: '블록 실행 (revm)', desc: 'BlockExecutor · EvmConfig · BundleState 상태 변경' },
  { href: '/blockchain/reth-precompiles', title: '프리컴파일 (revm)', desc: 'ecRecover · bn128 · blake2f · KZG Point Eval' },
  /* TX & 가스 */
  { href: '/blockchain/reth-eip1559', title: 'EIP-1559 가스', desc: 'calc_next_block_base_fee · effective_tip_per_gas' },
  { href: '/blockchain/reth-txpool', title: '트랜잭션 풀', desc: 'TransactionValidator · Ordering · 3개 서브풀' },
  { href: '/blockchain/reth-eip4844', title: 'EIP-4844 Blob TX', desc: 'BlobPool · KZG Commitment · Blob Gas 모델' },
  { href: '/blockchain/reth-payload-builder', title: 'Payload Builder', desc: 'BuildJob → TX 선택 → Engine API 페이로드' },
  /* 네트워크 */
  { href: '/blockchain/reth-net', title: '네트워크 (devp2p)', desc: 'SessionManager · eth-wire · Discovery v4' },
  { href: '/blockchain/reth-sync', title: '동기화 전략', desc: 'Full Pipeline · Snap Sync · Live Sync (ExEx)' },
  { href: '/blockchain/reth-rpc', title: 'RPC & Engine API', desc: 'EthApi trait · Engine API · 미들웨어' },
  /* 확장 */
  { href: '/blockchain/reth-exex', title: 'ExEx (Execution Extensions)', desc: 'ExExNotification · 인덱서 · 브릿지 확장' },
  { href: '/blockchain/reth-mev', title: 'MEV & Builder 연동', desc: 'Builder API · Flashbots 호환' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reth 내부 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Reth</strong> — Paradigm이 개발한 Rust 이더리움 실행 클라이언트<br />
          모듈식 크레이트 구조, 타입 안전, Pipeline+Stages 패턴으로 설계<br />
          revm(EVM), MDBX(DB), alloy(프리미티브) 기반
        </p>

        {/* ── 프로젝트 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">프로젝트 배경 — 왜 또 다른 EL 클라이언트인가</h3>
        <p className="leading-7">
          이더리움 EL 클라이언트 생태계는 2015~2022년 사이 Geth(Go), Nethermind(C#), Besu(Java), Erigon(Go)으로 성숙.<br />
          2022년 Paradigm Research가 Reth 프로젝트를 시작한 동기:<br />
          1. <strong>Rust 생태계 활용</strong> — revm, alloy, reth-mdbx 등 고성능 라이브러리 재사용<br />
          2. <strong>Erigon 설계 계승</strong> — Staged Sync 패턴은 Erigon이 검증. Rust로 재구현하며 타입 안전성 추가<br />
          3. <strong>클라이언트 다양성</strong> — Geth 의존도 ~70%를 낮춰 네트워크 견고성 확보<br />
          4. <strong>모듈성</strong> — "EL을 라이브러리로 사용"하는 L2/커스텀 체인 수요 대응
        </p>

        {/* ── 크레이트 맵 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">워크스페이스 구조 — ~200개 크레이트</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">기초 타입</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>primitives/</code> — 기본 타입 (<code>Block</code>, <code>Header</code>, <code>Transaction</code>)</li>
              <li><code>primitives-traits/</code> — 타입 추상화 (<code>BlockHeader</code>, <code>Transaction</code> trait)</li>
              <li><code>chainspec/</code> — <code>ChainSpec</code>, hardfork, genesis</li>
              <li><code>ethereum-forks/</code> — <code>EthereumHardfork</code> enum, <code>ForkCondition</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">저장 (storage/)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>db/</code> — <code>tables!</code> 매크로, 테이블 스키마</li>
              <li><code>db-api/</code> — <code>Database</code> trait, <code>Cursor</code> trait</li>
              <li><code>libmdbx-rs/</code> — MDBX FFI 바인딩</li>
              <li><code>provider/</code> — <code>StateProvider</code>, <code>HistoricalStateProvider</code></li>
              <li><code>static-file/</code> — <code>StaticFileProvider</code> (cold storage)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">실행 & 상태</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>trie/</code> — MPT(Merkle Patricia Trie) 구현</li>
              <li><code>stages/</code> — <code>Pipeline</code> + 각 Stage 구현체</li>
              <li><code>consensus/</code> — 합의 검증 (Ethereum, Op Stack)</li>
              <li><code>blockchain-tree/</code> — canonical / non-canonical 체인 관리</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">네트워크 & TX</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>net/</code> — devp2p (<code>discv5</code>, <code>eth-wire</code>, <code>NetworkManager</code>)</li>
              <li><code>transaction-pool/</code> — TX 풀</li>
              <li><code>payload/</code> — Payload builder (CL 블록 구성)</li>
              <li><code>engine/</code> — Engine API (CL ↔ EL)</li>
              <li><code>rpc/</code> — JSON-RPC 서버</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4 sm:col-span-2">
            <p className="font-semibold text-sm mb-2">확장 & 빌드</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li><code>exex/</code> — Execution Extensions (확장 프레임워크)</li>
              <li><code>node/</code> — <code>NodeBuilder</code>, 컴포넌트 조립</li>
              <li><code>bin/</code> — 실행 바이너리 (<code>reth</code>, <code>op-reth</code>)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          대략 200개 크레이트로 분할 — Rust의 크레이트가 Go의 패키지보다 훨씬 세분화된 단위.<br />
          각 크레이트는 단일 책임 + 명시적 의존 관계 + 독립 빌드 캐싱.<br />
          이 분할 덕분에 OP Stack, Scroll 등이 특정 크레이트만 재사용해 자체 L2 EL 구성 가능.
        </p>

        {/* ── Stack 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">기술 스택 — 4가지 핵심 선택</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-1">revm (EVM)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>Rust 네이티브 EVM, <code>no_std</code> 지원</li>
              <li>Geth EVM 대비 ~2배 빠름</li>
              <li>Hook API로 tracing, simulation 용이</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-1">MDBX (DB)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>B+tree + mmap + MVCC</li>
              <li>Erigon이 입증한 선택</li>
              <li>페이지 캐시 직접 접근 → zero-copy 읽기</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-1">alloy (primitives & RLP)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>ethers-rs 후계 (Abigen 재설계)</li>
              <li><code>Address</code>, <code>B256</code>, <code>U256</code> 등 기본 타입</li>
              <li>derive 매크로로 RLP encode/decode 자동화</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-1">reth-mdbx-rs (MDBX 바인딩)</p>
            <ul className="text-sm space-y-1 text-foreground/80">
              <li>libmdbx C 라이브러리의 safe Rust 래퍼</li>
              <li>unsafe code는 이 크레이트에 한정</li>
              <li>workspace 전역 <code>unsafe_code = "forbid"</code> 정책</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          4가지 핵심 선택이 Reth 성능의 토대.<br />
          각 선택이 <strong>기존 검증된 프로젝트의 Rust 버전</strong>을 활용 — 위험 최소화하면서 Rust 장점 획득.<br />
          unsafe 금지 정책 덕분에 MDBX FFI 외 코드는 전부 안전성 검증됨.
        </p>

        {/* ── 포지셔닝 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">클라이언트 포지셔닝 — Geth/Erigon 대비</h3>
        <div className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">Geth</th>
                <th className="border border-border px-3 py-2 text-left">Erigon</th>
                <th className="border border-border px-3 py-2 text-left">Reth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">언어</td>
                <td className="border border-border px-3 py-2">Go</td>
                <td className="border border-border px-3 py-2">Go</td>
                <td className="border border-border px-3 py-2">Rust</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">동기화</td>
                <td className="border border-border px-3 py-2">순차 블록 처리</td>
                <td className="border border-border px-3 py-2">Staged Sync</td>
                <td className="border border-border px-3 py-2">Staged Sync</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">DB</td>
                <td className="border border-border px-3 py-2">LevelDB/Pebble</td>
                <td className="border border-border px-3 py-2">MDBX</td>
                <td className="border border-border px-3 py-2">MDBX</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">초기 동기화</td>
                <td className="border border-border px-3 py-2">수 일~수 주</td>
                <td className="border border-border px-3 py-2">~하루</td>
                <td className="border border-border px-3 py-2">~하루</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">디스크(메인넷 archive)</td>
                <td className="border border-border px-3 py-2">~2 TB</td>
                <td className="border border-border px-3 py-2">~3 TB</td>
                <td className="border border-border px-3 py-2">~2.5 TB</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">L2 SDK</td>
                <td className="border border-border px-3 py-2">제한적</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">NodeBuilder 패턴</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 Reth의 포지셔닝</p>
          <p className="mt-2">
            Reth는 "Erigon의 Rust 버전"이 아니라 "Erigon 설계 + Rust 타입 안전 + L2 SDK"로 요약됨.<br />
            - Staged Sync는 Erigon에서 검증된 패턴을 계승<br />
            - Rust 타입 시스템으로 ChainSpec/Table/Cursor 등을 컴파일 타임에 검증<br />
            - NodeBuilder 패턴으로 OP Stack, Scroll 등 L2가 Reth를 라이브러리로 사용
          </p>
          <p className="mt-2">
            특히 L2 SDK 부분이 차별점 — OP Mainnet, Base, World Chain 등이 reth-optimism으로 운영.<br />
            "EL 클라이언트 = 라이브러리"라는 관점이 Reth의 구조 설계를 결정.
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">심층 분석 아티클</h3>
        <p>기초 → 저장 → 실행 → TX/가스 → 네트워크 → 확장 순서로 읽으면 이해가 쉬움</p>
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
