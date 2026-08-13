import type { CodeRef } from "@/components/code/types";

export const moduleCodeRefs: Record<string, CodeRef> = {
  "appmodule-interface": {
    path: "types/module/module.go",
    lang: "go",
    highlight: [1, 26],
    desc: `AppModule 인터페이스 — 모든 Cosmos SDK 모듈이 구현해야 하는 표준.
AppModuleBasic(이름, 코덱 등록) + appmodule.AppModule(라이프사이클).
💡 HasServices, HasABCIEndBlock 등 선택적 인터페이스로 기능 조합.`,
    annotations: [
      {
        lines: [1, 5],
        color: "sky",
        note: "AppModuleBasic — 이름, 코덱, gRPC 게이트웨이 등록",
      },
      {
        lines: [7, 10],
        color: "emerald",
        note: "AppModule — AppModuleBasic 임베딩",
      },
      {
        lines: [12, 16],
        color: "amber",
        note: "HasServices — 모듈이 MsgServer/QueryServer 등록",
      },
      {
        lines: [18, 26],
        color: "violet",
        note: "HasABCIEndBlock — 블록 끝에 실행할 로직 (검증자 업데이트 등)",
      },
    ],
    code: `// AppModuleBasic — 모듈의 기본 정보 + 코덱 등록
type AppModuleBasic interface {
	HasName // Name() string
	RegisterLegacyAminoCodec(*codec.LegacyAmino)
	RegisterInterfaces(types.InterfaceRegistry)
	RegisterGRPCGatewayRoutes(client.Context, *runtime.ServeMux)
}
// AppModule — 모듈의 전체 인터페이스
type AppModule interface {
	appmodule.AppModule // IsAppModule(), IsOnePerModuleType()
	AppModuleBasic
}
// HasServices — MsgServer + QueryServer 등록
type HasServices interface {
	RegisterServices(Configurator) // MsgServer, QueryServer를 라우터에 등록
}
// HasConsensusVersion — 상태 마이그레이션 버전
type HasConsensusVersion interface {
	ConsensusVersion() uint64
}
// HasABCIEndBlock — 블록 끝에 실행할 로직 (선택적)
type HasABCIEndBlock interface {
	AppModule
	EndBlock(context.Context) ([]abci.ValidatorUpdate, error)
}
// HasABCIGenesis — 제네시스 초기화/내보내기
type HasABCIGenesis interface {
	InitGenesis(ctx sdk.Context, cdc codec.JSONCodec, data json.RawMessage)
	ExportGenesis(ctx sdk.Context, cdc codec.JSONCodec) json.RawMessage
}`,
  },

  "bank-send": {
    path: "x/bank/keeper/msg_server.go",
    lang: "go",
    highlight: [1, 22],
    desc: `Bank MsgServer.Send() — MsgSend 메시지 처리.
주소 디코딩 → 전송 가능 여부 확인 → SendCoins 호출.
💡 msgServer가 Keeper를 임베딩 — MsgServer = Keeper의 ABCI 진입점.`,
    annotations: [
      {
        lines: [1, 3],
        color: "sky",
        note: "msgServer — Keeper 임베딩으로 상태 접근",
      },
      { lines: [5, 8], color: "emerald", note: "주소 디코딩 (bech32 → bytes)" },
      {
        lines: [10, 14],
        color: "amber",
        note: "전송 가능 여부 + 블랙리스트 확인",
      },
      {
        lines: [16, 22],
        color: "violet",
        note: "SendCoins 호출 → 원자적 잔액 이동",
      },
    ],
    code: `type msgServer struct { Keeper }
func NewMsgServerImpl(keeper Keeper) types.MsgServer {
	return &msgServer{Keeper: keeper}
}
func (k msgServer) Send(
	goCtx context.Context, msg *types.MsgSend,
) (*types.MsgSendResponse, error) {
	base := k.Keeper.(BaseKeeper)
	from, _ := base.ak.AddressCodec().StringToBytes(msg.FromAddress)
	to, _ := base.ak.AddressCodec().StringToBytes(msg.ToAddress)
	// 전송 가능 여부 확인
	ctx := sdk.UnwrapSDKContext(goCtx)
	if err := k.IsSendEnabledCoins(ctx, msg.Amount...); err != nil {
		return nil, err
	}
	// 블랙리스트(모듈 계정) 확인
	if k.BlockedAddr(to) {
		return nil, errorsmod.Wrapf(sdkerrors.ErrUnauthorized, "blocked")
	}
	// 실제 전송 실행
	err := k.SendCoins(ctx, from, to, msg.Amount)
	if err != nil { return nil, err }
	return &types.MsgSendResponse{}, nil
}`,
  },
};
