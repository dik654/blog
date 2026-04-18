import AbsorbViz from './viz/AbsorbViz';
import AbsorbViz2 from './viz/AbsorbViz2';
import AbsorbInternalsViz from './viz/AbsorbInternalsViz';
import BuyCollateralViz from './viz/BuyCollateralViz';
import AbsorberCompareViz from './viz/AbsorberCompareViz';
import IsLiquidatableViz from './viz/IsLiquidatableViz';
import TargetReservesViz from './viz/TargetReservesViz';

export default function Liquidation() {
  return (
    <section id="liquidation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">청산 흐름 &amp; Absorb 메커니즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <AbsorbViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Absorb — V3의 고유한 청산 방식</h3>

        <AbsorbViz2 />

        <p>
          Aave/Compound V2: 청산자가 직접 담보 매입 (bonus 받음)<br />
          Compound V3: <strong>Absorb + buyCollateral 2단계</strong><br />
          프로토콜이 먼저 청산 부채를 "흡수"한 뒤 담보를 할인 판매
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">absorb() — 1단계: 부채 흡수</h3>

        <AbsorbInternalsViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4 space-y-4">
          <div>
            <p className="font-semibold text-sm mb-3"><code className="text-xs">absorb()</code> — 외부 진입점</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">1</span>
                <div><code className="text-xs">accrueInternal()</code> — 이자 index 먼저 갱신</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">2</span>
                <div>대상 <code className="text-xs">accounts[]</code> 순회하며 <code className="text-xs">absorbInternal()</code> 호출</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">3</span>
                <div><code className="text-xs">gasUsed * baseTokenPriceFeed * priorityFeeBonus</code> — absorber에게 가스 보상</div>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3"><code className="text-xs">absorbInternal()</code> — 핵심 청산 로직</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">A</span>
                <div><code className="text-xs">isLiquidatable(account)</code> 확인 — 청산 불가능하면 revert</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">B</span>
                <div>모든 담보 순회: <code className="text-xs">userCollateral[account][asset].balance = 0</code> 후 <code className="text-xs">totalReserves[asset] += balance</code> — 프로토콜이 흡수</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">C</span>
                <div>부채 청산: <code className="text-xs">principal = principalValue(collateralValue - repaidBalance)</code> — 포지션 리셋</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>absorb 단계</strong>: 프로토콜이 담보를 모두 가져가고 부채 0으로<br />
          사용자의 포지션 완전 청산 — principal은 new 담보 가치로 리셋<br />
          absorber(제3자)는 gas 보상만 받음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">buyCollateral() — 2단계: 담보 판매</h3>

        <BuyCollateralViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4 space-y-4">
          <div>
            <p className="font-semibold text-sm mb-3"><code className="text-xs">buyCollateral()</code> — 할인 담보 구매</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">1</span>
                <div>파라미터: <code className="text-xs">asset</code>(구매할 담보), <code className="text-xs">minAmount</code>(최소 수량), <code className="text-xs">baseAmount</code>(지불할 base), <code className="text-xs">recipient</code></div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">2</span>
                <div><code className="text-xs">quoteCollateral(asset, baseAmount)</code> — 할인 가격으로 받을 담보 수량 계산</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">3</span>
                <div><code className="text-xs">doTransferIn(baseToken, msg.sender, baseAmount)</code> — base asset 입금</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">4</span>
                <div><code className="text-xs">doTransferOut(asset, recipient, collateralAmount)</code> — 할인 담보 전송</div>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2"><code className="text-xs">quoteCollateral()</code> — 할인 가격 산출</p>
            <div className="bg-background border border-border rounded p-3 text-sm space-y-1">
              <p><code className="text-xs">assetWeiPerUnitBase = assetPrice * 1e18 / basePrice</code></p>
              <p><code className="text-xs">discountedPrice = assetWeiPerUnitBase * storeFrontPriceFactor / FACTOR_SCALE</code></p>
              <p className="text-muted-foreground text-xs mt-2"><code>storeFrontPriceFactor</code>: 할인율 (보통 0-5%)</p>
            </div>
          </div>
        </div>
        <p>
          <strong>storefront 모델</strong>: 프로토콜이 할인된 가격에 담보 판매<br />
          아무나 구매 가능 — permissionless marketplace<br />
          <code>storeFrontPriceFactor</code>: 할인율 (보통 0-5%)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Absorb 장점 — 청산자 관점</h3>

        <AbsorberCompareViz />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Aave V2/V3 청산</p>
            <p className="text-xs text-muted-foreground mb-2">필요 자본: 부채 금액만큼 base asset</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>base asset 준비 (예: 10,000 USDC)</li>
              <li>flash loan 사용 가능</li>
              <li><code className="text-xs">liquidationCall()</code> 호출</li>
              <li>담보 받음 + 매도</li>
            </ol>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Compound V3 absorb</p>
            <p className="text-xs text-muted-foreground mb-2">필요 자본: 0 (gas만)</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code className="text-xs">absorb()</code> 호출 — 가스만 지불</li>
              <li>프로토콜이 부채 흡수, 담보 획득</li>
              <li>absorber는 gas 보상 수령</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3 mb-1">buyCollateral 단계 (선택)</p>
            <ol className="text-sm space-y-1 list-decimal list-inside" start={4}>
              <li>누군가 base asset으로 할인 담보 구매</li>
              <li>차익거래 기회 (할인 &lt; 시장 가격)</li>
            </ol>
          </div>
        </div>
        <p>
          <strong>absorb는 capital-free</strong>: 가스만 있으면 누구나 호출<br />
          Aave는 청산 자본(debt 전액) 필요 → flash loan 필수<br />
          V3는 <strong>"청산 자동화"</strong> 용이
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">isLiquidatable() — 청산 가능 판정</h3>

        <IsLiquidatableViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs">isLiquidatable()</code> — 청산 판정 로직</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">1</span>
              <div><code className="text-xs">presentValue(principal)</code> &ge; 0 이면 <code className="text-xs">false</code> — 차입 없으면 청산 불가</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">2</span>
              <div><code className="text-xs">assetsIn</code> bitmap 순회하며 각 담보의 <code className="text-xs">balance * price * liquidateCollateralFactor</code> 합산</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">3</span>
              <div><code className="text-xs">debt &gt; liquidationThreshold</code> 이면 <code className="text-xs">true</code> — 청산 가능</div>
            </div>
          </div>
          <div className="mt-3 bg-background border border-border rounded p-3 text-sm">
            <p className="text-muted-foreground text-xs">예시 — WETH: borrow factor 83%, liquidate factor 90%</p>
            <p className="text-xs">83% 초과 시 추가 차입 불가, 90% 초과 시 청산 가능</p>
          </div>
        </div>
        <p>
          <strong>liquidateCollateralFactor 기준</strong>: borrow factor보다 높음<br />
          예: WETH borrow 83%, liquidate 90%<br />
          83% 초과 시 차입 불가, 90% 초과 시 청산 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Target Reserves — 담보 관리</h3>

        <TargetReservesViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">Reserve 관리 흐름</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div><code className="text-xs">targetReserves</code> = DAO가 설정한 목표 reserve 수준</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div><code className="text-xs">totalReserves &gt; targetReserves * SELL_THRESHOLD</code> 이면 초과분 DEX 매도 — base asset 확보 후 treasury로</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>DAO가 <code className="text-xs">totalReserves[asset]</code> 모니터링 후 reserve 조정 결정</div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Absorb의 경제적 의미</p>
          <p>
            Absorb는 <strong>청산을 2단계로 분리</strong>:<br />
            1. 즉각 청산 (프로토콜 = 임시 buyer)<br />
            2. 할인 판매 (permissionless market)
          </p>
          <p className="mt-2">
            <strong>이점</strong>:<br />
            ✓ 청산 속도 ↑ (capital requirement 제거)<br />
            ✓ Bad debt 발생 가능성 ↓<br />
            ✓ 담보 할인 판매로 자연스러운 가격 조정<br />
            ✓ 누구나 absorber 가능 → 탈중앙화
          </p>
          <p className="mt-2">
            <strong>위험</strong>:<br />
            ✗ 프로토콜이 일시적 담보 보유 (가격 변동 리스크)<br />
            ✗ Storefront 판매 지연 시 bad debt 가능
          </p>
          <p className="mt-2">
            Aave의 "bounty-based"와 Compound V3의 "storefront-based"는<br />
            <strong>동일 문제의 다른 접근</strong> — 생태계가 선택
          </p>
        </div>

      </div>
    </section>
  );
}
