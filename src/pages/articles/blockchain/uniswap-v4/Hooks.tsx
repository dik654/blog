import HooksViz from './viz/HooksViz';
import HookAddressViz from './viz/HookAddressViz';
import DynamicFeeViz from './viz/DynamicFeeViz';

export default function Hooks() {
  return (
    <section id="hooks" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hooks — Pre/Post 커스텀 로직</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <HooksViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Hook이란</h3>
        <p>
          Hook: 풀의 수명 주기 이벤트에 <strong>커스텀 컨트랙트 로직</strong> 주입<br />
          풀 생성자가 해당 풀에 hook 지정 — 이후 모든 swap/mint/burn이 hook 거침<br />
          결과: <strong>Uniswap을 플랫폼으로</strong> 활용한 무한 파생 AMM
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">10가지 Hook 포인트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`interface IHooks {
    // Initialize
    function beforeInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96) external;
    function afterInitialize(address sender, PoolKey calldata key, uint160 sqrtPriceX96, int24 tick) external;

    // Liquidity modification
    function beforeAddLiquidity(address sender, PoolKey calldata key, ModifyLiquidityParams calldata params, bytes calldata hookData) external;
    function afterAddLiquidity(address sender, PoolKey calldata key, ModifyLiquidityParams calldata params, BalanceDelta delta, bytes calldata hookData) external;
    function beforeRemoveLiquidity(...) external;
    function afterRemoveLiquidity(...) external;

    // Swap
    function beforeSwap(address sender, PoolKey calldata key, SwapParams calldata params, bytes calldata hookData) external;
    function afterSwap(address sender, PoolKey calldata key, SwapParams calldata params, BalanceDelta delta, bytes calldata hookData) external;

    // Donate
    function beforeDonate(...) external;
    function afterDonate(...) external;
}`}</pre>
        <p>
          <strong>5개 이벤트 × Pre/Post = 10개 hook 포인트</strong><br />
          Pre hook: 이벤트 차단·파라미터 검증·사전 처리<br />
          Post hook: 후속 처리·보상·알림
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Hook 활성화 플래그 — 주소 인코딩</h3>

        <HookAddressViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Hook 컨트랙트 주소의 마지막 바이트에 플래그 인코딩
// 각 bit가 어떤 hook이 활성화됐는지 표시

uint160 constant BEFORE_INITIALIZE_FLAG = 1 << 159;
uint160 constant AFTER_INITIALIZE_FLAG = 1 << 158;
uint160 constant BEFORE_ADD_LIQUIDITY_FLAG = 1 << 157;
// ... 10개 플래그

// 예시: beforeSwap + afterSwap 활성화된 hook 주소
// 상위 8비트 = 0000_1100 (binary)
// → 주소가 특정 패턴으로 끝나야 함 (CREATE2 mining)

// 검증
function validateHookAddress(IHooks hook, PoolKey memory key) internal pure {
    uint160 addr = uint160(address(hook));
    require(
        (addr & BEFORE_SWAP_FLAG != 0) == hook.beforeSwap.selector,
        "Invalid hook address"
    );
}`}</pre>
        <p>
          <strong>주소 자체가 활성화 플래그</strong>: CREATE2로 원하는 주소 패턴 배포<br />
          이 설계로 <strong>런타임 hook 호출 비용 절감</strong> — 어떤 hook이 활성인지 mapping 조회 불필요<br />
          hook 주소 mining이 배포 시 필요 — 1회성 비용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 Hook 예시 — Dynamic Fee</h3>

        <DynamicFeeViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 변동성 기반 수수료 조정 hook
contract VolatilityFeeHook is IHooks {
    mapping(PoolId => uint24) public currentFee;

    function beforeSwap(
        address, PoolKey calldata key, SwapParams calldata, bytes calldata
    ) external override returns (bytes4) {
        // 최근 변동성 계산
        uint256 volatility = computeVolatility(key);

        // 변동성에 따라 수수료 조정 (0.05% ~ 1%)
        uint24 newFee = volatility > 0.05e18
            ? 10000  // 1%
            : volatility > 0.02e18
                ? 3000  // 0.3%
                : 500;  // 0.05%

        // Pool에 새 수수료 적용 (LPFee만 변경)
        IPoolManager(msg.sender).updateDynamicLPFee(key, newFee);

        return IHooks.beforeSwap.selector;
    }
}`}</pre>
        <p>
          <strong>Dynamic Fee</strong>: 시장 상황에 따라 수수료 실시간 조정<br />
          V3는 고정 4 tier — V4 hook은 무제한 유연성<br />
          LP 수익 최적화·변동성 대응 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 Hook 예시 — Onchain Limit Orders</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Limit Order를 유동성 포지션으로 시뮬레이션
contract LimitOrderHook is IHooks {
    struct Order {
        address owner;
        int24 tick;     // 실행 가격
        uint128 amount;
    }

    mapping(PoolId => mapping(int24 => Order[])) public orders;

    // Swap 후 가격이 limit 지나갔는지 확인
    function afterSwap(
        address, PoolKey calldata key, SwapParams calldata,
        BalanceDelta, bytes calldata
    ) external override returns (bytes4) {
        (, int24 currentTick) = getSlot0(key.toId());

        // 현재 tick까지 도달한 모든 limit order 실행
        for (int24 t = lastTick; t <= currentTick; ++t) {
            if (orders[key.toId()][t].length > 0) {
                fillLimitOrders(key, t);
            }
        }

        return IHooks.afterSwap.selector;
    }
}`}</pre>
        <p>
          <strong>Limit Order 구현</strong>: V4 이전엔 불가능했던 기능<br />
          CLOB(오더북) 없이 AMM 위에 limit order 레이어 추가<br />
          dydx 같은 별도 DEX 필요 없이 Uniswap 위에서 실현
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Hook의 가능성 — 예시 모음</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Hook 종류</th>
                <th className="border border-border px-3 py-2 text-left">기능</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2">TWAMM</td><td className="border border-border px-3 py-2">시간 가중 자동 매수 (대규모 주문 분할)</td></tr>
              <tr><td className="border border-border px-3 py-2">MEV Capture</td><td className="border border-border px-3 py-2">MEV를 LP에게 재분배</td></tr>
              <tr><td className="border border-border px-3 py-2">Oracle</td><td className="border border-border px-3 py-2">커스텀 TWAP/가격 피드 제공</td></tr>
              <tr><td className="border border-border px-3 py-2">Fee Rebate</td><td className="border border-border px-3 py-2">거래량 기반 수수료 할인</td></tr>
              <tr><td className="border border-border px-3 py-2">Range Manager</td><td className="border border-border px-3 py-2">자동 구간 재조정</td></tr>
              <tr><td className="border border-border px-3 py-2">KYC/Whitelist</td><td className="border border-border px-3 py-2">규제 준수 풀 (기관용)</td></tr>
              <tr><td className="border border-border px-3 py-2">Auction AMM</td><td className="border border-border px-3 py-2">경매 기반 가격 발견</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Uniswap을 "DEX 플랫폼"으로</p>
          <p>
            V4 Hooks는 Uniswap을 <strong>AMM → DEX 플랫폼</strong>으로 전환:
          </p>
          <p className="mt-2">
            <strong>V1-V3 관점</strong>: "우리가 만든 AMM 사용해" (단일 제품)<br />
            <strong>V4 관점</strong>: "우리 인프라 위에 AMM 만들어" (플랫폼)
          </p>
          <p className="mt-2">
            비유: Uniswap = iOS, Hooks = App Store<br />
            - 사용자는 한 곳에서 다양한 AMM 경험<br />
            - 개발자는 처음부터 AMM 안 만들어도 됨<br />
            - Uniswap은 플랫폼 수수료로 가치 포획
          </p>
          <p className="mt-2">
            <strong>리스크</strong>: 악의적 hook이 MEV 탈취·자금 유출 가능<br />
            대응: hook 감사 마켓플레이스, 커뮤니티 평가 시스템<br />
            풀 생성자가 hook 선택 책임 — 사용자는 풀 선택 시 hook 확인 필수
          </p>
        </div>

      </div>
    </section>
  );
}
