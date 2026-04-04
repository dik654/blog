import type { CodeRef } from './codeRefsTypes';

export const bankCodeRefs: Record<string, CodeRef> = {
  'bank-keeper': {
    path: 'x/bank/keeper/keeper.go',
    lang: 'go',
    highlight: [1, 24],
    desc: `Bank 모듈의 Keeper 인터페이스와 BaseKeeper 구조체입니다.
코인 전송, 발행, 소각 기능을 정의하고 의존성을 주입받아 구현합니다.`,
    annotations: [
      { lines: [1, 7], color: 'sky', note: 'Keeper 인터페이스 — SendKeeper 임베딩 + Mint/Burn' },
      { lines: [10, 16], color: 'emerald', note: 'BaseKeeper — AccountKeeper, 코덱, 스토어 주입' },
      { lines: [18, 24], color: 'amber', note: 'NewBaseKeeper — 의존성 주입 생성자' },
    ],
    code: `type Keeper interface {
	SendKeeper
	InitGenesis(context.Context, *types.GenesisState)
	ExportGenesis(context.Context) *types.GenesisState
	GetSupply(ctx context.Context, denom string) sdk.Coin
	MintCoins(ctx context.Context, moduleName string, amt sdk.Coins) error
	BurnCoins(ctx context.Context, moduleName string, amt sdk.Coins) error
}

// BaseKeeper manages transfers between accounts
type BaseKeeper struct {
	BaseSendKeeper
	ak                     types.AccountKeeper
	cdc                    codec.BinaryCodec
	storeService           store.KVStoreService
	mintCoinsRestrictionFn types.MintingRestrictionFn
}

func NewBaseKeeper(
	cdc codec.BinaryCodec, storeService store.KVStoreService,
	ak types.AccountKeeper, blockedAddrs map[string]bool,
	authority string, logger log.Logger,
) BaseKeeper {
	return BaseKeeper{
		BaseSendKeeper: NewBaseSendKeeper(
			cdc, storeService, ak, blockedAddrs, authority, logger,
		),
		ak: ak, cdc: cdc, storeService: storeService,
	}
}`,
  },

  'bank-sendcoins': {
    path: 'x/bank/keeper/send.go',
    lang: 'go',
    highlight: [1, 18],
    desc: `SendCoins는 계정 간 코인 전송의 핵심 로직입니다.
유효성 검사 → SendRestriction → 잔액 차감 → 잔액 추가 → 이벤트 발생.`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: '유효성 검사 — 코인 금액 확인' },
      { lines: [6, 8], color: 'emerald', note: 'SendRestriction 적용' },
      { lines: [10, 13], color: 'amber', note: 'sub → add — 원자적 잔액 이동' },
      { lines: [15, 16], color: 'violet', note: '계정 자동 생성 + 이벤트 발생' },
    ],
    code: `func (k BaseSendKeeper) SendCoins(
	ctx context.Context, fromAddr, toAddr sdk.AccAddress,
	amt sdk.Coins,
) error {
	if !amt.IsValid() {
		return errorsmod.Wrap(sdkerrors.ErrInvalidCoins, amt.String())
	}
	toAddr, err = k.sendRestriction.apply(
		ctx, fromAddr, toAddr, amt,
	)
	if err != nil { return err }
	err = k.subUnlockedCoins(ctx, fromAddr, amt)
	if err != nil { return err }
	err = k.addCoins(ctx, toAddr, amt)
	if err != nil { return err }
	k.ensureAccountCreated(ctx, toAddr)
	return k.emitSendCoinsEvents(ctx, fromAddr, toAddr, amt)
}`,
  },
};
