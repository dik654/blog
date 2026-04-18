import TickCrossingViz from './viz/TickCrossingViz';
import SwapLoopViz from './viz/SwapLoopViz';
import GasCostViz from './viz/GasCostViz';

export default function SwapAlgorithm() {
  return (
    <section id="swap-algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Swap 알고리즘 — 틱 크로싱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TickCrossingViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">V3 Swap 복잡도</h3>
        <p>
          V2 swap: 단일 x·y=k 곡선에서 단 1회 계산으로 완료<br />
          V3 swap: 여러 "활성 유동성 구간"을 넘나듦 — <strong>tick crossing</strong> 발생<br />
          각 tick 경계 통과마다 유동성 L이 변화 (LP 진입/퇴출)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">swap() 진입점</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">swap() 함수 시그니처 &amp; 초기 상태</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">매개변수</p>
                <p><code className="text-xs bg-muted px-1 rounded">address recipient</code> — 수령자</p>
                <p><code className="text-xs bg-muted px-1 rounded">bool zeroForOne</code> — token0&rarr;token1 방향</p>
                <p><code className="text-xs bg-muted px-1 rounded">int256 amountSpecified</code> — 입력(+) / 출력(-)</p>
                <p><code className="text-xs bg-muted px-1 rounded">uint160 sqrtPriceLimitX96</code> — 가격 한계</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">SwapState 초기화</p>
                <p><code className="text-xs bg-muted px-1 rounded">amountSpecifiedRemaining</code> — 잔여 입력량</p>
                <p><code className="text-xs bg-muted px-1 rounded">sqrtPriceX96</code> — 현재 &radic;P</p>
                <p><code className="text-xs bg-muted px-1 rounded">tick</code> — 현재 tick</p>
                <p><code className="text-xs bg-muted px-1 rounded">liquidity</code> — 활성 유동성 L</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm border border-border">
              <p className="font-semibold text-xs text-muted-foreground mb-1">메인 루프 조건</p>
              <p><code className="text-xs">while (amountSpecifiedRemaining != 0 &amp;&amp; sqrtPriceX96 != sqrtPriceLimitX96)</code></p>
              <p className="text-xs text-muted-foreground mt-1">입력 양 소진 또는 가격 한계 도달 시까지 구간 순회</p>
            </div>
          </div>
        </div>
        <p>
          <strong>while 루프가 핵심</strong>: 입력 양 소진되거나 가격 한계 도달 시까지 반복<br />
          각 iteration이 <strong>한 tick 구간 처리</strong><br />
          <code>sqrtPriceLimitX96</code>: 슬리피지 보호 — 가격이 이 값 초과 시 중단
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">루프 내부 — 한 step 처리</h3>

        <SwapLoopViz />

        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">루프 6단계 — 한 iteration 처리</span>
          </div>
          <div className="p-5 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">1. 다음 tick 찾기</p>
                <p><code className="text-xs bg-background px-1 rounded">tickBitmap.nextInitializedTickWithinOneWord()</code></p>
                <p className="text-xs text-muted-foreground mt-1">비트맵에서 다음 유동성 경계 탐색</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">2. tick &rarr; &radic;P 변환</p>
                <p><code className="text-xs bg-background px-1 rounded">TickMath.getSqrtRatioAtTick(tickNext)</code></p>
                <p className="text-xs text-muted-foreground mt-1">목표 가격 계산</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">3. swap 계산</p>
                <p><code className="text-xs bg-background px-1 rounded">SwapMath.computeSwapStep()</code></p>
                <p className="text-xs text-muted-foreground mt-1">현재 구간 내 amountIn/Out/fee 도출</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">4. 잔여량 업데이트</p>
                <p className="text-xs"><code className="text-xs bg-background px-1 rounded">remaining -= amountIn + feeAmount</code></p>
                <p className="text-xs text-muted-foreground mt-1">소비된 입력량 차감</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">5. 수수료 누적</p>
                <p className="text-xs"><code className="text-xs bg-background px-1 rounded">feeGrowthGlobal += fee / L</code></p>
                <p className="text-xs text-muted-foreground mt-1">Q128 고정소수점으로 누적</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">6. tick crossing 체크</p>
                <p className="text-xs"><code className="text-xs bg-background px-1 rounded">ticks.cross() &rarr; liquidityNet</code></p>
                <p className="text-xs text-muted-foreground mt-1">경계 도달 시 L에 진입/퇴출 LP 반영</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>6단계 per iteration</strong>: 다음 tick 찾기 → 가격 변환 → 계산 → 잔여 업데이트 → 수수료 누적 → 크로싱 체크<br />
          crossing 시 <code>liquidityNet</code> 적용 — 해당 tick에서 시작/끝나는 포지션들의 L 변화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">computeSwapStep — 한 구간 내 계산</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">computeSwapStep() — 한 구간 내 계산</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">입력 매개변수</p>
                <p><code className="text-xs bg-muted px-1 rounded">sqrtRatioCurrentX96</code> — 현재 &radic;P</p>
                <p><code className="text-xs bg-muted px-1 rounded">sqrtRatioTargetX96</code> — 목표 &radic;P</p>
                <p><code className="text-xs bg-muted px-1 rounded">liquidity</code> — 활성 유동성 L</p>
                <p><code className="text-xs bg-muted px-1 rounded">amountRemaining</code> — 잔여 입력량</p>
                <p><code className="text-xs bg-muted px-1 rounded">feePips</code> — 수수료율 (ppm)</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">반환값</p>
                <p><code className="text-xs bg-muted px-1 rounded">sqrtRatioNextX96</code> — 결과 &radic;P</p>
                <p><code className="text-xs bg-muted px-1 rounded">amountIn</code> — 소비된 입력</p>
                <p><code className="text-xs bg-muted px-1 rounded">amountOut</code> — 산출된 출력</p>
                <p><code className="text-xs bg-muted px-1 rounded">feeAmount</code> — 수수료</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">시나리오 A: 입력 충분</p>
                <p className="text-sm"><code className="text-xs bg-background px-1 rounded">amountRemainingLessFee &ge; amountIn</code></p>
                <p className="text-xs text-muted-foreground mt-1">목표 가격 도달 &rarr; 다음 step 진행</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">시나리오 B: 입력 부족</p>
                <p className="text-sm"><code className="text-xs bg-background px-1 rounded">getNextSqrtPriceFromInput()</code></p>
                <p className="text-xs text-muted-foreground mt-1">중간 가격에서 멈춤 &rarr; 루프 종료</p>
              </div>
            </div>
            <p className="text-sm border-t border-border pt-2">수수료: <code className="text-xs bg-muted px-1 rounded">feeAmount = amountIn &times; feePips / (1e6 - feePips)</code> — 올림(roundingUp) 적용</p>
          </div>
        </div>
        <p>
          <strong>2가지 시나리오</strong>:<br />
          1. 입력 양이 충분 → 구간 끝까지 도달, 다음 step 진행<br />
          2. 입력 양 부족 → 중간에서 멈춤, 루프 종료
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">tick 크로싱 비용</h3>

        <GasCostViz />

        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Swap 가스 비용 분석</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">crossing 0회</p>
                <p className="font-semibold text-lg">~100K</p>
                <p className="text-xs text-muted-foreground">gas</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">+1회 추가</p>
                <p className="font-semibold text-lg">+10~20K</p>
                <p className="text-xs text-muted-foreground">gas</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">crossing 5회</p>
                <p className="font-semibold text-lg">~180K</p>
                <p className="text-xs text-muted-foreground">gas</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">crossing 10회</p>
                <p className="font-semibold text-lg">~280K</p>
                <p className="text-xs text-muted-foreground">gas</p>
              </div>
            </div>
            <div className="border-t border-border pt-3 text-sm">
              <p className="text-xs font-semibold text-muted-foreground mb-2">크로싱 빈번 상황</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>유동성이 분산된 풀 (수십 개 포지션, 작은 구간)</li>
                <li>변동성 큰 자산 (가격 급변)</li>
                <li>큰 스왑 (여러 구간 관통)</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>LP 구간이 조밀 → swap 가스 ↑</strong><br />
          Stable 페어(0.01% tier)는 LP들이 좁은 구간에 집중 → crossing 빈번 → 가스 ↑<br />
          이를 보완하기 위해 <code>tickSpacing=1</code>인 stable tier는 특별 최적화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MEV & slippage 보호 — sqrtPriceLimitX96</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Router — exactInputSingle() 슬리피지 보호</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">sqrtPriceLimitX96 처리</p>
                <p className="text-xs"><code className="text-xs bg-background px-1 rounded">== 0</code> &rarr; 한계 없음 (MIN/MAX_SQRT_RATIO 대체)</p>
                <p className="text-xs mt-1"><code className="text-xs bg-background px-1 rounded">!= 0</code> &rarr; 지정된 가격 한계 적용</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">출력 검증</p>
                <p className="text-xs"><code className="text-xs bg-background px-1 rounded">amountOut = uint256(-amount1)</code></p>
                <p className="text-xs mt-1"><code className="text-xs bg-background px-1 rounded">require(amountOut &ge; amountOutMinimum)</code></p>
                <p className="text-xs text-muted-foreground mt-1">미달 시 전체 트랜잭션 revert</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm border border-border">
              <p className="font-semibold text-xs text-muted-foreground mb-1">2중 보호 구조</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-semibold">Pool 레벨</p>
                  <p className="text-muted-foreground"><code className="bg-background px-1 rounded">sqrtPriceLimitX96</code> &rarr; 가격 도달 시 swap 중단</p>
                </div>
                <div>
                  <p className="font-semibold">Router 레벨</p>
                  <p className="text-muted-foreground"><code className="bg-background px-1 rounded">amountOutMinimum</code> &rarr; 출력 미달 시 revert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>2중 보호</strong>:<br />
          1. <code>sqrtPriceLimitX96</code>: pool 레벨 가격 한계 — 도달 시 swap 중단<br />
          2. <code>amountOutMinimum</code>: router 레벨 출력 검증 — 미달 시 revert
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: V3의 "계산 비용 vs 자본 효율" 트레이드오프</p>
          <p>
            V3는 V2 대비 <strong>50-200% 가스 증가</strong> 감수<br />
            대신 <strong>수십~수백 배 자본 효율</strong> 확보
          </p>
          <p className="mt-2">
            이 트레이드오프가 정당화되는 조건:<br />
            ✓ 유동성 규모가 큼 (swap당 가스 비용이 거래 대비 작음)<br />
            ✓ 거래 빈도 높음 (LP 수익 누적)<br />
            ✓ 정교한 LP 전략 가능 (알고리즘 기반 재조정)
          </p>
          <p className="mt-2">
            반대: 소규모 swap·저유동성 페어는 V2/V4가 유리<br />
            실제: <strong>ETH/USDC 같은 고유동성 페어는 V3가 압도적</strong>, exotic 페어는 V2가 더 많이 쓰임<br />
            V4의 hooks가 이 간극을 좁히려는 시도
          </p>
        </div>

      </div>
    </section>
  );
}
