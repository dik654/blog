import type { CodeRef } from "@/components/code/types";

export const officialUniswapV4CodeRefs: Record<string, CodeRef> = {
  "v4-pool-key": {
    path: "src/types/PoolKey.sol · src/types/PoolId.sol",
    lang: "solidity",
    highlight: [1, 22],
    desc: "v4-core v4.0.0 commit e50237c · PoolKey의 다섯 필드 전체를 해시해 한 pool의 상태 주소를 만드는 실제 구조입니다. 이해를 돕는 한국어 주석만 덧붙였습니다.",
    code: `// 한 pool을 가리키는 값 전체입니다.
struct PoolKey {
    Currency currency0;
    Currency currency1;
    uint24 fee;
    int24 tickSpacing;
    IHooks hooks;
}

// 같은 token pair라도 fee·tickSpacing·hooks가 다르면 다른 PoolId입니다.
function toId(PoolKey memory poolKey)
    internal pure returns (PoolId poolId)
{
    assembly ("memory-safe") {
        // PoolKey는 32-byte slot 다섯 개, 합계 0xa0 bytes입니다.
        poolId := keccak256(poolKey, 0xa0)
    }
}`,
    annotations: [
      { lines: [1, 8], color: "sky", note: "PoolKey는 token pair만이 아니라 수수료·tick 간격·hook 주소까지 포함합니다." },
      { lines: [10, 19], color: "emerald", note: "다섯 slot의 해시가 PoolManager 안 _pools mapping을 찾는 PoolId가 됩니다." },
    ],
  },
  "v4-unlock": {
    path: "src/PoolManager.sol",
    lang: "solidity",
    highlight: [1, 16],
    desc: "같은 commit · router에게 잠시 제어권을 주고 callback이 끝난 뒤 미정산 currency가 하나라도 있으면 전체 transaction을 거절하는 경계입니다.",
    code: `function unlock(bytes calldata data)
    external returns (bytes memory result)
{
    // 이미 열린 회계 구간을 다시 열 수 없습니다.
    if (Lock.isUnlocked()) AlreadyUnlocked.selector.revertWith();

    Lock.unlock();

    // 호출자인 router가 swap과 대금 정산을 callback 안에서 수행합니다.
    result = IUnlockCallback(msg.sender).unlockCallback(data);

    // 남은 debt나 credit이 하나라도 있으면 앞선 효과도 모두 되돌립니다.
    if (NonzeroDeltaCount.read() != 0)
        CurrencyNotSettled.selector.revertWith();
    Lock.lock();
}`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "중첩 unlock을 막은 뒤 transient lock을 엽니다." },
      { lines: [9, 10], color: "emerald", note: "PoolManager가 사용자의 EOA가 아니라 msg.sender인 router의 callback을 호출합니다." },
      { lines: [12, 16], color: "rose", note: "Callback 반환 시 nonzero delta count가 0이어야 잠금을 닫고 성공합니다." },
    ],
  },
  "v4-swap-account": {
    path: "src/PoolManager.sol",
    lang: "solidity",
    highlight: [1, 32],
    desc: "같은 commit · PoolKey로 state를 찾고 before/after hook을 거친 뒤 router 주소에 swap delta를 기록하는 실제 순서입니다.",
    code: `function swap(PoolKey memory key, SwapParams memory params, bytes calldata hookData)
    external onlyWhenUnlocked returns (BalanceDelta swapDelta)
{
    if (params.amountSpecified == 0)
        SwapAmountCannotBeZero.selector.revertWith();

    // PoolKey 전체에서 계산한 PoolId로 독립 pool state를 찾습니다.
    PoolId id = key.toId();
    Pool.State storage pool = _getPool(id);
    pool.checkPoolInitialized();

    // 주소 flag가 켜진 경우에만 beforeSwap이 실행됩니다.
    (int256 amountToSwap, BeforeSwapDelta beforeDelta, uint24 feeOverride) =
        key.hooks.beforeSwap(key, params, hookData);

    // V3와 같은 집중 유동성 수학이 이 pool state 안에서 실행됩니다.
    swapDelta = _swap(pool, id, Pool.SwapParams({
        tickSpacing: key.tickSpacing,
        zeroForOne: params.zeroForOne,
        amountSpecified: amountToSwap,
        sqrtPriceLimitX96: params.sqrtPriceLimitX96,
        lpFeeOverride: feeOverride
    }), params.zeroForOne ? key.currency0 : key.currency1);

    // 허용된 afterSwap hook은 결과 delta를 보완할 수 있습니다.
    BalanceDelta hookDelta;
    (swapDelta, hookDelta) =
        key.hooks.afterSwap(key, params, swapDelta, hookData, beforeDelta);

    // 최종 debt·credit은 실제 호출자인 router 주소의 transient 장부에 기록됩니다.
    if (hookDelta != BalanceDeltaLibrary.ZERO_DELTA)
        _accountPoolBalanceDelta(key, hookDelta, address(key.hooks));
    _accountPoolBalanceDelta(key, swapDelta, msg.sender);
}`,
    annotations: [
      { lines: [1, 10], color: "sky", note: "Swap은 열린 unlock 안에서만 실행되며 PoolKey가 고른 pool state만 변경합니다." },
      { lines: [12, 23], color: "emerald", note: "Hook 전처리 뒤 pool math를 실행합니다. Singleton이 모든 pool의 가격을 섞는다는 뜻은 아닙니다." },
      { lines: [25, 32], color: "amber", note: "Hook와 router의 delta는 서로 다른 target에 기록되며 마지막 정산 검사에 포함됩니다." },
    ],
  },
  "v4-router-settlement": {
    path: "src/test/PoolSwapTest.sol",
    lang: "solidity",
    highlight: [1, 38],
    desc: "같은 commit의 공식 테스트 router · unlock callback에서 swap 결과의 음수 debt를 settle하고 양수 credit을 take하는 실행 예입니다.",
    code: `function swap(PoolKey memory key, SwapParams memory params, TestSettings memory settings, bytes memory hookData)
    external returns (BalanceDelta delta)
{
    // Router가 PoolManager의 unlock을 열고 자기 callback 자료를 함께 보냅니다.
    delta = abi.decode(manager.unlock(abi.encode(
        CallbackData(msg.sender, settings, key, params, hookData)
    )), (BalanceDelta));
}

function unlockCallback(bytes calldata rawData)
    external returns (bytes memory)
{
    // 임의 주소가 callback을 흉내 내지 못하게 PoolManager만 허용합니다.
    require(msg.sender == address(manager));
    CallbackData memory data = abi.decode(rawData, (CallbackData));

    BalanceDelta delta = manager.swap(data.key, data.params, data.hookData);
    int256 delta0 = data.key.currency0.getDelta(address(this));
    int256 delta1 = data.key.currency1.getDelta(address(this));

    // 음수는 router가 PoolManager에 내야 하는 debt입니다.
    if (delta0 < 0)
        data.key.currency0.settle(manager, data.sender, uint256(-delta0), false);
    if (delta1 < 0)
        data.key.currency1.settle(manager, data.sender, uint256(-delta1), false);

    // 양수는 router가 사용자에게 꺼내 줄 수 있는 credit입니다.
    if (delta0 > 0)
        data.key.currency0.take(manager, data.sender, uint256(delta0), false);
    if (delta1 > 0)
        data.key.currency1.take(manager, data.sender, uint256(delta1), false);

    return abi.encode(delta);
}`,
    annotations: [
      { lines: [1, 8], color: "sky", note: "외부 swap 함수는 PoolManager.unlock을 호출하며, PoolManager는 같은 router를 다시 callback합니다." },
      { lines: [10, 20], color: "emerald", note: "Callback은 caller를 확인한 뒤 swap을 실행하고 router 주소의 currency별 delta를 읽습니다." },
      { lines: [22, 33], color: "amber", note: "음수는 settle, 양수는 take로 0을 만듭니다. 부호는 PoolManager가 아닌 router 관점입니다." },
    ],
  },
  "v4-settle-take": {
    path: "src/PoolManager.sol",
    lang: "solidity",
    highlight: [1, 35],
    desc: "같은 commit · sync 뒤 실제 ERC-20 잔액 증가만 debt 상환으로 인정하고, take는 credit을 줄이면서 token을 내보냅니다.",
    code: `function sync(Currency currency) external {
    // ERC-20을 받기 전 현재 PoolManager 잔액을 transient checkpoint로 저장합니다.
    uint256 balance = currency.balanceOfSelf();
    CurrencyReserves.syncCurrencyAndReserves(currency, balance);
}

function settle() external payable onlyWhenUnlocked returns (uint256) {
    Currency currency = CurrencyReserves.getSyncedCurrency();
    uint256 reservesBefore = CurrencyReserves.getSyncedReserves();
    uint256 reservesNow = currency.balanceOfSelf();
    uint256 paid = reservesNow - reservesBefore;

    // 실제 받은 양만큼 음수 delta를 0 방향으로 움직입니다.
    _accountDelta(currency, paid.toInt128(), msg.sender);
    return paid;
}

function take(Currency currency, address to, uint256 amount)
    external onlyWhenUnlocked
{
    // 꺼낸 양만큼 양수 credit을 0 방향으로 줄인 뒤 전송합니다.
    _accountDelta(currency, -(amount.toInt128()), msg.sender);
    currency.transfer(to, amount);
}

function _accountDelta(Currency currency, int128 delta, address target) internal {
    (int256 previous, int256 next) = currency.applyDelta(target, delta);

    // 0↔nonzero 경계에서만 미정산 currency 수를 바꿉니다.
    if (next == 0) NonzeroDeltaCount.decrement();
    else if (previous == 0) NonzeroDeltaCount.increment();
}`,
    annotations: [
      { lines: [1, 15], color: "sky", note: "ERC-20 debt는 sync 시점 이후 실제 잔액 증가만 settle로 인정합니다." },
      { lines: [17, 23], color: "emerald", note: "Take는 credit을 먼저 줄인 뒤 token을 전송합니다." },
      { lines: [25, 31], color: "violet", note: "모든 amount를 순회하지 않고 zero/nonzero 전환 수를 세어 unlock 끝의 검사를 일정하게 만듭니다." },
    ],
  },
  "v4-hook-flags": {
    path: "src/libraries/Hooks.sol",
    lang: "solidity",
    highlight: [1, 30],
    desc: "같은 commit · hook 주소의 하위 14비트가 활성 callback과 delta 반환 권한을 표시하는 실제 flag layout입니다.",
    code: `// Hook 주소의 하위 14비트만 permission 표로 사용합니다.
uint160 constant ALL_HOOK_MASK = uint160((1 << 14) - 1);

uint160 constant BEFORE_INITIALIZE_FLAG = 1 << 13;
uint160 constant AFTER_INITIALIZE_FLAG = 1 << 12;
uint160 constant BEFORE_ADD_LIQUIDITY_FLAG = 1 << 11;
uint160 constant AFTER_ADD_LIQUIDITY_FLAG = 1 << 10;
uint160 constant BEFORE_REMOVE_LIQUIDITY_FLAG = 1 << 9;
uint160 constant AFTER_REMOVE_LIQUIDITY_FLAG = 1 << 8;
uint160 constant BEFORE_SWAP_FLAG = 1 << 7;
uint160 constant AFTER_SWAP_FLAG = 1 << 6;
uint160 constant BEFORE_DONATE_FLAG = 1 << 5;
uint160 constant AFTER_DONATE_FLAG = 1 << 4;

// 이 네 flag가 있어야 hook가 core delta를 보완해 반환할 수 있습니다.
uint160 constant BEFORE_SWAP_RETURNS_DELTA_FLAG = 1 << 3;
uint160 constant AFTER_SWAP_RETURNS_DELTA_FLAG = 1 << 2;
uint160 constant AFTER_ADD_LIQUIDITY_RETURNS_DELTA_FLAG = 1 << 1;
uint160 constant AFTER_REMOVE_LIQUIDITY_RETURNS_DELTA_FLAG = 1 << 0;

function isValidHookAddress(IHooks self, uint24 fee) internal pure returns (bool) {
    // 해당 lifecycle callback 없이 delta-return flag만 켤 수는 없습니다.
    if (!self.hasPermission(BEFORE_SWAP_FLAG)
        && self.hasPermission(BEFORE_SWAP_RETURNS_DELTA_FLAG)) return false;
    if (!self.hasPermission(AFTER_SWAP_FLAG)
        && self.hasPermission(AFTER_SWAP_RETURNS_DELTA_FLAG)) return false;

    return address(self) == address(0)
        ? !fee.isDynamicFee()
        : (uint160(address(self)) & ALL_HOOK_MASK > 0 || fee.isDynamicFee());
}`,
    annotations: [
      { lines: [1, 13], color: "sky", note: "주소 비트는 어느 lifecycle callback이 실행될지를 PoolKey에 고정합니다." },
      { lines: [15, 19], color: "amber", note: "별도 return-delta flag는 hook가 회계 결과에 영향을 줄 수 있는 표면을 엽니다." },
      { lines: [21, 30], color: "rose", note: "Flag 조합의 형태만 검증합니다. Hook 코드의 경제적 안전성이나 사용자 인증까지 증명하지는 않습니다." },
    ],
  },
};
