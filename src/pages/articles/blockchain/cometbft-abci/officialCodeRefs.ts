import type { CodeRef } from "@/components/code/types";

const source = "CometBFT v0.40.0 · commit 0880b4d378f347ab16e54ec677ff50d803f37d62";

export const officialCometBFTAbciCodeRefs: Record<string, CodeRef> = {
  "app-conns": {
    path: "proxy/multi_app_conn.go · AppConns @ 0880b4d3",
    lang: "go",
    highlight: [1, 35],
    desc: `${source} 원문 발췌입니다. Consensus·mempool·query·snapshot은 서로 다른 논리 연결과 client를 가지며 각 연결이 허용하는 method 집합도 다릅니다.`,
    code: `const (
    connConsensus = "consensus"
    connMempool   = "mempool"
    connQuery     = "query"
    connSnapshot  = "snapshot"
)

type AppConns interface {
    service.Service
    Mempool() AppConnMempool
    Consensus() AppConnConsensus
    Query() AppConnQuery
    Snapshot() AppConnSnapshot
}

type multiAppConn struct {
    service.BaseService

    metrics       *Metrics
    consensusConn AppConnConsensus
    mempoolConn   AppConnMempool
    queryConn     AppConnQuery
    snapshotConn  AppConnSnapshot

    consensusConnClient abcicli.Client
    mempoolConnClient   abcicli.Client
    queryConnClient     abcicli.Client
    snapshotConnClient  abcicli.Client

    clientCreator ClientCreator
}`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "네 이름은 같은 application을 향하지만 서로 다른 요청 흐름을 구분합니다." },
      { lines: [8, 14], color: "emerald", note: "호출자는 범용 client가 아니라 역할별 interface를 받습니다." },
      { lines: [16, 29], color: "amber", note: "각 역할은 별도의 wrapper와 underlying ABCI client를 보유합니다." },
    ],
  },
  "application-interface": {
    path: "abci/types/application.go · Application @ 0880b4d3",
    lang: "go",
    highlight: [1, 29],
    desc: `${source} 원문의 Application interface입니다. Method 이름이 어느 연결에 속하고 어떤 상태를 읽거나 바꾸는지 구분하는 출발점입니다.`,
    code: `type Application interface {
    // Info/Query Connection
    Info(context.Context, *RequestInfo) (*ResponseInfo, error)
    Query(context.Context, *RequestQuery) (*ResponseQuery, error)

    // Mempool Connection
    CheckTx(context.Context, *RequestCheckTx) (*ResponseCheckTx, error)
    InsertTx(context.Context, *RequestInsertTx) (*ResponseInsertTx, error)
    ReapTxs(context.Context, *RequestReapTxs) (*ResponseReapTxs, error)

    // Consensus Connection
    InitChain(context.Context, *RequestInitChain) (*ResponseInitChain, error)
    PrepareProposal(context.Context, *RequestPrepareProposal) (*ResponsePrepareProposal, error)
    ProcessProposal(context.Context, *RequestProcessProposal) (*ResponseProcessProposal, error)
    FinalizeBlock(context.Context, *RequestFinalizeBlock) (*ResponseFinalizeBlock, error)
    ExtendVote(context.Context, *RequestExtendVote) (*ResponseExtendVote, error)
    VerifyVoteExtension(context.Context, *RequestVerifyVoteExtension) (*ResponseVerifyVoteExtension, error)
    Commit(context.Context, *RequestCommit) (*ResponseCommit, error)

    // State Sync Connection
    ListSnapshots(context.Context, *RequestListSnapshots) (*ResponseListSnapshots, error)
    OfferSnapshot(context.Context, *RequestOfferSnapshot) (*ResponseOfferSnapshot, error)
    LoadSnapshotChunk(context.Context, *RequestLoadSnapshotChunk) (*ResponseLoadSnapshotChunk, error)
    ApplySnapshotChunk(context.Context, *RequestApplySnapshotChunk) (*ResponseApplySnapshotChunk, error)
}`,
    annotations: [
      { lines: [2, 4], color: "sky", note: "Info와 Query는 committed application 정보를 읽는 경로입니다." },
      { lines: [6, 9], color: "amber", note: "CheckTxState를 사용하는 mempool 경로입니다." },
      { lines: [11, 19], color: "emerald", note: "후보 구성부터 결정 실행과 영속화까지 consensus 경로가 소유합니다." },
      { lines: [21, 25], color: "violet", note: "Snapshot 경로는 state sync용 artifact를 주고받습니다." },
    ],
  },
  "local-client": {
    path: "abci/client/local_client.go · localClient @ 0880b4d3",
    lang: "go",
    highlight: [1, 31],
    desc: `${source} 원문 발췌입니다. In-process transport도 네 연결의 호출을 global mutex로 직렬화합니다. 이는 thread safety를 돕지만 method 의미나 durability를 대신 보장하지 않습니다.`,
    code: `type localClient struct {
    service.BaseService
    mtx *cmtsync.Mutex
    types.Application
    Callback
}

func NewLocalClient(mtx *cmtsync.Mutex, app types.Application) Client {
    if mtx == nil {
        mtx = new(cmtsync.Mutex)
    }
    cli := &localClient{
        mtx:         mtx,
        Application: app,
    }
    cli.BaseService = *service.NewBaseService(nil, "localClient", cli)
    return cli
}

func (app *localClient) ProcessProposal(
    ctx context.Context, req *types.RequestProcessProposal,
) (*types.ResponseProcessProposal, error) {
    app.mtx.Lock()
    defer app.mtx.Unlock()
    return app.Application.ProcessProposal(ctx, req)
}

func (app *localClient) FinalizeBlock(
    ctx context.Context, req *types.RequestFinalizeBlock,
) (*types.ResponseFinalizeBlock, error) {
    app.mtx.Lock()
    defer app.mtx.Unlock()
    return app.Application.FinalizeBlock(ctx, req)
}`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "하나의 application과 하나의 mutex를 client가 공유합니다." },
      { lines: [8, 18], color: "amber", note: "전달받은 mutex가 없으면 만들고 같은 application을 감쌉니다." },
      { lines: [20, 31], color: "emerald", note: "각 ABCI call은 같은 mutex 안에서 실제 application method로 전달됩니다." },
    ],
  },
  "create-proposal-block": {
    path: "state/execution.go · CreateProposalBlock @ 0880b4d3",
    lang: "go",
    highlight: [1, 45],
    desc: `${source} 원문의 CreateProposalBlock 핵심 구간입니다. Mempool의 raw transaction을 application에 넘기고, 돌아온 transaction 목록의 크기를 검증한 뒤 proposal block을 다시 만듭니다.`,
    code: `txs := blockExec.mempool.ReapMaxBytesMaxGas(maxReapBytes, maxGas)
commit := lastExtCommit.ToCommit()
block, err := state.MakeBlock(height, txs, commit, evidence, proposerAddr)
if err != nil {
    return nil, err
}

rpp, err := blockExec.proxyApp.PrepareProposal(
    ctx,
    &abci.RequestPrepareProposal{
        MaxTxBytes:         maxDataBytes,
        Txs:                block.Txs.ToSliceOfBytes(),
        LocalLastCommit:    blockExec.buildExtendedCommitInfo(
            lastExtCommit, state.InitialHeight, state.ConsensusParams.ABCI,
        ),
        Misbehavior:        block.Evidence.Evidence.ToABCI(),
        Height:             block.Height,
        Time:               block.Time,
        NextValidatorsHash: block.NextValidatorsHash,
        ProposerAddress:    block.ProposerAddress,
    },
)
if err != nil {
    return nil, err
}

txl := types.ToTxs(rpp.Txs)
if err := txl.Validate(maxDataBytes); err != nil {
    return nil, err
}

return state.MakeBlock(height, txl, commit, evidence, proposerAddr)`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "먼저 mempool에서 raw proposal을 만들지만 이것이 최종 transaction 목록은 아닙니다." },
      { lines: [8, 22], color: "amber", note: "Application은 이전 commit·evidence·height·time과 함께 raw transaction을 받습니다." },
      { lines: [27, 32], color: "emerald", note: "응답 transaction의 총 크기를 검사한 뒤 그 목록으로 block을 다시 만듭니다." },
    ],
  },
  "process-proposal": {
    path: "state/execution.go · ProcessProposal @ 0880b4d3",
    lang: "go",
    highlight: [1, 28],
    desc: `${source} 원문의 ProcessProposal입니다. 같은 block bytes와 이전 committed state를 본 correct node는 같은 ACCEPT 또는 REJECT를 만들어야 합니다.`,
    code: `func (blockExec *BlockExecutor) ProcessProposal(
    block *types.Block,
    state State,
) (bool, error) {
    resp, err := blockExec.proxyApp.ProcessProposal(
        context.TODO(),
        &abci.RequestProcessProposal{
            Hash:               block.Header.Hash(),
            Height:             block.Height,
            Time:               block.Time,
            Txs:                block.Txs.ToSliceOfBytes(),
            ProposedLastCommit: blockExec.buildLastCommitInfo(block, state.InitialHeight),
            Misbehavior:        block.Evidence.Evidence.ToABCI(),
            ProposerAddress:    block.ProposerAddress,
            NextValidatorsHash: block.NextValidatorsHash,
        },
    )
    if err != nil {
        return false, err
    }
    if resp.IsStatusUnknown() {
        panic(fmt.Sprintf(
            "ProcessProposal responded with status %s", resp.Status.String(),
        ))
    }

    return resp.IsAccepted(), nil
}`,
    annotations: [
      { lines: [5, 17], color: "sky", note: "Proposal의 hash·transaction·context를 application에 동기 전달합니다." },
      { lines: [18, 25], color: "rose", note: "Transport 오류와 정의되지 않은 status를 정상 REJECT와 구분합니다." },
      { lines: [27, 27], color: "emerald", note: "최종 boolean은 consensus가 block 또는 nil에 prevote할 때 사용합니다." },
    ],
  },
  "apply-block": {
    path: "state/execution.go · applyBlock @ 0880b4d3",
    lang: "go",
    highlight: [1, 36],
    desc: `${source} 원문의 FinalizeBlock 호출과 response 저장 구간입니다. Application은 결정된 block을 실행해 결과를 반환하지만 이 method에서 durable commit하면 안 됩니다.`,
    code: `abciResponse, err := blockExec.proxyApp.FinalizeBlock(
    context.TODO(),
    &abci.RequestFinalizeBlock{
        Hash:               block.Hash(),
        NextValidatorsHash: block.NextValidatorsHash,
        ProposerAddress:    block.ProposerAddress,
        Height:             block.Height,
        Time:               block.Time,
        DecidedLastCommit:  blockExec.buildLastCommitInfo(block, state.InitialHeight),
        Misbehavior:        block.Evidence.Evidence.ToABCI(),
        Txs:                block.Txs.ToSliceOfBytes(),
    },
)
if err != nil {
    return state, err
}

if len(block.Txs) != len(abciResponse.TxResults) {
    return state, fmt.Errorf(
        "expected tx results length to match size of transactions in block",
    )
}

// Save the results before we commit.
if err := blockExec.store.SaveFinalizeBlockResponse(
    block.Height, abciResponse,
); err != nil {
    return state, err
}

// Validator/consensus-parameter validation and updateState follow here.`,
    annotations: [
      { lines: [1, 12], color: "sky", note: "결정된 block의 모든 consensus context를 FinalizeBlock에 다시 전달합니다." },
      { lines: [17, 21], color: "rose", note: "Transaction 수와 result 수가 다르면 height를 진행하지 않습니다." },
      { lines: [24, 29], color: "amber", note: "Application Commit 전에 FinalizeBlock response를 CometBFT store에 남깁니다." },
    ],
  },
  "commit-order": {
    path: "state/execution.go · Commit and state save @ 0880b4d3",
    lang: "go",
    highlight: [1, 49],
    desc: `${source} 원문의 commit 순서 발췌입니다. Mempool을 잠그고 pending CheckTx를 flush한 뒤 application을 commit하고, 그 뒤 CometBFT node state를 저장합니다.`,
    code: `func (blockExec *BlockExecutor) Commit(
    state State,
    block *types.Block,
    abciResponse *abci.ResponseFinalizeBlock,
) (int64, error) {
    blockExec.mempool.Lock()
    unlockMempool := func() { blockExec.mempool.Unlock() }

    err := blockExec.mempool.FlushAppConn()
    if err != nil {
        unlockMempool()
        return 0, err
    }

    res, err := blockExec.proxyApp.Commit(context.TODO())
    if err != nil {
        unlockMempool()
        return 0, err
    }

    go blockExec.asyncUpdateMempool(
        unlockMempool, block, state.Copy(), abciResponse,
    )
    return res.RetainHeight, nil
}

// Back in applyBlock, after Commit returned:
retainHeight, err := blockExec.Commit(state, block, abciResponse)
if err != nil {
    return state, fmt.Errorf("commit failed for application: %v", err)
}

blockExec.evpool.Update(state, block.Evidence.Evidence)
state.AppHash = abciResponse.AppHash
if err := blockExec.store.Save(state); err != nil {
    return state, err
}

if retainHeight > 0 {
    _, err := blockExec.pruneBlocks(retainHeight, state)
    if err != nil {
        blockExec.logger.Error("failed to prune blocks", "err", err)
    }
}`,
    annotations: [
      { lines: [6, 12], color: "amber", note: "Mempool lock과 flush가 새 CheckTx와 pending request를 Commit 경계 밖에 둡니다." },
      { lines: [14, 24], color: "emerald", note: "Application Commit이 성공한 뒤 남은 transaction을 새 committed state로 비동기 재검사합니다." },
      { lines: [27, 36], color: "sky", note: "Application Commit 뒤에 AppHash를 반영한 CometBFT state를 저장합니다." },
      { lines: [38, 44], color: "violet", note: "RetainHeight는 commit 성공 후 선택적으로 오래된 block을 정리하는 신호입니다." },
    ],
  },
};
