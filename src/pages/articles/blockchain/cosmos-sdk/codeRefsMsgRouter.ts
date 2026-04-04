import type { CodeRef } from '@/components/code/types';

export const msgRouterCodeRefs: Record<string, CodeRef> = {
  'msg-router-struct': {
    path: 'baseapp/msg_service_router.go',
    lang: 'go',
    highlight: [1, 22],
    desc: `MsgServiceRouter — Msg 타입 URL → 핸들러 매핑.
모듈이 RegisterService()로 핸들러를 등록하면 routes 맵에 저장.
💡 gRPC ServiceDesc 기반 — Protobuf 서비스 정의가 곧 메시지 라우팅 규칙.`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: 'MessageRouter 인터페이스 — Handler()로 핸들러 조회' },
      { lines: [5, 9], color: 'emerald', note: 'MsgServiceRouter 구조체 — routes 맵 + CircuitBreaker' },
      { lines: [11, 14], color: 'amber', note: 'Handler() — Msg의 typeURL로 routes에서 조회' },
      { lines: [16, 22], color: 'violet', note: 'RegisterService — gRPC ServiceDesc의 메서드를 순회하며 등록' },
    ],
    code: `type MessageRouter interface {
	Handler(msg sdk.Msg) MsgServiceHandler
	HandlerByTypeURL(typeURL string) MsgServiceHandler
}
type MsgServiceRouter struct {
	interfaceRegistry codectypes.InterfaceRegistry
	routes            map[string]MsgServiceHandler // typeURL → handler
	hybridHandlers    map[string]func(ctx context.Context, req, resp protoiface.MessageV1) error
	circuitBreaker    CircuitBreaker // 모듈 비활성화 가능
}
// Handler — Msg 타입 URL로 핸들러 조회
type MsgServiceHandler = func(ctx sdk.Context, req sdk.Msg) (*sdk.Result, error)
func (msr *MsgServiceRouter) Handler(msg sdk.Msg) MsgServiceHandler {
	return msr.routes[sdk.MsgTypeURL(msg)]
}
// RegisterService — 모듈 초기화 시 호출
func (msr *MsgServiceRouter) RegisterService(sd *grpc.ServiceDesc, handler any) {
	for _, method := range sd.Methods {
		msr.registerMsgServiceHandler(sd, method, handler)
		msr.registerHybridHandler(sd, method, handler)
	}
}`,
  },

  'runmsgs': {
    path: 'baseapp/baseapp.go',
    lang: 'go',
    highlight: [1, 24],
    desc: `runMsgs — 트랜잭션 내 메시지들을 순차 실행.
MsgServiceRouter.Handler(msg)로 핸들러를 찾아 호출.
💡 하나라도 실패하면 전체 TX 롤백 — CacheMultiStore 분기 덕분.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'Finalize/Simulate 모드에서만 실행' },
      { lines: [6, 10], color: 'emerald', note: 'MsgServiceRouter에서 핸들러 조회' },
      { lines: [12, 15], color: 'amber', note: '핸들러 실행 = 모듈의 MsgServer 메서드 호출' },
      { lines: [17, 24], color: 'violet', note: '이벤트 + 응답 수집 → sdk.Result 조립' },
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
		// MsgServiceRouter에서 핸들러 조회
		handler := app.msgServiceRouter.Handler(msg)
		if handler == nil {
			return nil, errorsmod.Wrapf(sdkerrors.ErrUnknownRequest,
				"no message handler found for %T", msg)
		}
		// 핸들러 실행 → 모듈 MsgServer 메서드
		msgResult, err := handler(ctx, msg)
		if err != nil { return nil, err }
		// 이벤트 + 응답 수집
		msgEvents, _ := createEvents(app.cdc, msgResult.GetEvents(), msg, msgsV2[i])
		events = events.AppendEvents(msgEvents)
		msgResponses = append(msgResponses, msgResult.MsgResponses[0])
	}
	return &sdk.Result{Events: events.ToABCIEvents(), MsgResponses: msgResponses}, nil
}`,
  },
};
