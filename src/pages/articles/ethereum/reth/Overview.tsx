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
