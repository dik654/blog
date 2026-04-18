import M from '@/components/ui/math';
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
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">일반 swap</p>
              <p className="text-sm font-mono">pair.swap(amount0Out, amount1Out, to, <strong>new bytes(0)</strong>)</p>
              <p className="text-xs text-muted-foreground mt-1">data 비어있음 → 콜백 없음</p>
            </div>
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm mb-2">Flash swap</p>
              <p className="text-sm font-mono">pair.swap(amount0Out, amount1Out, myContract, <strong>abi.encode(data)</strong>)</p>
              <p className="text-xs text-muted-foreground mt-1">data 존재 → 콜백 트리거</p>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm mb-2">Pair 내부 분기</p>
            <p className="text-sm"><code>if (data.length &gt; 0)</code> → <code>IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data)</code></p>
            <p className="text-xs text-muted-foreground mt-1">콜백 실행 후 k 불변식 검증</p>
          </div>
        </div>
        <p>
          data가 비어있지 않으면 <strong>callback 실행</strong><br />
          to 주소는 <code>IUniswapV2Callee</code> 인터페이스 구현 필수<br />
          콜백 내에서 <strong>갚을 토큰을 Pair로 전송</strong>해야 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">차익거래 구현 예시</h3>

        <FlashArbitrageViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2"><code>Arbitrage</code> 컨트랙트 — <code>IUniswapV2Callee</code> 구현</p>
            <p className="text-sm"><code>arbitrage(pair, amountOut)</code>: Uniswap Pair에서 WETH를 담보 없이 수령</p>
            <p className="text-sm font-mono mt-1">pair.swap(0, amountOut, address(this), abi.encode("trigger"))</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>uniswapV2Call()</code> 콜백 — 4단계 차익거래</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Uniswap에서 WETH 수령 (담보 없이)</li>
              <li><code>swapOnSushiswap(amount1)</code> — 높은 가격에 매도 → <strong>3,100 USDC</strong></li>
              <li><code>getAmountIn(amount1, pair)</code> — 상환 필요: <strong>3,000 USDC</strong></li>
              <li><code>USDC.transfer(msg.sender, usdcOwed)</code> — 상환 + 차익 <strong>100 USDC</strong></li>
            </ol>
          </div>
        </div>
        <p>
          <strong>4단계 차익거래</strong>:<br />
          1. Uniswap에서 WETH 수령 (담보 없이)<br />
          2. SushiSwap에서 높은 가격에 매도<br />
          3. Uniswap에 갚을 USDC 계산<br />
          4. 상환 + 차익 (없으면 revert)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Flash Swap 수수료</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">같은 토큰으로 갚기</p>
              <p className="text-sm">1 WETH 빌림 → <strong>1.003 WETH</strong> 상환</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">상대 토큰으로 갚기</p>
              <p className="text-sm">1 WETH 해당 USDC + <strong>0.3% 수수료</strong></p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm mb-2">예시: 1 WETH 빌려서 같은 페어에 갚기</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>원래 reserve: <code>x=3000 USDC</code>, <code>y=1 ETH</code> (k=3000)</li>
              <li>1 WETH 빌림: y → 0</li>
              <li>갚을 때: <M>{'(3000 + \\Delta x \\cdot 0.997)(1) \\geq 3000'}</M></li>
              <li><M>{'\\Delta x \\geq 3000 / 0.997 = 3009.03'}</M> USDC</li>
              <li>수수료: <strong>9.03 USDC</strong></li>
            </ul>
          </div>
        </div>
        <p>
          Flash Swap 수수료 = 일반 swap과 동일 (0.3%)<br />
          "공짜 대출" 아님 — 여전히 LP에게 수수료 지급<br />
          그래도 <strong>담보 없이 차입 가능</strong>하다는 점이 혁신
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TWAP 오라클 — Time-Weighted Average Price</h3>

        <TwapAccumulatorViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1"><code>price0CumulativeLast</code></p>
              <p className="text-sm"><M>{'\\Sigma(\\text{price0} \\cdot \\text{timeElapsed})'}</M></p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1"><code>price1CumulativeLast</code></p>
              <p className="text-sm"><M>{'\\Sigma(\\text{price1} \\cdot \\text{timeElapsed})'}</M></p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1"><code>blockTimestampLast</code></p>
              <p className="text-sm">마지막 업데이트 시각</p>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2"><code>_update()</code> — 매 mint/swap/burn 시 호출</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>timeElapsed = blockTimestamp - blockTimestampLast</code></li>
              <li><code>timeElapsed &gt; 0</code>이면 누적 가격 업데이트</li>
              <li><code>UQ112x112.encode(reserve1).uqdiv(reserve0) * timeElapsed</code> — Q112.112 고정소수점</li>
              <li>reserve0, reserve1, blockTimestampLast 갱신</li>
            </ol>
          </div>
        </div>
        <p>
          <strong>price CumulativeLast</strong>: 가격 × 시간의 누적 합<br />
          Q112.112 고정소수점: 112비트 정수부 + 112비트 소수부 — 가격 정밀도 보장<br />
          매 reserve 변경 시 업데이트 — 누적 가격 히스토리 기록
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TWAP 계산 방법</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>OracleExample</code> — 외부 오라클 컨트랙트</p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <p><code>price0CumulativeLast</code></p>
              <p><code>price1CumulativeLast</code></p>
              <p><code>blockTimestampLast</code></p>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2"><code>update()</code> — TWAP 계산</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>currentCumulativePrices(pair)</code>로 현재 누적값 조회</li>
              <li><code>require(timeElapsed &gt;= PERIOD)</code> — 최소 기간 (예: 1시간) 경과 확인</li>
              <li>TWAP 계산: <M>{'\\text{price0Average} = \\frac{\\text{cumulative}_{now} - \\text{cumulative}_{last}}{\\text{timeElapsed}}'}</M></li>
              <li>스냅샷 저장 후 다음 주기 대기</li>
            </ol>
          </div>
        </div>
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
