import LockViz from './viz/LockViz';
import V4GasComparisonViz from './viz/V4GasComparisonViz';

export default function PoolManagerSection() {
  return (
    <section id="pool-manager" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PoolManager &amp; lock() 진입점</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <LockViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PoolManager — 모든 풀의 집</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`contract PoolManager is IPoolManager, ProtocolFees, NoDelegateCall {
    using Pool for *;
    using Hooks for IHooks;
    using CurrencyLibrary for Currency;

    // 모든 풀 상태
    mapping(PoolId => Pool.State) internal _pools;

    // Flash accounting — transient storage
    // (EIP-1153 사용)
}`}</pre>
        <p>
          <strong>NoDelegateCall</strong>: delegatecall 방지 — V2가 Pair를 delegate로 호출했던 취약점 대응<br />
          <code>using Pool for *</code>: Pool 라이브러리의 모든 함수를 Pool.State에 바인딩<br />
          내부 함수 접근 단순화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">initialize() — 풀 생성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function initialize(PoolKey memory key, uint160 sqrtPriceX96, bytes calldata hookData)
    external override noDelegateCall returns (int24 tick)
{
    // 1) tick spacing 검증
    require(key.tickSpacing >= MIN_TICK_SPACING, "TickSpacingTooSmall");
    require(key.tickSpacing <= MAX_TICK_SPACING, "TickSpacingTooLarge");

    // 2) Fee 검증 (0 ~ 1000000 = 0 ~ 100%)
    require(key.fee < 1_000_000, "FeeTooLarge");

    // 3) Hook 주소 검증 (플래그와 selector 일치)
    key.hooks.validateHookAddress(key);

    // 4) beforeInitialize hook
    key.hooks.beforeInitialize(msg.sender, key, sqrtPriceX96, hookData);

    // 5) 풀 상태 초기화
    PoolId id = key.toId();
    tick = _pools[id].initialize(sqrtPriceX96, protocolFee, lpFee);

    // 6) afterInitialize hook
    key.hooks.afterInitialize(msg.sender, key, sqrtPriceX96, tick, hookData);

    emit Initialize(id, key.currency0, key.currency1, key.fee, key.tickSpacing, key.hooks);
}`}</pre>
        <p>
          <strong>6단계 초기화</strong>: 검증 → hook 검증 → Pre-hook → 상태 생성 → Post-hook<br />
          Hook 주소의 플래그와 실제 구현 함수 selector 비교 — 잘못된 hook 방지<br />
          풀 생성 가스: ~200K (V3는 ~5M) — 25배 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">unlock() — 모든 operation 진입점</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function unlock(bytes calldata data) external override returns (bytes memory result) {
    // 1) 이미 unlock 상태인지 확인 (재진입 방지)
    if (Lock.isUnlocked()) revert AlreadyUnlocked();

    // 2) unlock 플래그 설정
    Lock.unlock();

    // 3) 호출자의 콜백 실행
    result = IUnlockCallback(msg.sender).unlockCallback(data);

    // 4) 모든 delta가 0인지 확인
    if (NonzeroDeltaCount.read() != 0) revert CurrencyNotSettled();

    // 5) Lock 해제
    Lock.lock();
}`}</pre>
        <p>
          <strong>5단계 실행</strong>: unlock 체크 → 잠금 → 콜백 → delta 검증 → 잠금 해제<br />
          <code>msg.sender</code>가 <code>IUnlockCallback</code> 구현 필수 — Router 등 주체<br />
          delta 잔여 시 <strong>CurrencyNotSettled</strong> — 사용자가 토큰 정산 안 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">swap() 내부 — Pool 라이브러리 호출</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function swap(PoolKey memory key, SwapParams memory params, bytes calldata hookData)
    external override onlyWhenUnlocked returns (BalanceDelta swapDelta)
{
    PoolId id = key.toId();
    Pool.State storage pool = _pools[id];

    // beforeSwap hook
    BeforeSwapDelta beforeSwapDelta = BeforeSwapDelta.wrap(0);
    uint24 lpFeeOverride;
    (beforeSwapDelta, lpFeeOverride) = key.hooks.beforeSwap(
        msg.sender, key, params, hookData
    );

    // 실제 swap 실행
    (swapDelta, ) = pool.swap(
        Pool.SwapParams({
            tickSpacing: key.tickSpacing,
            zeroForOne: params.zeroForOne,
            amountSpecified: params.amountSpecified,
            sqrtPriceLimitX96: params.sqrtPriceLimitX96,
            lpFeeOverride: lpFeeOverride
        })
    );

    // beforeSwapDelta 적용 (hook이 swap에 영향)
    swapDelta = swapDelta + BeforeSwapDelta.unwrap(beforeSwapDelta);

    // delta 기록 (실제 토큰 이동 없음)
    _accountPoolBalanceDelta(key, swapDelta, msg.sender);

    // afterSwap hook
    key.hooks.afterSwap(msg.sender, key, params, swapDelta, hookData);

    emit Swap(id, msg.sender, swapDelta, /* ... */);
}`}</pre>
        <p>
          <strong>onlyWhenUnlocked 수식어</strong>: unlock() 안에서만 호출 가능<br />
          <strong>hook 실행 결과 반영</strong>: <code>beforeSwapDelta</code>로 swap 파라미터 변경 가능<br />
          <code>lpFeeOverride</code>로 dynamic fee 적용 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">modifyLiquidity() — V3 mint/burn 대체</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function modifyLiquidity(
    PoolKey memory key,
    ModifyLiquidityParams memory params,
    bytes calldata hookData
) external override onlyWhenUnlocked returns (BalanceDelta callerDelta, BalanceDelta feesAccrued) {
    // V3 mint + burn이 하나의 함수로 통합
    // params.liquidityDelta > 0: 유동성 추가
    // params.liquidityDelta < 0: 유동성 제거

    PoolId id = key.toId();
    Pool.State storage pool = _pools[id];

    // beforeAddLiquidity 또는 beforeRemoveLiquidity hook
    key.hooks.beforeModifyLiquidity(msg.sender, key, params, hookData);

    // 유동성 변경 + 수수료 누적 분 반환
    (BalanceDelta principalDelta, BalanceDelta feeDelta) = pool.modifyLiquidity(
        Pool.ModifyLiquidityParams({
            owner: msg.sender,
            tickLower: params.tickLower,
            tickUpper: params.tickUpper,
            liquidityDelta: params.liquidityDelta,
            tickSpacing: key.tickSpacing,
            salt: params.salt
        })
    );

    callerDelta = principalDelta + feeDelta;

    // delta 기록
    _accountPoolBalanceDelta(key, callerDelta, msg.sender);

    // afterAddLiquidity 또는 afterRemoveLiquidity hook
    key.hooks.afterModifyLiquidity(msg.sender, key, params, callerDelta, feesAccrued, hookData);
}`}</pre>
        <p>
          <strong>통합 API</strong>: V3의 mint/burn 구분 없이 delta 부호로 결정<br />
          <code>salt</code>: 같은 소유자가 여러 포지션 구분 가능 (V3의 NFT tokenId 대체)<br />
          수수료 누적분도 함께 반환 — 별도 collect 호출 불필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V3 대비 가스 절감</h3>

        <V4GasComparisonViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 단일 swap 가스 비교
V3:  ~140K gas
V4:  ~100K gas (30% 절감)

// 2홉 swap
V3:  ~260K gas
V4:  ~150K gas (42% 절감)

// LP mint (새 포지션)
V3:  ~400K gas (NFT mint 포함)
V4:  ~250K gas (ERC-6909 사용, NFT 없음)

// 새 풀 생성
V3:  ~5.2M gas (contract deploy)
V4:  ~180K gas (storage write만)

// 이유
- Singleton: contract deployment 제거
- Flash Accounting: 중간 transfer 제거
- ERC-6909: NFT 오버헤드 제거
- Transient Storage: 재진입 가드 비용 1/200`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: V4의 "혁신 없이 최적화"</p>
          <p>
            V3 → V4 변화는 알고리즘적 혁신 없음:<br />
            - Concentrated liquidity 그대로<br />
            - tick·√P 수학 동일<br />
            - fee tier 유사
          </p>
          <p className="mt-2">
            대신 <strong>엔지니어링 최적화</strong> 극대화:<br />
            ✓ Singleton으로 배포 비용 절감<br />
            ✓ Flash Accounting으로 transfer 제거<br />
            ✓ Transient Storage로 정적 상태 최소화<br />
            ✓ Hooks로 확장성 확보
          </p>
          <p className="mt-2">
            V4는 <strong>"V3의 성숙형"</strong> — 검증된 수학 위에 엔지니어링 레이어<br />
            새 알고리즘 대신 기존 알고리즘의 효율적 구현에 집중<br />
            이는 성숙한 프로토콜의 전형적 진화 패턴
          </p>
        </div>

      </div>
    </section>
  );
}
