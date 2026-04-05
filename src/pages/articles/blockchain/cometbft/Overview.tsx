import CometBFTArchFlowViz from './viz/CometBFTArchFlowViz';

const ARTICLES = [
  /* 아랫단 → 윗단 순서 */
  { href: '/blockchain/cometbft-types', title: '타입: Block · Vote · ValidatorSet', desc: 'Header · VoteSet · 가중 라운드로빈 제안자 선정' },
  { href: '/blockchain/cometbft-crypto', title: '암호학: Ed25519 · Merkle · TMHASH', desc: '서명/검증 · 머클 증명 · 해시 체인' },
  { href: '/blockchain/cometbft-p2p', title: 'P2P: MConnection · Switch · Reactor', desc: '채널 다중화 · 피어 관리 · 메시지 디스패치' },
  { href: '/blockchain/cometbft-mempool', title: '멤풀: CListMempool · CheckTx · Recheck', desc: '이중 연결 리스트 · ABCI 검증 · 블록 후 재검증' },
  { href: '/blockchain/cometbft-state', title: '상태: State · BlockStore · EvidencePool', desc: '상태 영구 저장 · 파트 단위 블록 저장 · 비잔틴 증거' },
  { href: '/blockchain/cometbft-consensus', title: '합의 엔진: receiveRoutine → 라운드 상태 머신', desc: 'enterPropose → Prevote → Precommit → Commit' },
  { href: '/blockchain/cometbft-abci', title: 'ABCI: PrepareProposal → FinalizeBlock → Commit', desc: '3가지 연결 모드 · 앱 인터페이스 · 호출 순서' },
  { href: '/blockchain/cometbft-execution', title: 'BlockExecutor.ApplyBlock 전체 추적', desc: 'ValidateBlock → FinalizeBlock → Commit → SaveState' },
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CometBFT 아키텍처 개요</h2>
      <div className="not-prose mb-8"><CometBFTArchFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT(구 Tendermint Core) — 블록체인을 위한 BFT 합의 엔진<br />
          합의와 앱 로직을 ABCI로 분리 (이더리움의 EL+CL 분리와 유사)<br />
          단일 슬롯 최종성(instant finality) — 블록 커밋 = 즉시 확정
        </p>

        {/* ── CometBFT 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CometBFT 프로젝트 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CometBFT 연혁:
// 2014: Tendermint 최초 (Jae Kwon PhD 논문)
// 2017: Cosmos Network 런칭 (Tendermint 기반)
// 2022: Tendermint 조직 분열
// 2023: CometBFT로 fork (Informal Systems 주도)
// 2024~: CometBFT v1.0 stable

// 현재 사용 체인 (2025):
// - Cosmos Hub (ATOM)
// - Osmosis (OSMO) - DeFi hub
// - dYdX v4 - orderbook DEX
// - Celestia - DA layer
// - Sei Network - trading blockchain
// - Injective - finance blockchain
// - Berachain - PoL
// - Neutron, Juno, Stride, Kava 등 200+ chains

// CometBFT의 위치:
// - BFT 합의 엔진 (state machine 분리)
// - IBC 프로토콜 기반
// - Cosmos SDK와 통합
// - "Proof of Stake + Instant Finality" 제공

// 아키텍처 철학:
// - 모듈성: 합의 엔진과 앱 로직 분리
// - 언어 독립성: 어떤 언어로든 앱 구현 가능
// - 즉시 최종성: 블록 커밋 = 확정 (2/3 quorum)
// - IBC 호환: Cosmos 생태계 interop`}
        </pre>
        <p className="leading-7">
          CometBFT는 <strong>Tendermint의 후계</strong>.<br />
          2023년 Informal Systems가 주도하여 community fork.<br />
          Cosmos SDK의 기반 엔진으로 200+ 체인이 사용.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">심층 분석 아티클</h3>
        <p>타입 → 암호학 → P2P → 멤풀 → 상태 → 합의 → ABCI → 실행 순서로 읽으면 아랫단부터 이해 가능</p>
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
