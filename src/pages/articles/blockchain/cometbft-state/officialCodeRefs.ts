import type { CodeRef } from "@/components/code/types";

const source = "CometBFT v0.40.0 · commit 0880b4d378f347ab16e54ec677ff50d803f37d62";
const excerpt = `${source}에서 긴 로그·오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다.`;

export const officialCometBFTStateCodeRefs: Record<string, CodeRef> = {
  "state-struct": {
    path: "state/state.go · State @ 0880b4d3",
    lang: "go",
    highlight: [1, 29],
    desc: `${excerpt} 다음 block을 검증할 height·validator·parameter와 application commitment를 한 snapshot으로 보존합니다.`,
    code: `type State struct {
    Version cmtstate.Version

    ChainID       string
    InitialHeight int64

    LastBlockHeight int64
    LastBlockID     types.BlockID
    LastBlockTime   time.Time

    // LastValidators validates block.LastCommit.
    NextValidators              *types.ValidatorSet
    Validators                  *types.ValidatorSet
    LastValidators              *types.ValidatorSet
    LastHeightValidatorsChanged int64

    // Parameters used for validating blocks.
    ConsensusParams                  types.ConsensusParams
    LastHeightConsensusParamsChanged int64

    // Merkle root of the results from executing the previous block.
    LastResultsHash []byte

    // Latest AppHash received from the application.
    AppHash []byte
}`,
    annotations: [
      { lines: [4, 9], color: "sky", note: "Chain과 마지막 block 위치를 보존해 다음 높이의 시작점을 정합니다." },
      { lines: [11, 15], color: "amber", note: "과거 commit 검증, 현재 투표와 지연 적용을 위해 validator set을 하나로 덮어쓰지 않습니다." },
      { lines: [17, 19], color: "violet", note: "다음 block 검증에 사용할 consensus parameters와 변경 기준 높이를 연결합니다." },
      { lines: [21, 25], color: "emerald", note: "ResultsHash와 AppHash는 application 실행 결과의 commitment이며 State DB 자체의 root가 아닙니다." },
    ],
  },
  "persistence-order": {
    path: "consensus/state.go · state/execution.go @ 0880b4d3",
    lang: "go",
    highlight: [1, 39],
    desc: `${excerpt} 합의 block 원본, FinalizeBlock 응답, application Commit, State snapshot을 순서대로 영속화합니다.`,
    code: `// consensus/state.go
if cs.blockStore.Height() < block.Height {
    seenCommit := cs.Votes.Precommits(cs.CommitRound).
        MakeExtendedCommit(cs.state.ConsensusParams.ABCI)
    cs.blockStore.SaveBlock(block, blockParts, seenCommit.ToCommit())
}
cs.wal.WriteSync(EndHeightMessage{height})

stateCopy, err := cs.blockExec.ApplyVerifiedBlock(
    cs.state.Copy(), blockID, block,
)

// state/execution.go · applyBlock
abciResponse, err := blockExec.proxyApp.FinalizeBlock(ctx, request)
if err != nil { return state, err }

// Save the results before we commit.
if err := blockExec.store.SaveFinalizeBlockResponse(
    block.Height, abciResponse,
); err != nil { return state, err }

state, err = updateState(state, blockID, &block.Header,
    abciResponse, validatorUpdates)
if err != nil { return state, err }

_, err = blockExec.Commit(state, block, abciResponse)
if err != nil { return state, err }

state.AppHash = abciResponse.AppHash
if err := blockExec.store.Save(state); err != nil {
    return state, err
}`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "합의된 block과 seen commit을 먼저 BlockStore에 동기 저장하고 WAL에 height 종료를 기록합니다." },
      { lines: [13, 20], color: "amber", note: "FinalizeBlock 응답 F_h는 application Commit 전에 State Store DB에 저장합니다." },
      { lines: [22, 27], color: "violet", note: "응답으로 다음 validator·parameter·results snapshot을 계산한 뒤 application Commit을 호출합니다." },
      { lines: [29, 32], color: "emerald", note: "마지막에 AppHash를 넣은 State를 저장합니다. 여기 직전 crash가 B=S+1, A=B 조합을 만듭니다." },
    ],
  },
  "finalize-receipt": {
    path: "state/store.go · Save/LoadLastFinalizeBlockResponse @ 0880b4d3",
    lang: "go",
    highlight: [1, 42],
    desc: `${excerpt} Height별 응답 보관 설정과 무관하게 crash recovery용 마지막 응답은 height와 함께 동기 저장합니다.`,
    code: `func (store dbStore) SaveFinalizeBlockResponse(
    height int64,
    resp *abci.ResponseFinalizeBlock,
) error {
    if !store.DiscardABCIResponses {
        bz, err := resp.Marshal()
        if err != nil { return err }
        if err := store.db.Set(
            calcABCIResponsesKey(height), bz,
        ); err != nil { return err }
    }

    // Always save the last response for crash recovery.
    response := &cmtstate.ABCIResponsesInfo{
        ResponseFinalizeBlock: resp,
        Height: height,
    }
    bz, err := response.Marshal()
    if err != nil { return err }
    return store.db.SetSync(lastABCIResponseKey, bz)
}

func (store dbStore) LoadLastFinalizeBlockResponse(
    height int64,
) (*abci.ResponseFinalizeBlock, error) {
    bz, err := store.db.Get(lastABCIResponseKey)
    if err != nil { return nil, err }
    if len(bz) == 0 {
        return nil, errors.New("no last ABCI response")
    }
    info := new(cmtstate.ABCIResponsesInfo)
    if err := info.Unmarshal(bz); err != nil { cmtos.Exit(...) }
    if height != info.GetHeight() {
        return nil, fmt.Errorf("expected height %d, got %d",
            height, info.GetHeight())
    }
    return info.ResponseFinalizeBlock, nil
}`,
    annotations: [
      { lines: [5, 11], color: "sky", note: "높이별 query용 응답은 DiscardABCIResponses 설정에 따라 생략할 수 있습니다." },
      { lines: [13, 21], color: "emerald", note: "마지막 응답은 설정과 무관하게 height와 묶어 SetSync로 영속화합니다." },
      { lines: [27, 32], color: "amber", note: "복구 입력이 없으면 mock replay를 추측으로 진행하지 않습니다." },
      { lines: [34, 38], color: "rose", note: "요청한 block height와 저장된 receipt height가 다르면 error를 반환합니다." },
    ],
  },
  "replay-guards": {
    path: "consensus/replay.go · ReplayBlocksWithContext guards @ 0880b4d3",
    lang: "go",
    highlight: [1, 29],
    desc: `${excerpt} App·BlockStore·State 높이 조합이 허용 범위인지 먼저 검사합니다.`,
    code: `storeBlockBase := h.store.Base()
storeBlockHeight := h.store.Height()
stateBlockHeight := state.LastBlockHeight

switch {
case appBlockHeight == 0 && state.InitialHeight < storeBlockBase:
    return appHash, sm.ErrAppBlockHeightTooLow{
        AppHeight: appBlockHeight, StoreBase: storeBlockBase,
    }
case appBlockHeight > 0 && appBlockHeight < storeBlockBase-1:
    return appHash, sm.ErrAppBlockHeightTooLow{
        AppHeight: appBlockHeight, StoreBase: storeBlockBase,
    }
case storeBlockHeight < appBlockHeight:
    return appHash, sm.ErrAppBlockHeightTooHigh{
        CoreHeight: storeBlockHeight, AppHeight: appBlockHeight,
    }
case storeBlockHeight < stateBlockHeight:
    panic("StateBlockHeight > StoreBlockHeight")
case storeBlockHeight > stateBlockHeight+1:
    panic("StoreBlockHeight > StateBlockHeight + 1")
}`,
    annotations: [
      { lines: [1, 3], color: "sky", note: "세 height와 BlockStore의 보유 시작점을 별도로 읽습니다." },
      { lines: [6, 13], color: "amber", note: "Application이 필요한 block보다 오래 뒤졌는데 BlockStore가 prune됐다면 replay할 원본이 없어 error입니다." },
      { lines: [14, 17], color: "rose", note: "Application이 BlockStore보다 앞서는 상태를 자동 rollback하지 않습니다." },
      { lines: [18, 22], color: "violet", note: "CometBFT가 소유한 State와 BlockStore는 같거나 BlockStore가 정확히 한 칸 앞이어야 합니다." },
    ],
  },
  "replay-decision": {
    path: "consensus/replay.go · height decision @ 0880b4d3",
    lang: "go",
    highlight: [1, 49],
    desc: `${excerpt} 높이 조합에 따라 실제 application replay와 mock replay를 나눕니다.`,
    code: `switch storeBlockHeight {
case stateBlockHeight:
    if appBlockHeight < storeBlockHeight {
        return h.replayBlocks(ctx, state, proxyApp,
            appBlockHeight, storeBlockHeight, false)
    } else if appBlockHeight == storeBlockHeight {
        assertAppHashEqualsOneFromState(appHash, state)
        return appHash, nil
    }

case stateBlockHeight + 1:
    switch {
    case appBlockHeight < stateBlockHeight:
        return h.replayBlocks(ctx, state, proxyApp,
            appBlockHeight, storeBlockHeight, true)

    case appBlockHeight == stateBlockHeight:
        state, err = h.replayBlock(
            state, storeBlockHeight, proxyApp.Consensus(),
        )
        return state.AppHash, err

    case appBlockHeight == storeBlockHeight:
        response, err := h.stateStore.
            LoadLastFinalizeBlockResponse(storeBlockHeight)
        if err != nil { return nil, err }
        if len(response.AppHash) == 0 {
            response.AppHash = appHash
        }
        mockApp := newMockProxyApp(response)
        state, err = h.replayBlock(
            state, storeBlockHeight, mockApp,
        )
        return state.AppHash, err
    }
}`,
    annotations: [
      { lines: [2, 8], color: "sky", note: "BlockStore와 State가 같으면 application만 뒤졌거나 모두 같은 경우입니다." },
      { lines: [11, 20], color: "amber", note: "BlockStore가 한 칸 앞이고 application도 뒤졌으면 실제 application을 replay합니다." },
      { lines: [22, 34], color: "emerald", note: "Application이 이미 B까지 Commit했다면 저장된 응답으로 mock app을 만들어 State만 B로 올립니다." },
    ],
  },
  "state-sync-verify": {
    path: "statesync/syncer.go · node/setup.go @ 0880b4d3",
    lang: "go",
    highlight: [1, 42],
    desc: `${excerpt} Snapshot 적용 뒤 application height·AppHash·version을 trusted state와 비교하고 State를 bootstrap합니다.`,
    code: `appHash, err := s.stateProvider.AppHash(ctx, snapshot.Height)
if err != nil { return sm.State{}, nil, errRejectSnapshot }
snapshot.trustedAppHash = appHash

if err := s.offerSnapshot(snapshot); err != nil {
    return sm.State{}, nil, err
}
state, err := s.stateProvider.State(ctx, snapshot.Height)
if err != nil { return sm.State{}, nil, errRejectSnapshot }
commit, err := s.stateProvider.Commit(ctx, snapshot.Height)
if err != nil { return sm.State{}, nil, errRejectSnapshot }

if err := s.applyChunks(chunks); err != nil {
    return sm.State{}, nil, err
}
if err := s.verifyApp(snapshot, state.Version.Consensus.App); err != nil {
    return sm.State{}, nil, err
}

// verifyApp
resp, err := s.connQuery.Info(ctx, proxy.RequestInfo)
if err != nil { return err }
if resp.AppVersion != appVersion { return errVerifyFailed }
if !bytes.Equal(snapshot.trustedAppHash, resp.LastBlockAppHash) {
    return errVerifyFailed
}
if uint64(resp.LastBlockHeight) != snapshot.Height {
    return errVerifyFailed
}

// node/setup.go
state, commit, err := n.stateSyncReactor.Sync(provider, discoveryTime)
if err != nil { return }
if err := n.stateStore.Bootstrap(state); err != nil { return }
if err := n.blockStore.SaveSeenCommit(
    state.LastBlockHeight, commit,
); err != nil { return }`,
    annotations: [
      { lines: [1, 11], color: "sky", note: "Trusted AppHash와 light-client verified State·commit을 snapshot bytes와 별도로 얻습니다." },
      { lines: [13, 18], color: "amber", note: "Chunk 적용이 끝난 뒤 application이 실제로 만든 상태를 검증합니다." },
      { lines: [21, 29], color: "rose", note: "App version, AppHash, last block height 중 하나라도 다르면 state sync를 완료하지 않습니다." },
      { lines: [32, 38], color: "emerald", note: "검증을 통과한 State와 seen commit을 local stores에 설치한 뒤 block sync로 전진합니다." },
    ],
  },
};
