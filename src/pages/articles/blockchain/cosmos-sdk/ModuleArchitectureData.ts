export const MODULES_CODE = `이더리움 프리컴파일/시스템 ↔ Cosmos SDK 모듈

x/bank       ↔ ETH 전송 (native transfer)
x/staking    ↔ 비콘 체인 검증자 관리 (deposit contract)
x/slashing   ↔ 슬래싱 조건 (Casper FFG slashing)
x/gov        ↔ EIP 거버넌스 (오프체인 → 온체인)
x/auth       ↔ EOA/계정 관리 (nonce, balance)
x/params     ↔ 하드포크 파라미터 (ChainConfig)
x/evidence   ↔ Slasher (CL의 슬래싱 증거)
x/distribution ↔ 블록 보상 분배
x/ibc        ↔ (이더리움에 없음) 체인 간 통신`;

export const MODULES_ANNOTATIONS = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '핵심 모듈 (bank, staking, slashing)' },
  { lines: [11, 11] as [number, number], color: 'emerald' as const, note: 'Cosmos 고유: IBC' },
];

export const KEEPER_CODE = `// Keeper = 모듈의 상태 접근 객체
// 이더리움의 StateDB와 유사한 역할

type BankKeeper struct {
    storeKey   storetypes.StoreKey  // 모듈 전용 KV 저장소 키
    cdc        codec.BinaryCodec     // 직렬화 코덱
    ak         types.AccountKeeper   // 다른 모듈의 Keeper 참조
}

// 이더리움 비교:
// StateDB.AddBalance(addr, amount) ↔ bankKeeper.SendCoins(ctx, from, to, coins)
// StateDB.GetBalance(addr)         ↔ bankKeeper.GetBalance(ctx, addr, denom)

// 모듈 간 의존성은 Keeper 인터페이스로 관리
// → 이더리움에서 컨트랙트가 다른 컨트랙트를 CALL하는 것과 유사
// → 하지만 컴파일 타임에 의존성이 결정됨 (정적 vs 동적)`;

export const KEEPER_ANNOTATIONS = [
  { lines: [4, 8] as [number, number], color: 'sky' as const, note: 'BankKeeper 구조체' },
  { lines: [10, 12] as [number, number], color: 'emerald' as const, note: '이더리움 StateDB 비교' },
  { lines: [14, 16] as [number, number], color: 'amber' as const, note: '정적 의존성 관리' },
];

export const ROUTING_CODE = `트랜잭션 라우팅 비교:

이더리움:
  TX → EVM → to 주소가 컨트랙트? → calldata(4byte selector) → 함수 실행

Cosmos SDK:
  TX → BaseApp → Msg 타입 확인 → MsgServer.Handle(ctx, msg) → 상태 변경

예시:
  이더리움:  tx.to=0xStaking, tx.data=deposit(pubkey, ...)
  Cosmos:   MsgDelegate{validator_addr, amount} → x/staking MsgServer`;

export const ROUTING_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '이더리움: EVM calldata 라우팅' },
  { lines: [6, 7] as [number, number], color: 'emerald' as const, note: 'Cosmos: Msg 타입 라우팅' },
];
