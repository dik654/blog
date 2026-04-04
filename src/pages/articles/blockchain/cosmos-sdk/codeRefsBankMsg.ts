import type { CodeRef } from './codeRefsTypes';

export const bankMsgCodeRefs: Record<string, CodeRef> = {
  'bank-mintcoins': {
    path: 'x/bank/keeper/keeper.go',
    lang: 'go',
    highlight: [1, 22],
    desc: `MintCoins는 모듈 계정에 코인을 발행합니다.
Minter 퍼미션 검증 후 잔액 추가 + Supply 갱신합니다.`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: '발행 제한 규칙 확인' },
      { lines: [5, 9], color: 'emerald', note: '모듈 계정 + Minter 퍼미션 검증' },
      { lines: [11, 13], color: 'amber', note: 'addCoins — 잔액 추가' },
      { lines: [15, 22], color: 'violet', note: 'Supply 갱신 + 이벤트 발생' },
    ],
    code: `func (k BaseKeeper) MintCoins(
	ctx context.Context, moduleName string, amounts sdk.Coins,
) error {
	if err := k.mintCoinsRestrictionFn(ctx, amounts); err != nil {
		return err
	}
	acc := k.ak.GetModuleAccount(ctx, moduleName)
	if acc == nil { panic("module account does not exist") }
	if !acc.HasPermission(authtypes.Minter) {
		panic("no mint permission")
	}
	if err := k.addCoins(ctx, acc.GetAddress(), amounts); err != nil {
		return err
	}
	for _, amount := range amounts {
		supply := k.GetSupply(ctx, amount.GetDenom())
		supply = supply.Add(amount)
		k.setSupply(ctx, supply)
	}
	sdkCtx := sdk.UnwrapSDKContext(ctx)
	sdkCtx.EventManager().EmitEvent(
		types.NewCoinMintEvent(acc.GetAddress(), amounts),
	)
	return nil
}`,
  },

  'bank-msgserver': {
    path: 'x/bank/keeper/msg_server.go',
    lang: 'go',
    highlight: [1, 22],
    desc: `Bank MsgServer — MsgSend 처리.
주소 검증 → 전송 활성화 확인 → SendCoins 호출.`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: 'msgServer — Keeper 임베딩' },
      { lines: [5, 10], color: 'emerald', note: '주소 디코딩 (bech32 → bytes)' },
      { lines: [12, 15], color: 'amber', note: '전송 가능 여부 + 블랙리스트 확인' },
      { lines: [17, 22], color: 'violet', note: 'SendCoins 호출 → 응답 반환' },
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

	ctx := sdk.UnwrapSDKContext(goCtx)
	if err := k.IsSendEnabledCoins(ctx, msg.Amount...); err != nil {
		return nil, err
	}
	if k.BlockedAddr(to) {
		return nil, errorsmod.Wrapf(
			sdkerrors.ErrUnauthorized, "blocked address",
		)
	}
	err := k.SendCoins(ctx, from, to, msg.Amount)
	if err != nil { return nil, err }
	return &types.MsgSendResponse{}, nil
}`,
  },
};
