import type { CodeRef } from './codeRefsTypes';

export const runMsgsCodeRefs: Record<string, CodeRef> = {
  'abci-runmsgs': {
    path: 'baseapp/baseapp.go',
    lang: 'go',
    highlight: [1, 32],
    desc: `runMsgs는 트랜잭션 내 메시지들을 순차 실행합니다.
MsgServiceRouter로 각 Msg 타입에 맞는 핸들러를 찾아 호출하고,
결과 이벤트와 응답을 수집합니다.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: '함수 시그니처 — Context, Msgs, 실행모드를 받음' },
      { lines: [6, 12], color: 'emerald', note: '메시지 순회 — Finalize/Simulate 모드에서만 실행' },
      { lines: [14, 18], color: 'amber', note: 'MsgServiceRouter에서 핸들러 조회 → 모듈 MsgServer 호출' },
      { lines: [20, 32], color: 'violet', note: '이벤트 수집 + 응답 직렬화 → sdk.Result 조립' },
    ],
    code: `func (app *BaseApp) runMsgs(
	ctx sdk.Context, msgs []sdk.Msg,
	msgsV2 []protov2.Message, mode sdk.ExecMode,
) (*sdk.Result, error) {
	events := sdk.EmptyEvents()
	msgResponses := make([]*codectypes.Any, 0, len(msgs))

	for i, msg := range msgs {
		if mode != execModeFinalize && mode != execModeSimulate {
			break
		}
		ctx = ctx.WithMsgIndex(i)

		// MsgServiceRouter에서 핸들러 조회
		handler := app.msgServiceRouter.Handler(msg)
		if handler == nil {
			return nil, errorsmod.Wrapf(
				sdkerrors.ErrUnknownRequest,
				"no message handler found for %T", msg,
			)
		}

		// 핸들러 실행 (모듈의 MsgServer 메서드)
		msgResult, err := handler(ctx, msg)
		if err != nil {
			return nil, errorsmod.Wrapf(err,
				"failed to execute message; index: %d", i,
			)
		}

		// 이벤트 수집 + 응답 추가
		msgEvents, _ := createEvents(
			app.cdc, msgResult.GetEvents(), msg, msgsV2[i],
		)
		events = events.AppendEvents(msgEvents)
		if len(msgResult.MsgResponses) > 0 {
			msgResponses = append(
				msgResponses, msgResult.MsgResponses[0],
			)
		}
	}

	data, _ := makeABCIData(msgResponses)
	return &sdk.Result{
		Data: data, Events: events.ToABCIEvents(),
		MsgResponses: msgResponses,
	}, nil
}`,
  },
};
