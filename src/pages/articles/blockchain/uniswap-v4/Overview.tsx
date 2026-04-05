import SingletonViz from './viz/SingletonViz';
import PoolKeyViz from './viz/PoolKeyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; 싱글톤 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SingletonViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">V4의 3대 변화</h3>
        <p>
          Uniswap V4(2025년 출시)의 핵심 변화:<br />
          1. <strong>Singleton</strong>: 모든 풀이 단일 컨트랙트 내부<br />
          2. <strong>Hooks</strong>: 풀 생성자가 커스텀 로직 주입<br />
          3. <strong>Flash Accounting</strong>: EIP-1153 transient storage 활용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Singleton — 모든 풀이 한 컨트랙트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`V2/V3:
  Factory가 각 페어마다 Pair 컨트랙트 배포
  ETH/USDC, DAI/USDC, USDC/USDT ... 각각 별개 컨트랙트
  → 수천 개 Pair 컨트랙트 존재

V4:
  PoolManager 하나가 모든 풀 관리
  풀 상태는 PoolManager의 mapping에 저장
  → 새 풀 생성은 storage write만 (contract deploy 없음)

// PoolManager.sol (개념)
contract PoolManager {
    mapping(PoolId => Pool.State) public pools;

    function initialize(PoolKey memory key, uint160 sqrtPriceX96, bytes calldata hookData)
        external returns (int24 tick);
}`}</pre>
        <p>
          <strong>풀 생성 비용 99% 절감</strong>: contract deploy ≈ 5M gas → storage write ≈ 50K gas<br />
          다중 홉 스왑 가스 대폭 감소 — 하나의 컨트랙트 내 여러 풀 순회<br />
          배포 비용 장벽 낮아져 <strong>exotic pair 활성화</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PoolKey — 풀 식별자</h3>

        <PoolKeyViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`struct PoolKey {
    Currency currency0;   // token0 주소 (또는 ETH)
    Currency currency1;
    uint24 fee;           // 수수료 tier
    int24 tickSpacing;    // V3 대비 자유 선택 가능
    IHooks hooks;         // 이 풀의 훅 컨트랙트 (없으면 0)
}

// PoolId = keccak256(abi.encode(poolKey))
type PoolId is bytes32;`}</pre>
        <p>
          <strong>5개 필드로 풀 고유 식별</strong><br />
          같은 토큰 쌍 + 다른 fee + 다른 hook = 다른 풀<br />
          tickSpacing 자유화 — V3는 tier별 고정, V4는 임의 설정 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ETH 네이티브 지원</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// V2/V3: ETH → WETH 래핑 필수
// V4: Currency type으로 ETH 네이티브 지원

type Currency is address;

library CurrencyLibrary {
    function isNative(Currency currency) internal pure returns (bool) {
        return Currency.unwrap(currency) == address(0);
    }

    function transfer(Currency currency, address to, uint256 amount) internal {
        if (isNative(currency)) {
            // ETH 네이티브 전송
            (bool success, ) = to.call{value: amount}("");
            require(success, "ETH_TRANSFER_FAILED");
        } else {
            // ERC20 전송
            IERC20(Currency.unwrap(currency)).transfer(to, amount);
        }
    }
}`}</pre>
        <p>
          <strong>address(0) = 네이티브 ETH</strong> 규약<br />
          WETH 래핑/언래핑 불필요 — 가스 절감 + UX 개선<br />
          ERC20 인터페이스 호환 유지 — 라이브러리가 차이 흡수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pool 상태 관리 — library 패턴</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// PoolManager는 상태 저장, 로직은 Pool 라이브러리
library Pool {
    struct State {
        Slot0 slot0;                       // sqrtPriceX96, tick, protocolFee
        uint256 feeGrowthGlobal0X128;
        uint256 feeGrowthGlobal1X128;
        uint128 liquidity;
        mapping(int24 => TickInfo) ticks;
        mapping(int16 => uint256) tickBitmap;
        mapping(bytes32 => Position.Info) positions;
    }

    function swap(State storage self, SwapParams memory params) internal
        returns (BalanceDelta delta) {
        // ... V3와 유사한 swap 로직
    }

    function modifyLiquidity(State storage self, ...) internal returns (BalanceDelta delta) {
        // ... V3의 mint/burn을 대체
    }
}

// PoolManager
using Pool for Pool.State;

function swap(PoolKey memory key, SwapParams memory params) external returns (BalanceDelta delta) {
    PoolId id = key.toId();
    delta = pools[id].swap(params);  // library 함수 호출
    // ...
}`}</pre>
        <p>
          <strong>library 패턴</strong>: 상태는 PoolManager에, 로직은 Pool 라이브러리<br />
          <code>using Pool for Pool.State</code> — 상태 변수에 직접 메서드 호출 가능<br />
          코드 재사용·가독성 향상 — Solidity의 최신 패턴
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V2/V3/V4 비교 요약</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특징</th>
                <th className="border border-border px-3 py-2 text-left">V2</th>
                <th className="border border-border px-3 py-2 text-left">V3</th>
                <th className="border border-border px-3 py-2 text-left">V4</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">유동성</td>
                <td className="border border-border px-3 py-2">전 구간</td>
                <td className="border border-border px-3 py-2">Concentrated</td>
                <td className="border border-border px-3 py-2">Concentrated + Hooks</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">아키텍처</td>
                <td className="border border-border px-3 py-2">Pair/풀</td>
                <td className="border border-border px-3 py-2">Pool/풀</td>
                <td className="border border-border px-3 py-2">Singleton</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">수수료 tier</td>
                <td className="border border-border px-3 py-2">0.3% 고정</td>
                <td className="border border-border px-3 py-2">4 tier</td>
                <td className="border border-border px-3 py-2">자유 설정</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">LP 표현</td>
                <td className="border border-border px-3 py-2">ERC20</td>
                <td className="border border-border px-3 py-2">ERC721</td>
                <td className="border border-border px-3 py-2">ERC6909</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ETH 지원</td>
                <td className="border border-border px-3 py-2">WETH</td>
                <td className="border border-border px-3 py-2">WETH</td>
                <td className="border border-border px-3 py-2">네이티브</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">커스텀 로직</td>
                <td className="border border-border px-3 py-2">불가</td>
                <td className="border border-border px-3 py-2">불가</td>
                <td className="border border-border px-3 py-2">Hooks</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Singleton의 철학적 의미</p>
          <p>
            V4 Singleton은 단순 최적화가 아님 — <strong>패러다임 전환</strong>
          </p>
          <p className="mt-2">
            V2/V3: "각 페어는 독립 개체" — 페어마다 컨트랙트<br />
            V4: "풀은 데이터 구조" — 하나의 DEX 엔진 내 레코드
          </p>
          <p className="mt-2">
            이 전환이 가능하게 하는 것:<br />
            ✓ <strong>원자적 다중 풀 연산</strong>: 여러 풀 간 flash accounting<br />
            ✓ <strong>표준화된 진입점</strong>: 외부 프로토콜이 DEX 하나만 통합<br />
            ✓ <strong>거버넌스 단순화</strong>: 하나의 컨트랙트만 업그레이드 가능성
          </p>
          <p className="mt-2">
            트레이드오프: <strong>단일 실패 지점</strong> — PoolManager 버그가 전체 생태계 영향<br />
            이를 보완: Hooks로 리스크 격리, extensive 감사, immutable 코어
          </p>
        </div>

      </div>
    </section>
  );
}
