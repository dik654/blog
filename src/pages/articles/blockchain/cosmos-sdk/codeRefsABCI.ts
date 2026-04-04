import type { CodeRef } from './codeRefsTypes';

export const abciCodeRefs: Record<string, CodeRef> = {
  'abci-initchain': {
    path: 'baseapp/abci.go',
    lang: 'go',
    highlight: [1, 26],
    desc: `InitChain은 체인 최초 블록 생성 시 호출됩니다.
체인 ID 검증 → 초기 높이 설정 → InitChainer로 제네시스 초기화합니다.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'ChainID 검증 — 불일치 시 에러' },
      { lines: [6, 10], color: 'emerald', note: '초기 높이 설정 — 0이면 1로 보정' },
      { lines: [12, 17], color: 'amber', note: '상태 초기화 + 컨센서스 파라미터 저장' },
      { lines: [19, 26], color: 'violet', note: 'InitChainer 실행 — 모듈별 InitGenesis 호출' },
    ],
    code: `func (app *BaseApp) InitChain(
	req *abci.RequestInitChain,
) (*abci.ResponseInitChain, error) {
	if req.ChainId != app.chainID {
		return nil, fmt.Errorf("invalid chain-id")
	}
	initHeader := cmtproto.Header{
		ChainID: req.ChainId, Time: req.Time,
	}
	app.initialHeight = req.InitialHeight
	if app.initialHeight == 0 { app.initialHeight = 1 }

	app.stateManager.SetState(
		execModeFinalize, app.cms, initHeader,
		app.logger, app.streamingManager,
	)
	finalizeState := app.stateManager.GetState(execModeFinalize)
	app.StoreConsensusParams(finalizeState.Context(), ...)

	finalizeState.SetContext(
		finalizeState.Context().WithBlockGasMeter(
			storetypes.NewInfiniteGasMeter(),
		),
	)
	res, err := app.abciHandlers.InitChainer(
		finalizeState.Context(), req,
	)
	return &abci.ResponseInitChain{
		AppHash: app.LastCommitID().Hash,
	}, err
}`,
  },

  'abci-finalize': {
    path: 'baseapp/abci.go',
    lang: 'go',
    highlight: [1, 22],
    desc: `FinalizeBlock은 블록 내 모든 트랜잭션을 실행합니다.
Optimistic Execution이 활성화되면 미리 실행한 결과를 재사용합니다.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'ABCI 리스너 — 블록 결과 스트리밍' },
      { lines: [6, 11], color: 'emerald', note: 'OE 해시 검증 → 미리 실행한 결과 재사용' },
      { lines: [13, 16], color: 'amber', note: 'OE 실패 시 상태 리셋 + 재실행' },
      { lines: [18, 22], color: 'violet', note: 'internalFinalizeBlock → workingHash' },
    ],
    code: `func (app *BaseApp) FinalizeBlock(
	req *abci.RequestFinalizeBlock,
) (res *abci.ResponseFinalizeBlock, err error) {
	defer func() {
		for _, l := range app.streamingManager.ABCIListeners {
			l.ListenFinalizeBlock(/*...*/)
		}
	}()
	if app.optimisticExec.Initialized() {
		aborted := app.optimisticExec.AbortIfNeeded(req.Hash)
		res, err = app.optimisticExec.WaitResult()
		if !aborted {
			res.AppHash = app.workingHash()
			return res, err
		}
		app.stateManager.ClearState(execModeFinalize)
		app.optimisticExec.Reset()
	}
	res, err = app.internalFinalizeBlock(
		context.Background(), req,
	)
	if res != nil { res.AppHash = app.workingHash() }
	return res, err
}`,
  },
};
