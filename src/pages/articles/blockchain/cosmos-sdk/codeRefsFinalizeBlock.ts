import type { CodeRef } from '@/components/code/types';

export const finalizeBlockCodeRefs: Record<string, CodeRef> = {
  'abci-finalizeblock': {
    path: 'baseapp/abci.go',
    lang: 'go',
    highlight: [1, 24],
    desc: `FinalizeBlock — CometBFT가 블록 합의 후 호출하는 ABCI 진입점.
Optimistic Execution이 활성화되면 미리 실행한 결과를 재사용.
💡 OE 해시 불일치 시 상태를 리셋하고 재실행 — 투기적 실행의 롤백 비용.`,
    annotations: [
      { lines: [1, 5], color: 'sky', note: 'ABCI 리스너 — 블록 결과를 외부 서비스로 스트리밍' },
      { lines: [7, 12], color: 'emerald', note: 'OE 해시 검증: 일치 → 결과 재사용, workingHash 반환' },
      { lines: [14, 17], color: 'amber', note: 'OE 불일치 → 상태 리셋 + 재실행' },
      { lines: [19, 24], color: 'violet', note: 'internalFinalizeBlock → workingHash 계산' },
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
		if !aborted { // 해시 일치 → OE 결과 재사용
			res.AppHash = app.workingHash()
			return res, err
		}
		// 해시 불일치 → 상태 리셋 + 재실행
		app.stateManager.ClearState(execModeFinalize)
		app.optimisticExec.Reset()
	}
	// OE 미사용 or 불일치 → 블록 직접 실행
	res, err = app.internalFinalizeBlock(
		context.Background(), req,
	)
	if res != nil { res.AppHash = app.workingHash() }
	return res, err
}`,
  },

  'internal-finalizeblock': {
    path: 'baseapp/abci.go',
    lang: 'go',
    highlight: [1, 26],
    desc: `internalFinalizeBlock — 실제 블록 실행 로직.
preBlock → beginBlock → executeTxs → endBlock 순서.
💡 블록 내 모든 TX를 txRunner로 실행 — 병렬 실행 확장 가능한 구조.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'halt 체크 + 높이 검증' },
      { lines: [6, 9], color: 'emerald', note: 'finalizeState 초기화 — 없으면 새로 생성 (블록 리플레이)' },
      { lines: [11, 15], color: 'amber', note: 'preBlock + beginBlock — 모듈 사전 처리' },
      { lines: [17, 22], color: 'violet', note: 'executeTxsWithExecutor → deliverTx → RunTx' },
      { lines: [24, 26], color: 'rose', note: 'endBlock + 결과 조립 → ResponseFinalizeBlock' },
    ],
    code: `func (app *BaseApp) internalFinalizeBlock(
	goCtx context.Context, req *abci.RequestFinalizeBlock,
) (*abci.ResponseFinalizeBlock, error) {
	if err := app.checkHalt(req.Height, req.Time); err != nil {
		return nil, err
	}
	// finalizeState — 블록 리플레이 시 새로 생성
	finalizeState := app.stateManager.GetState(execModeFinalize)
	if finalizeState == nil {
		app.stateManager.SetState(execModeFinalize, app.cms, header, ...)
		finalizeState = app.stateManager.GetState(execModeFinalize)
	}
	// ① preBlock + beginBlock
	preblockEvents, _ := app.preBlock(req)
	beginBlock, _ := app.beginBlock(req)
	events = append(events, beginBlock.Events...)
	// ② 모든 TX 실행
	txResults, err := app.executeTxsWithExecutor(
		ctx, finalizeState.MultiStore, req.Txs,
	) // → deliverTx → RunTx 호출
	// ③ endBlock + 결과 반환
	endBlock, _ := app.endBlock()
	return &abci.ResponseFinalizeBlock{
		TxResults: txResults,
		ValidatorUpdates: endBlock.ValidatorUpdates,
	}, nil
}`,
  },
};
