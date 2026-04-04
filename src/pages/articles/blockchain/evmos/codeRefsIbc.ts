import type { CodeRef } from '@/components/code/types';

export const ibcRefs: Record<string, CodeRef> = {
  'ev-erc20-middleware': {
    path: 'cosmos-evm/x/erc20/ibc_middleware.go',
    lang: 'go',
    highlight: [1, 20],
    desc: 'ERC20 IBC 미들웨어 — 토큰 수신 시 자동 ERC20 변환.',
    code: `// x/erc20/ibc_middleware.go — IBC ERC20 미들웨어

type IBCMiddleware struct {
    app    porttypes.IBCModule
    keeper keeper.Keeper
}

func (im IBCMiddleware) OnRecvPacket(
    ctx sdk.Context, packet channeltypes.Packet,
    relayer sdk.AccAddress,
) ibcexported.Acknowledgement {
    tokenPair, found := im.keeper.GetTokenPair(ctx, data.Denom)
    if found && tokenPair.Enabled {
        im.keeper.ConvertCoinToERC20(ctx, data)
    }
    return im.app.OnRecvPacket(ctx, packet, relayer)
}`,
    annotations: [
      { lines: [3, 6], color: 'sky', note: 'IBCMiddleware 구조체' },
      { lines: [8, 16], color: 'emerald', note: 'OnRecvPacket — 자동 변환' },
    ],
  },

  'ev-token-pair': {
    path: 'cosmos-evm/x/erc20/types/token_pair.go',
    lang: 'go',
    highlight: [1, 18],
    desc: 'TokenPair — Cosmos Coin ↔ ERC20 양방향 매핑.',
    code: `// x/erc20/types/token_pair.go — 토큰 페어

type TokenPair struct {
    Erc20Address  string  // ERC20 컨트랙트 주소
    Denom         string  // Cosmos denomination
    Enabled       bool    // 변환 활성화 여부
    ContractOwner Owner   // 소유자
}

// Coin → ERC20: 에스크로 → 잠금 → 민팅
// ERC20 → Coin: 전송 → burn → 해제`,
    annotations: [
      { lines: [3, 8], color: 'sky', note: 'TokenPair 구조체' },
      { lines: [10, 11], color: 'emerald', note: '양방향 변환 흐름' },
    ],
  },
};
