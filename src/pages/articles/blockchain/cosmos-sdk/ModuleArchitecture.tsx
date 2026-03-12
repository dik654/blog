export default function ModuleArchitecture() {
  return (
    <section id="module-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">모듈 아키텍처 & Keeper 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cosmos SDK의 모듈은 이더리움의 프리컴파일(Precompile)과
          시스템 컨트랙트에 비유할 수 있습니다. 각 모듈은 자체 상태 저장소(KVStore)를 가지며,
          <strong>Keeper</strong> 객체를 통해 상태를 읽고 씁니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">주요 내장 모듈</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 프리컴파일/시스템 ↔ Cosmos SDK 모듈

x/bank       ↔ ETH 전송 (native transfer)
x/staking    ↔ 비콘 체인 검증자 관리 (deposit contract)
x/slashing   ↔ 슬래싱 조건 (Casper FFG slashing)
x/gov        ↔ EIP 거버넌스 (오프체인 → 온체인)
x/auth       ↔ EOA/계정 관리 (nonce, balance)
x/params     ↔ 하드포크 파라미터 (ChainConfig)
x/evidence   ↔ Slasher (CL의 슬래싱 증거)
x/distribution ↔ 블록 보상 분배
x/ibc        ↔ (이더리움에 없음) 체인 간 통신`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Keeper 패턴</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`// Keeper = 모듈의 상태 접근 객체
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
// → 하지만 컴파일 타임에 의존성이 결정됨 (정적 vs 동적)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">BaseApp: 메시지 라우팅</h3>
        <p>
          BaseApp은 이더리움의 EVM 인터프리터와 유사하게 트랜잭션을 해석하고
          적절한 모듈로 라우팅합니다. 차이점은 EVM이 바이트코드를 실행하는 반면,
          BaseApp은 Protobuf로 인코딩된 <strong>Msg</strong>를 해당 모듈의
          <strong>MsgServer</strong>로 전달합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`트랜잭션 라우팅 비교:

이더리움:
  TX → EVM → to 주소가 컨트랙트? → calldata(4byte selector) → 함수 실행

Cosmos SDK:
  TX → BaseApp → Msg 타입 확인 → MsgServer.Handle(ctx, msg) → 상태 변경

예시:
  이더리움:  tx.to=0xStaking, tx.data=deposit(pubkey, ...)
  Cosmos:   MsgDelegate{validator_addr, amount} → x/staking MsgServer`}</code>
        </pre>
      </div>
    </section>
  );
}
