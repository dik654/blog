import type { CodeRef } from "@/components/code/types";

const source = "CometBFT v0.40.0 · commit 0880b4d378f347ab16e54ec677ff50d803f37d62";

export const officialCometBFTExecutionCodeRefs: Record<string, CodeRef> = {
  "validate-block": {
    path: "state/validation.go · validateBlock @ 0880b4d3",
    lang: "go",
    highlight: [1, 58],
    desc: `${source}에서 긴 오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다. Block 자체의 기본 구조를 확인한 뒤 현재 State의 height·history·application commitment·validator commitment에 연결합니다.`,
    code: `func validateBlock(
    state State,
    block *types.Block,
    opts ...func(*blockValidationOptions),
) error {
    var vopts blockValidationOptions
    for _, o := range opts {
        o(&vopts)
    }
    if err := block.ValidateBasic(); err != nil {
        return err
    }

    if block.Version.App != state.Version.Consensus.App ||
        block.Version.Block != state.Version.Consensus.Block {
        return fmt.Errorf("wrong Block.Header.Version")
    }
    if block.ChainID != state.ChainID {
        return fmt.Errorf("wrong Block.Header.ChainID")
    }
    if state.LastBlockHeight == 0 && block.Height != state.InitialHeight {
        return fmt.Errorf("wrong Block.Header.Height")
    }
    if state.LastBlockHeight > 0 && block.Height != state.LastBlockHeight+1 {
        return fmt.Errorf("wrong Block.Header.Height")
    }
    if !block.LastBlockID.Equals(state.LastBlockID) {
        return fmt.Errorf("wrong Block.Header.LastBlockID")
    }

    if !bytes.Equal(block.AppHash, state.AppHash) {
        return fmt.Errorf("wrong Block.Header.AppHash")
    }
    if !bytes.Equal(block.ConsensusHash, state.ConsensusParams.Hash()) {
        return fmt.Errorf("wrong Block.Header.ConsensusHash")
    }
    if !bytes.Equal(block.LastResultsHash, state.LastResultsHash) {
        return fmt.Errorf("wrong Block.Header.LastResultsHash")
    }
    if !bytes.Equal(block.ValidatorsHash, state.Validators.Hash()) {
        return fmt.Errorf("wrong Block.Header.ValidatorsHash")
    }
    if !bytes.Equal(block.NextValidatorsHash, state.NextValidators.Hash()) {
        return fmt.Errorf("wrong Block.Header.NextValidatorsHash")
    }

    // LastCommit, proposer, median time and evidence byte checks follow.
    return nil
}`,
    annotations: [
      { lines: [6, 11], color: "sky", note: "Block 내부 형식이 먼저 맞아야 State와의 연속성을 비교할 수 있습니다." },
      { lines: [13, 28], color: "amber", note: "Version·chain·initial-height 예외·다음 height·LastBlockID를 fail closed로 검사합니다." },
      { lines: [30, 45], color: "emerald", note: "Header의 commitment는 새 결과가 아니라 현재 C40의 정본과 같아야 합니다." },
      { lines: [47, 48], color: "violet", note: "생략한 뒤쪽 원문은 LastCommit·proposer·median time·evidence 한도를 검사합니다." },
    ],
  },
  "apply-block": {
    path: "state/execution.go · ApplyBlock/applyBlock @ 0880b4d3",
    lang: "go",
    highlight: [1, 73],
    desc: `${source}에서 긴 오류 문구·로그와 주변 분기를 생략한 ApplyBlock·applyBlock 제어 흐름 발췌입니다. 검증 cache를 확인하고 FinalizeBlock response를 application Commit 전에 저장합니다.`,
    code: `func (blockExec *BlockExecutor) ApplyBlock(
    state State, blockID types.BlockID, block *types.Block,
) (State, error) {
    lastValidated := blockExec.GetLastValidatedBlock()
    expectedHeight := state.LastBlockHeight + 1
    if state.LastBlockHeight == 0 {
        expectedHeight = state.InitialHeight
    }

    if !lastValidated.HashesTo(block.Hash()) || block.Height != expectedHeight {
        if err := validateBlock(state, block, blockExec.withBlockTimeTolerance); err != nil {
            return state, ErrInvalidBlock(err)
        }
        blockExec.setLastValidatedBlock(lastValidated, block)
    }
    return blockExec.applyBlock(state, blockID, block)
}

func (blockExec *BlockExecutor) applyBlock(
    state State, blockID types.BlockID, block *types.Block,
) (State, error) {
    abciResponse, err := blockExec.proxyApp.FinalizeBlock(
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
        return state, fmt.Errorf("expected tx results length to match size of transactions in block")
    }

    // Save the results before we commit.
    if err := blockExec.store.SaveFinalizeBlockResponse(
        block.Height, abciResponse,
    ); err != nil {
        return state, err
    }

    // Validator/update validation is omitted from this excerpt.
    state, err = updateState(
        state, blockID, &block.Header, abciResponse, validatorUpdates,
    )
    if err != nil {
        return state, fmt.Errorf("commit failed for application: %v", err)
    }

    retainHeight, err := blockExec.Commit(state, block, abciResponse)
    if err != nil {
        return state, fmt.Errorf("commit failed for application: %v", err)
    }
    blockExec.evpool.Update(state, block.Evidence.Evidence)
    state.AppHash = abciResponse.AppHash
    if err := blockExec.store.Save(state); err != nil {
        return state, err
    }

    // Pruning and event publication follow.
    return state, nil
}`,
    annotations: [
      { lines: [4, 16], color: "sky", note: "같은 hash가 이미 검증됐고 expected height도 맞을 때만 중복 검증을 건너뜁니다." },
      { lines: [22, 36], color: "emerald", note: "결정된 block과 commit·evidence context를 application에 전달합니다." },
      { lines: [40, 43], color: "rose", note: "Transaction마다 결과가 하나씩 오지 않으면 저장·Commit으로 진행하지 않습니다." },
      { lines: [45, 51], color: "amber", note: "FinalizeBlock response가 application Commit보다 먼저 durable receipt가 됩니다." },
      { lines: [54, 69], color: "violet", note: "다음 State 후보를 계산하고 application Commit 뒤 AppHash를 채워 CometBFT State를 저장합니다." },
    ],
  },
  "commit-order": {
    path: "state/execution.go · Commit/asyncUpdateMempool @ 0880b4d3",
    lang: "go",
    highlight: [1, 47],
    desc: `${source}에서 긴 오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다. Mempool을 잠근 채 pending ABCI 요청을 끝내고 application Commit을 수행한 뒤, 새 committed state로 transaction을 비동기 재검사합니다.`,
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

func (blockExec *BlockExecutor) asyncUpdateMempool(
    unlockMempool func(),
    block *types.Block,
    state State,
    abciResponse *abci.ResponseFinalizeBlock,
) {
    defer unlockMempool()

    err := blockExec.mempool.Update(
        block.Height,
        block.Txs,
        abciResponse.TxResults,
        TxPreCheck(state),
        TxPostCheck(state),
    )
    if err != nil {
        panic(fmt.Sprintf("client error during mempool.Update; error %v", err))
    }
}`,
    annotations: [
      { lines: [6, 13], color: "amber", note: "Lock과 FlushAppConn이 이전 CheckTx 요청을 Commit 경계 안으로 끌고 오지 못하게 합니다." },
      { lines: [15, 20], color: "emerald", note: "Commit 반환 전 application은 자기 state를 durable하게 만들어야 합니다." },
      { lines: [22, 25], color: "sky", note: "Mempool Update는 goroutine으로 시작하므로 ApplyBlock의 State 저장과 겹칠 수 있습니다." },
      { lines: [33, 45], color: "violet", note: "실행된 transaction을 제거하고 남은 transaction을 새 State 규칙으로 재검사한 뒤 잠금을 풉니다." },
    ],
  },
  "update-state": {
    path: "state/execution.go · updateState @ 0880b4d3",
    lang: "go",
    highlight: [1, 55],
    desc: `${source}에서 긴 오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다. Header와 FinalizeBlock response로 다음 CometBFT State를 만들되 AppHash는 비워 두고 Commit 뒤 채웁니다.`,
    code: `func updateState(
    state State,
    blockID types.BlockID,
    header *types.Header,
    abciResponse *abci.ResponseFinalizeBlock,
    validatorUpdates []*types.Validator,
) (State, error) {
    nValSet := state.NextValidators.Copy()

    lastHeightValsChanged := state.LastHeightValidatorsChanged
    if len(validatorUpdates) > 0 {
        if err := nValSet.UpdateWithChangeSet(validatorUpdates); err != nil {
            return state, fmt.Errorf("changing validator set: %w", err)
        }
        lastHeightValsChanged = header.Height + 1 + 1
    }
    nValSet.IncrementProposerPriority(1)

    nextParams := state.ConsensusParams
    lastHeightParamsChanged := state.LastHeightConsensusParamsChanged
    if abciResponse.ConsensusParamUpdates != nil {
        nextParams = state.ConsensusParams.Update(abciResponse.ConsensusParamUpdates)
        if err := nextParams.ValidateBasic(); err != nil {
            return state, fmt.Errorf("validating new consensus params: %w", err)
        }
        lastHeightParamsChanged = header.Height + 1
    }

    // AppHash is intentionally nil here. applyBlock fills it after Commit.
    return State{
        Version:                          state.Version,
        ChainID:                          state.ChainID,
        InitialHeight:                    state.InitialHeight,
        LastBlockHeight:                  header.Height,
        LastBlockID:                      blockID,
        LastBlockTime:                    header.Time,
        NextValidators:                   nValSet,
        Validators:                       state.NextValidators.Copy(),
        LastValidators:                   state.Validators.Copy(),
        LastHeightValidatorsChanged:      lastHeightValsChanged,
        ConsensusParams:                  nextParams,
        LastHeightConsensusParamsChanged: lastHeightParamsChanged,
        LastResultsHash:                  TxResultsHash(abciResponse.TxResults),
        AppHash:                          nil,
    }, nil
}`,
    annotations: [
      { lines: [8, 17], color: "sky", note: "Height h의 validator update는 h+2부터 실제 Validators가 되는 지연을 기록합니다." },
      { lines: [19, 27], color: "amber", note: "Consensus parameter update는 검증 뒤 h+1부터 적용될 값을 준비합니다." },
      { lines: [29, 46], color: "emerald", note: "Next·current·last validator snapshot과 LastResultsHash를 한 State 값으로 복사합니다." },
      { lines: [47, 47], color: "rose", note: "AppHash가 nil인 C41*는 아직 최종 저장할 State가 아닙니다." },
    ],
  },
  "replay-decision": {
    path: "consensus/replay.go · ReplayBlocks decision @ 0880b4d3",
    lang: "go",
    highlight: [1, 57],
    desc: `${source}에서 긴 오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다. BlockStore·StateStore·application height를 비교해 실제 application에 replay할지, 저장된 response를 돌려주는 mock application으로 State만 재구성할지 선택합니다.`,
    code: `switch {
case storeBlockHeight == 0:
    assertAppHashEqualsOneFromState(appHash, state)
    return appHash, nil
case storeBlockHeight < appBlockHeight:
    return appHash, sm.ErrAppBlockHeightTooHigh{
        CoreHeight: storeBlockHeight,
        AppHeight:  appBlockHeight,
    }
case storeBlockHeight < stateBlockHeight:
    panic(fmt.Sprintf("StateBlockHeight > StoreBlockHeight"))
case storeBlockHeight > stateBlockHeight+1:
    panic(fmt.Sprintf("StoreBlockHeight > StateBlockHeight + 1"))
}

switch storeBlockHeight {
case stateBlockHeight:
    if appBlockHeight < storeBlockHeight {
        return h.replayBlocks(
            ctx, state, proxyApp, appBlockHeight, storeBlockHeight, false,
        )
    } else if appBlockHeight == storeBlockHeight {
        assertAppHashEqualsOneFromState(appHash, state)
        return appHash, nil
    }

case stateBlockHeight + 1:
    switch {
    case appBlockHeight < stateBlockHeight:
        return h.replayBlocks(
            ctx, state, proxyApp, appBlockHeight, storeBlockHeight, true,
        )

    case appBlockHeight == stateBlockHeight:
        state, err = h.replayBlock(
            state, storeBlockHeight, proxyApp.Consensus(),
        )
        return state.AppHash, err

    case appBlockHeight == storeBlockHeight:
        finalizeBlockResponse, err :=
            h.stateStore.LoadLastFinalizeBlockResponse(storeBlockHeight)
        if err != nil {
            return nil, err
        }
        if len(finalizeBlockResponse.AppHash) == 0 {
            finalizeBlockResponse.AppHash = appHash
        }
        mockApp := newMockProxyApp(finalizeBlockResponse)
        state, err = h.replayBlock(state, storeBlockHeight, mockApp)
        return state.AppHash, err
    }
}

panic(fmt.Sprintf("uncovered replay height combination"))`,
    annotations: [
      { lines: [1, 14], color: "rose", note: "Application이나 State가 BlockStore보다 앞서는 불가능 조합은 계속 진행하지 않습니다." },
      { lines: [17, 25], color: "sky", note: "Store와 State 높이가 같으면 app만 뒤처졌는지 또는 모두 맞는지 나눕니다." },
      { lines: [27, 38], color: "amber", note: "Store가 한 높이 앞이고 app도 뒤라면 마지막 block을 실제 application에 replay합니다." },
      { lines: [40, 52], color: "emerald", note: "Application은 이미 h41인데 State만 h40이면 저장된 response의 mock app으로 State만 재구성합니다." },
    ],
  },
};
