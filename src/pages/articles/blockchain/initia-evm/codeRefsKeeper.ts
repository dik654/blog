import type { CodeRef } from '@/components/code/types';

export const keeperRefs: Record<string, CodeRef> = {
  'mini-keeper': {
    path: 'minievm/x/evm/keeper/keeper.go',
    lang: 'go',

    highlight: [1, 30],
    desc: 'EVM Keeper — Cosmos 모듈과 EVM을 연결하는 핵심 구조체.',
    code: `// x/evm/keeper/keeper.go — Keeper 구조체 정의
type Keeper struct {
    ac           address.Codec
    cdc          codec.Codec
    storeService corestoretypes.KVStoreService

    accountKeeper       types.AccountKeeper   // Cosmos x/auth 계정
    bankKeeper          types.BankKeeper      // Cosmos x/bank 잔액
    communityPoolKeeper types.CommunityPoolKeeper
    ibcHookKeeper       types.IBCHookKeeper   // IBC 훅 처리
    gasPriceKeeper      types.GasPriceKeeper
    erc20Keeper         types.IERC20Keeper    // ERC20↔denom 매핑
    erc20StoresKeeper   types.IERC20StoresKeeper
    erc721Keeper        types.IERC721Keeper
    txUtils             types.TxUtils

    // grpc routers — Cosmos 메시지 라우팅
    msgRouter  baseapp.MessageRouter
    grpcRouter types.GRPCRouter

    config    evmconfig.EVMConfig
    authority string  // x/gov 모듈 주소

    Schema  collections.Schema
    Params  collections.Item[types.Params]
    VMStore collections.Map[[]byte, []byte]  // EVM 상태 저장소

    ERC20FactoryAddr  collections.Item[[]byte]
    ERC20WrapperAddr  collections.Item[[]byte]
    EVMBlockHashes    collections.Map[uint64, []byte]
}`,
    annotations: [
      { lines: [2, 6], color: 'sky' as const, note: 'Cosmos SDK 코덱과 스토어 서비스' },
      { lines: [8, 15], color: 'emerald' as const, note: '다른 Cosmos 모듈 keeper 참조 — IBC, 은행, 계정' },
      { lines: [18, 19], color: 'amber' as const, note: 'Cosmos 메시지 라우터 — 프리컴파일에서 Cosmos msg 실행용' },
      { lines: [25, 27], color: 'rose' as const, note: 'VMStore — EVM 계정·스토리지·코드 저장' },
    ],
  },

  'mini-msg-server': {
    path: 'minievm/x/evm/keeper/msg_server.go',
    lang: 'go',

    highlight: [1, 32],
    desc: 'MsgServer — Cosmos TX를 EVM 호출로 변환. Call / Create / Create2.',
    code: `// x/evm/keeper/msg_server.go — MsgServer 구현

type msgServerImpl struct {
    *Keeper  // Keeper 임베딩
}

// Call — EVM 컨트랙트 호출
func (ms *msgServerImpl) Call(ctx context.Context, msg *types.MsgCall) (*types.MsgCallResponse, error) {
    sender, err := ms.ac.StringToBytes(msg.Sender)
    if err != nil { return nil, err }

    // Cosmos↔EVM 시퀀스 불일치 보정
    err = ms.handleSequenceIncremented(ctx, sender, false)
    if err != nil { return nil, err }

    contractAddr, err := types.ContractAddressFromString(ms.ac, msg.ContractAddr)
    if err != nil { return nil, err }

    // 인자 검증: sender → EVM address, input → bytes, value → uint256
    caller, inputBz, value, accessList, authList, err :=
        ms.validateArguments(ctx, sender, msg.Input, msg.Value,
            msg.AccessList, msg.AuthList, false)
    if err != nil { return nil, err }

    // EVM 호출 실행
    retBz, logs, err := ms.EVMCall(ctx, caller, contractAddr,
        inputBz, value, accessList, authList)
    if err != nil { return nil, err }

    return &types.MsgCallResponse{
        Result: hexutil.Encode(retBz), Logs: logs,
    }, nil
}`,
    annotations: [
      { lines: [3, 5], color: 'sky' as const, note: 'Keeper 임베딩 — Keeper의 모든 메서드 접근 가능' },
      { lines: [13, 14], color: 'emerald' as const, note: 'Cosmos ante handler vs EVM nonce 충돌 보정' },
      { lines: [20, 24], color: 'amber' as const, note: '인자 변환: Cosmos 타입 → EVM 타입' },
      { lines: [27, 28], color: 'rose' as const, note: 'EVMCall 실행 — context.go의 핵심 함수' },
    ],
  },
};
