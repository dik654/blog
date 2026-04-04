import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  { label: 'Msg 라우팅 전체 흐름', body: 'TX의 Msg가 Router → MsgServer → Keeper → KVStore로 전달됩니다.' },
  { label: '① MsgServiceRouter.Handler(msg)', body: 'typeURL로 routes 맵을 조회해 대상 MsgServer를 찾습니다.' },
  { label: '② MsgServer.Send(ctx, msg)', body: 'Keeper를 임베딩한 MsgServer가 주소 디코딩 후 SendCoins를 호출합니다.' },
  { label: '③ Keeper.SendCoins()', body: '잔액 차감 → 추가 → 계정 생성 → 이벤트 발행으로 KVStore에 쓰기합니다.' },
];

export const STEP_REFS = ['msg-router-struct', 'msg-router-struct', 'bank-send', 'bank-sendcoins'];
export const STEP_LABELS = ['msg_service_router.go — MsgServiceRouter', 'msg_service_router.go — Handler()', 'msg_server.go — Send()', 'send.go — SendCoins()'];

export const LAYERS = [
  { label: 'MsgServiceRouter', sub: 'routes[typeURL]', color: '#6366f1', y: 10, codeKey: 'msg-router-struct' },
  { label: 'Bank MsgServer', sub: 'Send(ctx, msg)', color: '#8b5cf6', y: 55, codeKey: 'bank-send' },
  { label: 'BaseSendKeeper', sub: 'SendCoins()', color: '#10b981', y: 100, codeKey: 'bank-sendcoins' },
  { label: 'KVStore (IAVL)', sub: '잔액 읽기/쓰기', color: '#f59e0b', y: 145, codeKey: 'rootmulti-struct' },
];
