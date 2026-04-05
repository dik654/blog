import FlashAccountingViz from './viz/FlashAccountingViz';
import BalanceDeltaViz from './viz/BalanceDeltaViz';
import HopComparisonViz from './viz/HopComparisonViz';
import TransientStorageViz from './viz/TransientStorageViz';

export default function FlashAccounting() {
  return (
    <section id="flash-accounting" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Flash Accounting — EIP-1153 Transient Storage</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <FlashAccountingViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Flash Accounting란</h3>
        <p>
          V2/V3: 각 swap마다 <strong>즉시 토큰 전송</strong> — 여러 operation 시 여러 번 SLOAD/SSTORE<br />
          V4: 연산 중 <strong>balance delta</strong>만 기록, 마지막에 정산 1회<br />
          결과: 다중 swap 가스 대폭 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EIP-1153 — Transient Storage</h3>

        <TransientStorageViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 2개 새 opcode (Cancun upgrade, 2024)
TSTORE(key, value)   // 트랜잭션 동안만 유지되는 storage 쓰기
TLOAD(key)            // 읽기

// 특징
- 트랜잭션 종료 시 자동 초기화
- 가스 비용: TSTORE 100, TLOAD 100 (영구 storage 대비 1/200)
- 배포 비용 없음

// 기존 storage 대비
SSTORE: 20000 gas (new) / 2900 gas (modify)
SLOAD: 2100 gas (cold) / 100 gas (warm)
TSTORE: 100 gas (항상)`}</pre>
        <p>
          <strong>영구 저장 없이 트랜잭션 내 상태 공유</strong><br />
          주요 사용: reentrancy guard, callback 파라미터 전달, flash accounting<br />
          V4가 이 opcode 최대 활용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">lock() 패턴 — 진입점 강제</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// PoolManager의 모든 상호작용은 lock() 경유
function lock(
    address lockTarget,
    bytes calldata data
) external returns (bytes memory result) {
    Lock.push(msg.sender);

    // lockTarget이 IUnlockCallback 구현
    result = IUnlockCallback(lockTarget).unlockCallback(data);

    // 콜백 종료 시 모든 balance delta = 0 검증
    require(_getNonZeroDeltaCount() == 0, "NonzeroDeltaCount");

    Lock.pop();
}

interface IUnlockCallback {
    function unlockCallback(bytes calldata data) external returns (bytes memory);
}`}</pre>
        <p>
          <strong>모든 operation은 lock() 내부에서만 가능</strong><br />
          사용자 컨트랙트가 <code>unlockCallback</code> 구현 → 여기서 swap/mint/burn 호출<br />
          lock 종료 전 모든 delta를 0으로 만들지 못하면 revert
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">BalanceDelta — 부채 추적</h3>

        <BalanceDeltaViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// BalanceDelta: int128 × 2 packed
type BalanceDelta is int256;

// currency별 net 변화량 누적
function _accountDelta(Currency currency, int128 delta) internal {
    if (delta == 0) return;

    // 트랜지언트 스토리지에 누적
    int256 current = currencyDelta[currency];
    int256 next = current + delta;
    currencyDelta[currency] = next;

    // 0에서 non-zero 또는 non-zero에서 0 전환 추적
    if (current == 0 && next != 0) nonZeroDeltaCount++;
    else if (current != 0 && next == 0) nonZeroDeltaCount--;
}`}</pre>
        <p>
          <strong>delta 기록만</strong>: 실제 토큰 이동 없음<br />
          음수 delta = PoolManager에 빚진 토큰 양<br />
          양수 delta = PoolManager가 사용자에게 줄 토큰 양
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3홉 스왑 비교 — V3 vs V4</h3>

        <HopComparisonViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시나리오: A → B → C → D (3홉)

V3 방식:
  1. A→B swap: 사용자가 A 전송, B 받음 (ERC20 transfer ×2)
  2. B→C swap: B 전송, C 받음 (ERC20 transfer ×2)
  3. C→D swap: C 전송, D 받음 (ERC20 transfer ×2)
  → 총 6번의 ERC20 transfer

V4 방식:
  1. unlock 진입
  2. A→B swap: delta 기록만 (storage 연산 없음)
  3. B→C swap: delta 기록만
  4. C→D swap: delta 기록만
  5. settle: A 전송 (1회), D 수령 (1회)
  → 총 2번의 ERC20 transfer

가스 절감: ~60-70%`}</pre>
        <p>
          <strong>중간 토큰 이동 제거</strong>: B, C는 PoolManager 내 이동 불필요<br />
          사용자는 시작 토큰 A만 지불, 최종 토큰 D만 수령<br />
          ERC20 transfer 가스(~50K) 여러 번 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">정산 — settle() &amp; take()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// lock 내부에서 호출 (unlockCallback 안에서)

// settle: 토큰 입금 (음수 delta 해소)
function settle(Currency currency) external payable returns (uint256 paid) {
    uint256 balanceBefore = currency.balanceOf(address(this));

    // 사용자가 트랜잭션으로 토큰을 PoolManager에 미리 보냄
    // 여기서는 잔액 차이만 기록
    paid = currency.balanceOf(address(this)) - balanceBefore;
    _accountDelta(currency, int128(int256(paid)));  // delta 증가 (부채 감소)
}

// take: 토큰 출금 (양수 delta 해소)
function take(Currency currency, address to, uint256 amount) external {
    _accountDelta(currency, -int128(int256(amount)));  // delta 감소
    currency.transfer(to, amount);
}`}</pre>
        <p>
          <strong>settle/take 대응</strong>: delta를 0으로 만드는 2가지 방법<br />
          lock 종료 시 모든 currency delta = 0이어야 성공<br />
          그렇지 않으면 "delta imbalance" revert
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 swap 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 사용자 코드 (Router 또는 직접 호출)
contract MyRouter is IUnlockCallback {
    function swap(PoolKey memory key, SwapParams memory params) external {
        // 1) PoolManager 잠금 + 콜백
        poolManager.unlock(abi.encode(key, params));
    }

    function unlockCallback(bytes calldata data) external returns (bytes memory) {
        (PoolKey memory key, SwapParams memory params) = abi.decode(data, ...);

        // 2) swap 실행 → balance delta 반환
        BalanceDelta delta = poolManager.swap(key, params, "");

        int128 amount0 = delta.amount0();
        int128 amount1 = delta.amount1();

        // 3) 음수 delta만큼 토큰 입금 (settle)
        if (amount0 < 0) {
            IERC20(key.currency0).transfer(address(poolManager), uint256(-int256(amount0)));
            poolManager.settle(key.currency0);
        }

        // 4) 양수 delta만큼 토큰 수령 (take)
        if (amount1 > 0) {
            poolManager.take(key.currency1, msg.sender, uint256(int256(amount1)));
        }

        return "";
    }
}`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Flash Accounting의 제약과 능력</p>
          <p>
            <strong>Flash Accounting = 원자적 다중 operation</strong><br />
            lock 내부에서 <strong>어떤 순서로든</strong> 연산 가능:
          </p>
          <p className="mt-2">
            - swap → mint → swap → donate → burn → settle<br />
            - 각 단계마다 delta 누적<br />
            - 끝에 한 번만 실제 transfer
          </p>
          <p className="mt-2">
            <strong>고급 활용</strong>:<br />
            ✓ JIT (Just-In-Time) 유동성: swap 직전 mint, 직후 burn<br />
            ✓ Atomic Arbitrage: 여러 풀 간 가격 차익 1트랜잭션<br />
            ✓ Complex Collateral Swap: Aave 청산 + V4 swap 조합
          </p>
          <p className="mt-2">
            이 유연성이 <strong>"DEX가 DeFi Legos의 조합 도구"</strong>되게 함<br />
            가스 효율 + 표현력 = V4의 핵심 가치
          </p>
        </div>

      </div>
    </section>
  );
}
