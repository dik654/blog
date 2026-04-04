import type { CodeRef } from '@/components/code/types';

export const proposalCodeRefs: Record<string, CodeRef> = {
  'prepare-proposal': {
    path: 'baseapp/abci.go',
    lang: 'go',
    highlight: [1, 24],
    desc: `PrepareProposal — 블록 제안자가 TX를 선택/정렬하는 ABCI 2.0 메서드.
앱이 직접 블록 내용을 결정 — MEV 방지 로직 삽입 가능.
💡 OE를 먼저 Abort — 이전 라운드의 투기적 실행과 메모리 구조 충돌 방지.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'OE Abort — 이전 라운드의 투기적 실행 중단' },
      { lines: [6, 10], color: 'emerald', note: '상태 리셋 + 헤더 구성 — 라운드 반복 호출 대비' },
      { lines: [12, 17], color: 'amber', note: 'PrepareProposal 컨텍스트 — VoteInfo, GasMeter 설정' },
      { lines: [19, 24], color: 'violet', note: '앱의 PrepareProposalHandler 호출 → TX 선택/정렬' },
    ],
    code: `func (app *BaseApp) PrepareProposal(
	req *abci.RequestPrepareProposal,
) (resp *abci.ResponsePrepareProposal, err error) {
	// OE 중단 — PrepareProposal과 메모리 충돌 방지
	app.optimisticExec.Abort()
	// 상태 리셋 (라운드 재호출 대비)
	header := cmtproto.Header{
		ChainID: app.chainID,
		Height:  req.Height, Time: req.Time,
		ProposerAddress: req.ProposerAddress,
	}
	app.stateManager.SetState(
		execModePrepareProposal, app.cms, header, app.logger, app.streamingManager,
	)
	// 컨텍스트 구성
	state := app.stateManager.GetState(execModePrepareProposal)
	state.SetContext(state.Context().
		WithBlockHeight(req.Height).
		WithExecMode(sdk.ExecModePrepareProposal).
		WithBlockGasMeter(app.getBlockGasMeter(state.Context())))
	// 앱이 TX 선택/정렬 — 커스텀 로직 가능
	resp, err = app.abciHandlers.PrepareProposalHandler(
		state.Context(), req,
	)
	return resp, err
}`,
  },

  'commit': {
    path: 'baseapp/abci.go',
    lang: 'go',
    highlight: [1, 24],
    desc: `Commit — 블록 실행 결과를 영구 저장.
Precommiter 콜백 → cms.Commit() → CheckTx 상태 리셋 → 스냅샷.
💡 Commit 후 ClearState(execModeFinalize) — 다음 블록까지 finalize 상태 없음.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'finalizeState에서 컨텍스트 + 헤더 추출' },
      { lines: [6, 9], color: 'emerald', note: 'Precommiter 콜백 + 커밋 헤더 설정' },
      { lines: [11, 14], color: 'amber', note: 'cms.Commit() — 모든 IAVL 트리 영구 저장' },
      { lines: [16, 20], color: 'violet', note: '상태 리셋: CheckTx 갱신, Finalize 클리어' },
      { lines: [22, 24], color: 'rose', note: '스냅샷 + 블록 카운터' },
    ],
    code: `func (app *BaseApp) Commit() (*abci.ResponseCommit, error) {
	finalizeState := app.stateManager.GetState(execModeFinalize)
	ctx := finalizeState.Context()
	header := ctx.BlockHeader()
	retainHeight := app.GetBlockRetentionHeight(header.Height)
	// Precommiter 콜백 (모듈별 사전 커밋 로직)
	if app.abciHandlers.Precommiter != nil {
		app.abciHandlers.Precommiter(finalizeState.Context())
	}
	rms, _ := app.cms.(*rootmulti.Store)
	rms.SetCommitHeader(header)
	// 💡 핵심: 모든 IAVL 트리 영구 저장
	app.cms.Commit() // → rootmulti.Store.Commit()
	resp := &abci.ResponseCommit{RetainHeight: retainHeight}
	// CheckTx 상태를 최신 커밋으로 리셋
	app.stateManager.SetState(
		execModeCheck, app.cms, header, app.logger, app.streamingManager,
	)
	app.stateManager.ClearState(execModeFinalize) // finalize 상태 제거
	if app.abciHandlers.PrepareCheckStater != nil {
		app.abciHandlers.PrepareCheckStater(
			app.stateManager.GetState(execModeCheck).Context())
	}
	app.snapshotManager.SnapshotIfApplicable(header.Height)
	return resp, nil
}`,
  },
};
