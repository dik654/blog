import type { CodeRef } from "@/components/code/types";

export const officialCometBFTCodeRefs: Record<string, CodeRef> = {
  "cometbft-checktx-v040": {
    path: "cometbft/mempool/clist_mempool.go · CheckTx",
    lang: "go",
    highlight: [1, 31],
    desc: "CometBFT v0.40.0 commit 0880b4d3 원문에서 핵심 분기만 줄여 옮긴 발췌입니다. Node-local admission이 capacity·size·precheck·duplicate cache를 거친 뒤 application CheckTx를 비동기로 호출합니다.",
    code: `func (mem *CListMempool) CheckTx(tx types.Tx, cb Callback, info TxInfo) error {
    // Commit·Update와 동시에 후보 목록을 바꾸지 않도록 read lock을 잡습니다.
    mem.updateMtx.RLock()
    defer mem.updateMtx.RUnlock()

    // Node가 보관할 수 있는 총량과 transaction 한 건의 크기를 먼저 확인합니다.
    if err := mem.isFull(len(tx)); err != nil {
        return err
    }
    if len(tx) > mem.config.MaxTxBytes {
        return ErrTxTooLarge{Max: mem.config.MaxTxBytes, Actual: len(tx)}
    }

    // Application 호출 전에 CometBFT가 아는 block-level 조건을 검사합니다.
    if mem.preCheck != nil {
        if err := mem.preCheck(tx); err != nil {
            return ErrPreCheck{Err: err}
        }
    }

    // 이미 본 bytes라면 duplicate cache에서 거절합니다.
    if !mem.cache.Push(tx) {
        return ErrTxInCache
    }

    // Application의 CheckTx 결과는 callback에서 local pool membership을 정합니다.
    reqRes, err := mem.proxyAppConn.CheckTxAsync(
        context.TODO(),
        &abci.RequestCheckTx{Tx: tx},
    )
    reqRes.SetCallback(mem.reqResCb(tx, info, cb))
    return err
}`,
    annotations: [
      { lines: [1, 12], color: "sky", note: "CometBFT의 local capacity gate입니다. 아직 application business rule은 실행하지 않았습니다." },
      { lines: [14, 23], color: "amber", note: "Precheck와 duplicate cache는 inclusion·commit 보장이 아니라 node-local admission 조건입니다." },
      { lines: [25, 31], color: "emerald", note: "Application CheckTx 응답이 돌아온 뒤에야 local mempool 후보가 됩니다." },
    ],
  },
  "cometbft-entercommit-v040": {
    path: "cometbft/consensus/state.go · enterCommit / tryFinalizeCommit",
    lang: "go",
    highlight: [1, 31],
    desc: "같은 commit의 원문에서 핵심 분기만 줄여 옮긴 발췌입니다. +2/3 precommit evidence와 실제 block bytes를 모두 가진 뒤에만 finalizeCommit으로 넘어갑니다.",
    code: `func (cs *State) enterCommit(height int64, commitRound int32) {
    // 같은 round의 precommit에서 voting power +2/3 block ID를 찾습니다.
    blockID, ok := cs.Votes.Precommits(commitRound).TwoThirdsMajority()
    if !ok {
        panic("enterCommit expects +2/3 precommits")
    }

    // Commit hash와 같은 locked block을 이미 갖고 있으면 재사용합니다.
    if cs.LockedBlock.HashesTo(blockID.Hash) {
        cs.ProposalBlock = cs.LockedBlock
        cs.ProposalBlockParts = cs.LockedBlockParts
    }

    // 투표 증거는 있지만 block bytes가 없으면 part를 받아야 합니다.
    if !cs.ProposalBlock.HashesTo(blockID.Hash) {
        cs.ProposalBlock = nil
        cs.ProposalBlockParts = types.NewPartSetFromHeader(blockID.PartSetHeader)
    }

    cs.CommitRound = commitRound
    cs.tryFinalizeCommit(height)
}

func (cs *State) tryFinalizeCommit(height int64) {
    blockID, ok := cs.Votes.Precommits(cs.CommitRound).TwoThirdsMajority()
    if !ok || len(blockID.Hash) == 0 {
        return
    }
    // Decision evidence와 그 hash의 bytes가 함께 있어야 실행으로 진행합니다.
    if !cs.ProposalBlock.HashesTo(blockID.Hash) {
        return
    }
    cs.finalizeCommit(height)
}`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "Commit 판정은 validator 수가 아니라 같은 round의 voting power +2/3입니다." },
      { lines: [8, 19], color: "amber", note: "Decision evidence가 있어도 block bytes가 없으면 application을 실행할 수 없습니다." },
      { lines: [21, 31], color: "emerald", note: "Certificate와 block hash가 맞을 때만 BlockExecutor 경로로 이동합니다." },
    ],
  },
  "cometbft-applycommit-v040": {
    path: "cometbft/state/execution.go · applyBlock / Commit",
    lang: "go",
    highlight: [1, 37],
    desc: "같은 commit의 원문에서 핵심 분기만 줄여 옮긴 발췌입니다. 결정된 block을 FinalizeBlock에 전달하고 response를 저장한 뒤 application Commit과 CometBFT State 저장을 나눕니다.",
    code: `func (blockExec *BlockExecutor) applyBlock(state State, id BlockID, block *Block) (State, error) {
    // 합의된 block의 모든 transaction을 application에 한 번에 넘깁니다.
    response, err := blockExec.proxyApp.FinalizeBlock(context.TODO(), &abci.RequestFinalizeBlock{
        Hash: block.Hash(), Height: block.Height, Txs: block.Txs.ToSliceOfBytes(),
    })
    if err != nil {
        return state, err
    }

    // Crash replay가 같은 결과를 찾을 수 있도록 response를 Commit보다 먼저 저장합니다.
    if err := blockExec.store.SaveFinalizeBlockResponse(block.Height, response); err != nil {
        return state, err
    }

    // Validator·parameter update를 반영한 다음 높이의 CometBFT State를 계산합니다.
    state, err = updateState(state, id, &block.Header, response, validatorUpdates)
    if err != nil {
        return state, err
    }

    // Application이 자기 database를 durable하게 저장합니다.
    if _, err := blockExec.Commit(state, block, response); err != nil {
        return state, err
    }

    // FinalizeBlock이 반환한 AppHash를 CometBFT State에 넣어 별도로 저장합니다.
    state.AppHash = response.AppHash
    if err := blockExec.store.Save(state); err != nil {
        return state, err
    }
    return state, nil
}

func (blockExec *BlockExecutor) Commit(state State, block *Block, response *ResponseFinalizeBlock) error {
    // CheckTx와 Commit이 application state 세대를 섞지 않게 mempool을 잠급니다.
    blockExec.mempool.Lock()
    blockExec.mempool.FlushAppConn()
    _, err := blockExec.proxyApp.Commit(context.TODO())
    return err
}`,
    annotations: [
      { lines: [1, 12], color: "sky", note: "FinalizeBlock 결과와 그 결과를 다시 찾을 receipt를 application Commit 전에 만듭니다." },
      { lines: [14, 28], color: "emerald", note: "Application durable commit과 CometBFT State 저장은 서로 다른 경계입니다." },
      { lines: [31, 37], color: "amber", note: "Mempool 세대 전환은 application Commit과 맞물리므로 CheckTx와 분리해 추적해야 합니다." },
    ],
  },
};
