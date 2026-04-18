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
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">Singleton 아키텍처 비교</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-950/30">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-2">V2/V3</p>
              <p className="text-muted-foreground">Factory가 각 페어마다 Pair 컨트랙트 배포</p>
              <p className="text-muted-foreground">ETH/USDC, DAI/USDC, USDC/USDT ... 각각 별개 컨트랙트</p>
              <p className="text-muted-foreground font-semibold mt-1">수천 개 Pair 컨트랙트 존재</p>
            </div>
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-950/30">
              <p className="font-semibold text-green-700 dark:text-green-400 mb-2">V4</p>
              <p className="text-muted-foreground"><code>PoolManager</code> 하나가 모든 풀 관리</p>
              <p className="text-muted-foreground">풀 상태는 <code>mapping(PoolId =&gt; Pool.State)</code>에 저장</p>
              <p className="text-muted-foreground font-semibold mt-1">새 풀 생성 = storage write만 (deploy 없음)</p>
            </div>
          </div>
          <div className="bg-background rounded-md p-3 border border-border text-sm mt-3">
            <p className="font-semibold mb-1">PoolManager 핵심 구조</p>
            <p className="text-muted-foreground"><code>mapping(PoolId =&gt; Pool.State) public pools</code></p>
            <p className="text-muted-foreground"><code>initialize(PoolKey memory key, uint160 sqrtPriceX96, bytes calldata hookData) → int24 tick</code></p>
          </div>
        </div>
        <p>
          <strong>풀 생성 비용 99% 절감</strong>: contract deploy ≈ 5M gas → storage write ≈ 50K gas<br />
          다중 홉 스왑 가스 대폭 감소 — 하나의 컨트랙트 내 여러 풀 순회<br />
          배포 비용 장벽 낮아져 <strong>exotic pair 활성화</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PoolKey — 풀 식별자</h3>

        <PoolKeyViz />

        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">PoolKey 구조체 — 풀 식별 5개 필드</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">Currency currency0</code>
              <p className="text-muted-foreground mt-1">token0 주소 (또는 ETH)</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">Currency currency1</code>
              <p className="text-muted-foreground mt-1">token1 주소</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">uint24 fee</code>
              <p className="text-muted-foreground mt-1">수수료 tier</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">int24 tickSpacing</code>
              <p className="text-muted-foreground mt-1">V3 대비 자유 선택 가능</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border sm:col-span-2">
              <code className="text-xs font-mono">IHooks hooks</code>
              <p className="text-muted-foreground mt-1">이 풀의 hook 컨트랙트 (없으면 address(0))</p>
            </div>
          </div>
          <div className="bg-background rounded-md p-3 border border-border text-sm mt-3">
            <p className="text-muted-foreground"><code>type PoolId is bytes32</code> = <code>keccak256(abi.encode(poolKey))</code></p>
          </div>
        </div>
        <p>
          <strong>5개 필드로 풀 고유 식별</strong><br />
          같은 토큰 쌍 + 다른 fee + 다른 hook = 다른 풀<br />
          tickSpacing 자유화 — V3는 tier별 고정, V4는 임의 설정 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ETH 네이티브 지원</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">CurrencyLibrary — ETH 네이티브 지원</p>
          <div className="bg-background rounded-md p-3 border border-border text-sm mb-3">
            <p className="text-muted-foreground"><code>type Currency is address</code> — V2/V3는 WETH 래핑 필수, V4는 네이티브 ETH 직접 사용</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold"><code>isNative(Currency)</code></p>
              <p className="text-muted-foreground mt-1"><code>Currency.unwrap(currency) == address(0)</code>이면 네이티브 ETH</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold"><code>transfer(Currency, address, uint256)</code></p>
              <p className="text-muted-foreground mt-1">네이티브 ETH면 <code>to.call&#123;value&#125;</code>, 아니면 <code>IERC20.transfer</code></p>
            </div>
          </div>
        </div>
        <p>
          <strong>address(0) = 네이티브 ETH</strong> 규약<br />
          WETH 래핑/언래핑 불필요 — 가스 절감 + UX 개선<br />
          ERC20 인터페이스 호환 유지 — 라이브러리가 차이 흡수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pool 상태 관리 — library 패턴</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">Pool 라이브러리 — 상태 구조 &amp; 로직 분리</p>
          <div className="bg-background rounded-md p-3 border border-border text-sm mb-3">
            <p className="font-semibold mb-2">Pool.State 구조체</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-muted-foreground">
              <p><code>Slot0 slot0</code> — sqrtPriceX96, tick, protocolFee</p>
              <p><code>uint256 feeGrowthGlobal0X128</code> — token0 수수료 누적</p>
              <p><code>uint256 feeGrowthGlobal1X128</code> — token1 수수료 누적</p>
              <p><code>uint128 liquidity</code> — 현재 유동성</p>
              <p><code>mapping(int24 =&gt; TickInfo) ticks</code></p>
              <p><code>mapping(int16 =&gt; uint256) tickBitmap</code></p>
              <p className="sm:col-span-2"><code>mapping(bytes32 =&gt; Position.Info) positions</code></p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold"><code>swap(State storage, SwapParams)</code></p>
              <p className="text-muted-foreground mt-1">V3와 유사한 swap 로직 — <code>BalanceDelta</code> 반환</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold"><code>modifyLiquidity(State storage, ...)</code></p>
              <p className="text-muted-foreground mt-1">V3의 mint/burn을 대체 — delta 부호로 추가/제거 결정</p>
            </div>
          </div>
          <div className="bg-background rounded-md p-3 border border-border text-sm mt-3">
            <p className="text-muted-foreground"><code>using Pool for Pool.State</code> — PoolManager에서 <code>pools[id].swap(params)</code>로 라이브러리 함수 직접 호출</p>
          </div>
        </div>
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
