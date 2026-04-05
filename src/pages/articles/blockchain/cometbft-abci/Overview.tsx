import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI 인터페이스 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ABCI(Application BlockChain Interface)는 합의 엔진과 앱 로직을 분리하는 경계입니다.<br />
          이 아티클에서는 4개 연결, Application 인터페이스, localClient의 코드를 추적합니다.
        </p>

        {/* ── ABCI 메서드 전체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI 2.0 전체 메서드 목록</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/abci/types/application.go
type Application interface {
    // Info/Query connection (read-only)
    Info(context.Context, *RequestInfo) (*ResponseInfo, error)
    Query(context.Context, *RequestQuery) (*ResponseQuery, error)

    // Mempool connection (TX validation)
    CheckTx(context.Context, *RequestCheckTx) (*ResponseCheckTx, error)

    // Consensus connection (state transitions)
    InitChain(context.Context, *RequestInitChain) (*ResponseInitChain, error)
    PrepareProposal(context.Context, *RequestPrepareProposal) (*ResponsePrepareProposal, error)
    ProcessProposal(context.Context, *RequestProcessProposal) (*ResponseProcessProposal, error)
    FinalizeBlock(context.Context, *RequestFinalizeBlock) (*ResponseFinalizeBlock, error)
    Commit(context.Context, *RequestCommit) (*ResponseCommit, error)

    // Vote Extensions (ABCI 2.0+)
    ExtendVote(context.Context, *RequestExtendVote) (*ResponseExtendVote, error)
    VerifyVoteExtension(context.Context, *RequestVerifyVoteExtension) (*ResponseVerifyVoteExtension, error)

    // Snapshot sync (state sync)
    ListSnapshots(context.Context, *RequestListSnapshots) (*ResponseListSnapshots, error)
    OfferSnapshot(context.Context, *RequestOfferSnapshot) (*ResponseOfferSnapshot, error)
    LoadSnapshotChunk(context.Context, *RequestLoadSnapshotChunk) (*ResponseLoadSnapshotChunk, error)
    ApplySnapshotChunk(context.Context, *RequestApplySnapshotChunk) (*ResponseApplySnapshotChunk, error)
}

// 13개 메서드, 4개 카테고리:
// 1. Info/Query: 2 methods (read-only)
// 2. Mempool: 1 method (CheckTx)
// 3. Consensus: 5 methods (핵심)
// 4. Vote Extension: 2 methods
// 5. Snapshot: 4 methods

// Cosmos SDK의 구현:
// - baseapp.BaseApp가 Application interface 구현
// - module manager가 각 메서드를 module로 위임
// - 결과적으로 chain 코드 작성 시 ABCI 직접 건드리지 않음`}
        </pre>
        <p className="leading-7">
          ABCI 2.0은 <strong>13개 메서드 5개 카테고리</strong>.<br />
          Info/Query/Mempool/Consensus/Extension/Snapshot.<br />
          Cosmos SDK가 이 interface를 구현 → dev는 module 작성만.
        </p>
      </div>
    </section>
  );
}
