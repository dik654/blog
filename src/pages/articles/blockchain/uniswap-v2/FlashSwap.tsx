import FlashSwapViz from './viz/FlashSwapViz';
import FlashArbitrageViz from './viz/FlashArbitrageViz';
import TwapAccumulatorViz from './viz/TwapAccumulatorViz';

export default function FlashSwap() {
  return (
    <section id="flash-swap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Flash Swap &amp; TWAP 오라클</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Flash Swap — 담보 없는 임시 차입</h3>
        <p>
          Flash Swap: <strong>토큰을 먼저 받고 나중에 갚는</strong> Uniswap V2의 독특한 기능<br />
          같은 트랜잭션 내에서 갚지 않으면 revert — 원자적 보장<br />
          Flash Loan과 유사하지만 <strong>상대 토큰으로 갚을 수 있음</strong>
        </p>

        <FlashSwapViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">swap()의 data 파라미터 활용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 일반 swap: data 비어있음
pair.swap(amount0Out, amount1Out, to, new bytes(0));

// Flash swap: data에 콜백 정보 전달
pair.swap(amount0Out, amount1Out, myContract, abi.encode(arbitrageData));

// Pair 내부
if (data.length > 0) {
    IUniswapV2Callee(to).uniswapV2Call(
        msg.sender, amount0Out, amount1Out, data
    );
}
// 콜백 실행 후 k 검증`}</pre>
        <p>
          data가 비어있지 않으면 <strong>callback 실행</strong><br />
          to 주소는 <code>IUniswapV2Callee</code> 인터페이스 구현 필수<br />
          콜백 내에서 <strong>갚을 토큰을 Pair로 전송</strong>해야 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">차익거래 구현 예시</h3>

        <FlashArbitrageViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`contract Arbitrage is IUniswapV2Callee {
    // Uniswap과 SushiSwap 가격 차이 이용
    function arbitrage(address pair, uint amountOut) external {
        // 1) Uniswap Pair에서 WETH 먼저 받기 (담보 없음)
        IUniswapV2Pair(pair).swap(
            0, amountOut, address(this),
            abi.encode("trigger")  // 콜백 트리거
        );
    }

    // 콜백: Uniswap이 호출
    function uniswapV2Call(
        address sender, uint amount0, uint amount1, bytes calldata data
    ) external override {
        // 2) 받은 WETH를 SushiSwap에서 USDC로 스왑 (높은 가격)
        uint usdcGained = swapOnSushiswap(amount1);  // 1 WETH → 3100 USDC

        // 3) Uniswap에 상환할 USDC 계산
        uint usdcOwed = getAmountIn(amount1, pair);  // 1 WETH = 3000 USDC

        // 4) 상환 + 차익 실현
        IERC20(USDC).transfer(msg.sender, usdcOwed);
        profit = usdcGained - usdcOwed;  // 100 USDC 이익
    }
}`}</pre>
        <p>
          <strong>4단계 차익거래</strong>:<br />
          1. Uniswap에서 WETH 수령 (담보 없이)<br />
          2. SushiSwap에서 높은 가격에 매도<br />
          3. Uniswap에 갚을 USDC 계산<br />
          4. 상환 + 차익 (없으면 revert)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Flash Swap 수수료</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Flash swap도 일반 swap과 동일하게 0.3% 수수료
// 즉, 빌린 1 WETH를 갚으려면:
//   - 같은 토큰으로 갚기: 1.003 WETH
//   - 상대 토큰으로 갚기: 1 WETH에 해당하는 USDC + 0.3% 수수료

// 예시: 1 WETH 빌려서 같은 페어에 갚기
원래 reserve: x=3000 USDC, y=1 ETH (k=3000)
1 WETH 빌림: y → 0
갚을 때: (3000+Δx·0.997)(1) ≥ 3000
Δx ≥ 3009.03 USDC (3000/0.997)

=> 9.03 USDC 수수료`}</pre>
        <p>
          Flash Swap 수수료 = 일반 swap과 동일 (0.3%)<br />
          "공짜 대출" 아님 — 여전히 LP에게 수수료 지급<br />
          그래도 <strong>담보 없이 차입 가능</strong>하다는 점이 혁신
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TWAP 오라클 — Time-Weighted Average Price</h3>

        <TwapAccumulatorViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Pair 상태 저장
uint public price0CumulativeLast;  // Σ (price0 · timeElapsed)
uint public price1CumulativeLast;
uint32 private blockTimestampLast;

// 매 mint/swap/burn 시 업데이트
function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
    uint32 blockTimestamp = uint32(block.timestamp % 2**32);
    uint32 timeElapsed = blockTimestamp - blockTimestampLast;

    if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
        // Q112.112 고정소수점
        price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
        price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
    }

    reserve0 = uint112(balance0);
    reserve1 = uint112(balance1);
    blockTimestampLast = blockTimestamp;
}`}</pre>
        <p>
          <strong>price CumulativeLast</strong>: 가격 × 시간의 누적 합<br />
          Q112.112 고정소수점: 112비트 정수부 + 112비트 소수부 — 가격 정밀도 보장<br />
          매 reserve 변경 시 업데이트 — 누적 가격 히스토리 기록
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TWAP 계산 방법</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 외부 오라클 컨트랙트 예시
contract OracleExample {
    uint public price0CumulativeLast;
    uint public price1CumulativeLast;
    uint32 public blockTimestampLast;

    function update() external {
        (uint price0Cumulative, uint price1Cumulative, uint32 blockTimestamp) =
            UniswapV2OracleLibrary.currentCumulativePrices(pair);

        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        require(timeElapsed >= PERIOD, "PERIOD_NOT_ELAPSED");  // 예: 1시간

        // TWAP = (current - last) / timeElapsed
        price0Average = FixedPoint.uq112x112(
            uint224((price0Cumulative - price0CumulativeLast) / timeElapsed)
        );

        price0CumulativeLast = price0Cumulative;
        blockTimestampLast = blockTimestamp;
    }
}`}</pre>
        <p>
          <strong>외부에서 스냅샷 비교</strong>: 시작/종료 시점의 cumulative 차이 / 경과 시간 = 평균 가격<br />
          <strong>조작 어려움</strong>: 일정 기간 평균이므로 1블록 가격 조작 영향 작음<br />
          Compound, Aave 등이 청산 가격으로 TWAP 활용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TWAP vs Chainlink</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특징</th>
                <th className="border border-border px-3 py-2 text-left">Uniswap TWAP</th>
                <th className="border border-border px-3 py-2 text-left">Chainlink</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">데이터 출처</td>
                <td className="border border-border px-3 py-2">온체인 유동성</td>
                <td className="border border-border px-3 py-2">오프체인 피드</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">조작 비용</td>
                <td className="border border-border px-3 py-2">유동성 × 시간 비례</td>
                <td className="border border-border px-3 py-2">노드 다수 합의 필요</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">지연시간</td>
                <td className="border border-border px-3 py-2">TWAP 기간 (30분+)</td>
                <td className="border border-border px-3 py-2">heartbeat 수 초 ~ 분</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">저유동성 페어</td>
                <td className="border border-border px-3 py-2">조작 위험 ↑</td>
                <td className="border border-border px-3 py-2">피드 없음</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Flash Swap의 혁신적 의미</p>
          <p>
            Flash Swap은 Uniswap V2가 <strong>세상에 처음 보여준 개념</strong><br />
            이후 Flash Loan, MEV bot, 청산 인프라 모두 이 패턴 확장<br />
            핵심 혁신: <strong>"신뢰 없이도 담보 없는 차입 가능"</strong>
          </p>
          <p className="mt-2">
            가능한 이유:<br />
            ✓ EVM 원자성 — 트랜잭션 전체가 성공/실패<br />
            ✓ 콜백 패턴 — 빌리고 → 사용 → 갚기를 1 트랜잭션<br />
            ✓ k 불변식 검증 — 정확히 갚았는지 수학적 보장
          </p>
          <p className="mt-2">
            확장: Flash Loan(Aave), Atomic Arbitrage, Collateral Swap, Debt Refinancing<br />
            현대 DeFi의 자본 효율성이 Flash 개념에 크게 의존
          </p>
        </div>

      </div>
    </section>
  );
}
