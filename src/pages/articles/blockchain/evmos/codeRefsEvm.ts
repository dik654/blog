import type { CodeRef } from '@/components/code/types';

export const evmRefs: Record<string, CodeRef> = {
  'ev-keeper': {
    path: 'cosmos-evm/x/vm/keeper/keeper.go',
    lang: 'go',
    highlight: [1, 18],
    desc: 'EVM Keeper — Cosmos SDK 체인에서 이더리움 가상머신 실행.',
    code: `// x/vm/keeper/keeper.go — EVM Keeper

type Keeper struct {
    cdc             codec.BinaryCodec
    storeKey        storetypes.StoreKey
    accountKeeper   types.AccountKeeper
    bankKeeper      types.BankKeeper
    feeMarketKeeper types.FeeMarketKeeper
}

func (k Keeper) ApplyMessage(ctx sdk.Context, msg core.Message) (*types.MsgEthereumTxResponse, error) {
    stateDB := k.newStateDB(ctx)
    evm := k.newEVM(ctx, msg, stateDB)
    result, err := evm.ApplyMessage(msg)
    stateDB.Commit()
    return result, err
}`,
    annotations: [
      { lines: [3, 8], color: 'sky', note: 'Keeper 구조체' },
      { lines: [11, 16], color: 'emerald', note: 'ApplyMessage — EVM 실행' },
    ],
  },

  'ev-feemarket': {
    path: 'cosmos-evm/x/feemarket/keeper/keeper.go',
    lang: 'go',
    highlight: [1, 16],
    desc: 'Fee Market — EIP-1559 동적 수수료. Base Fee 조정.',
    code: `// x/feemarket/keeper/keeper.go — EIP-1559

func (k Keeper) UpdateBaseFee(
    ctx sdk.Context,
    blockGasUsed, blockGasLimit uint64,
) sdk.Dec {
    baseFee := k.GetBaseFee(ctx)
    target := blockGasLimit / 2

    if blockGasUsed > target {
        delta := baseFee.Mul(adjustmentFactor)
        baseFee = baseFee.Add(delta)
    } else {
        delta := baseFee.Mul(adjustmentFactor)
        baseFee = baseFee.Sub(delta)
    }
    k.SetBaseFee(ctx, baseFee)
    return baseFee
}`,
    annotations: [
      { lines: [3, 8], color: 'sky', note: '목표 50% 사용률' },
      { lines: [10, 12], color: 'emerald', note: '과부하: Fee 상승' },
      { lines: [13, 15], color: 'amber', note: '여유: Fee 하락' },
    ],
  },
};
