import type { CodeRef } from '@/components/code/types';

export const runTxCodeRefs: Record<string, CodeRef> = {
  'runtx': {
    path: 'baseapp/baseapp.go',
    lang: 'go',
    highlight: [1, 28],
    desc: `RunTx — 트랜잭션 실행 파이프라인의 핵심.
AnteHandler → cacheTxContext → runMsgs → PostHandler → msCache.Write() 순서.
CacheMultiStore 분기를 통해 실패 시 롤백이 가능한 원자적 실행 보장.`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: 'context 생성 + tracing span 시작' },
      { lines: [6, 9], color: 'emerald', note: 'AnteHandler — 캐시 분기 후 실행, 실패 시 자동 롤백' },
      { lines: [12, 14], color: 'amber', note: 'runMsgs — 메시지별 핸들러 실행' },
      { lines: [16, 19], color: 'violet', note: 'PostHandler — 실행 성공/실패 무관하게 항상 호출' },
      { lines: [22, 28], color: 'rose', note: 'Finalize 모드 성공 시에만 캐시를 원본에 Write' },
    ],
    code: `func (app *BaseApp) RunTx(
	mode sdk.ExecMode, txBytes []byte, tx sdk.Tx,
	txIndex int, txMultiStore storetypes.MultiStore,
	incarnationCache map[string]any,
) (gInfo sdk.GasInfo, result *sdk.Result, anteEvents []abci.Event, err error) {
	ctx := app.getContextForTx(mode, txBytes, txIndex)
	// ① AnteHandler — 캐시 분기 후 서명/fee 검증
	anteCtx, msCache := app.cacheTxContext(ctx)
	newCtx, err := app.anteHandler(anteCtx, tx, mode == execModeSimulate)
	if err != nil { return gInfo, nil, nil, err }
	msCache.Write() // AnteHandler 성공 → 원본에 반영
	// ② runMsgs — 다시 캐시 분기 (2중 분기)
	runMsgCtx, msCache := app.cacheTxContext(ctx)
	msgsV2, _ := tx.GetMsgsV2()
	result, err = app.runMsgs(runMsgCtx, msgs, msgsV2, mode)
	// ③ PostHandler — tip 정산 등 (실행 결과 무관)
	if app.postHandler != nil {
		postCtx := runMsgCtx.WithEventManager(sdk.NewEventManager())
		newCtx, errPost := app.postHandler(postCtx, tx, mode == execModeSimulate, err == nil)
		result.Events = append(result.Events, newCtx.EventManager().ABCIEvents()...)
	}
	// ④ 성공 시에만 캐시 → 원본 커밋
	if err == nil && mode == execModeFinalize {
		consumeBlockGas()
		msCache.Write()
	}
	return gInfo, result, anteEvents, err
}`,
  },
};
