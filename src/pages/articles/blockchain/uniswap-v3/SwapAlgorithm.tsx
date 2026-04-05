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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function swap(
    address recipient,
    bool zeroForOne,           // token0→token1 방향
    int256 amountSpecified,    // 입력(+) 또는 출력(-) 지정
    uint160 sqrtPriceLimitX96, // 가격 한계
    bytes calldata data
) external returns (int256 amount0, int256 amount1) {
    SwapState memory state = SwapState({
        amountSpecifiedRemaining: amountSpecified,
        amountCalculated: 0,
        sqrtPriceX96: slot0.sqrtPriceX96,
        tick: slot0.tick,
        feeGrowthGlobalX128: zeroForOne ? feeGrowthGlobal0X128 : feeGrowthGlobal1X128,
        protocolFee: 0,
        liquidity: liquidity
    });

    // 메인 루프: 유동성이 있는 모든 구간 순회
    while (state.amountSpecifiedRemaining != 0
           && state.sqrtPriceX96 != sqrtPriceLimitX96) {
        // ... tick crossing 루프
    }
}`}</pre>
        <p>
          <strong>while 루프가 핵심</strong>: 입력 양 소진되거나 가격 한계 도달 시까지 반복<br />
          각 iteration이 <strong>한 tick 구간 처리</strong><br />
          <code>sqrtPriceLimitX96</code>: 슬리피지 보호 — 가격이 이 값 초과 시 중단
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">루프 내부 — 한 step 처리</h3>

        <SwapLoopViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`while (state.amountSpecifiedRemaining != 0
       && state.sqrtPriceX96 != sqrtPriceLimitX96) {
    StepComputations memory step;
    step.sqrtPriceStartX96 = state.sqrtPriceX96;

    // 1) 다음 초기화된 tick 찾기
    (step.tickNext, step.initialized) = tickBitmap.nextInitializedTickWithinOneWord(
        state.tick, tickSpacing, zeroForOne
    );

    // 2) tick을 가격으로 변환
    step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);

    // 3) 현재 step에서 swap 계산
    (state.sqrtPriceX96, step.amountIn, step.amountOut, step.feeAmount) =
        SwapMath.computeSwapStep(
            state.sqrtPriceX96,
            step.sqrtPriceNextX96,
            state.liquidity,
            state.amountSpecifiedRemaining,
            fee
        );

    // 4) 잔여량 업데이트
    state.amountSpecifiedRemaining -= int256(step.amountIn + step.feeAmount);
    state.amountCalculated -= int256(step.amountOut);

    // 5) 수수료 누적
    if (state.liquidity > 0) {
        state.feeGrowthGlobalX128 += FullMath.mulDiv(
            step.feeAmount, FixedPoint128.Q128, state.liquidity
        );
    }

    // 6) tick crossing 발생?
    if (state.sqrtPriceX96 == step.sqrtPriceNextX96) {
        if (step.initialized) {
            int128 liquidityNet = ticks.cross(step.tickNext, state.feeGrowthGlobalX128);
            state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);
        }
        state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext;
    } else {
        state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96);
    }
}`}</pre>
        <p>
          <strong>6단계 per iteration</strong>: 다음 tick 찾기 → 가격 변환 → 계산 → 잔여 업데이트 → 수수료 누적 → 크로싱 체크<br />
          crossing 시 <code>liquidityNet</code> 적용 — 해당 tick에서 시작/끝나는 포지션들의 L 변화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">computeSwapStep — 한 구간 내 계산</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function computeSwapStep(
    uint160 sqrtRatioCurrentX96,
    uint160 sqrtRatioTargetX96,
    uint128 liquidity,
    int256 amountRemaining,
    uint24 feePips
) internal pure returns (
    uint160 sqrtRatioNextX96,
    uint256 amountIn, uint256 amountOut, uint256 feeAmount
) {
    bool exactIn = amountRemaining >= 0;
    bool zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96;

    if (exactIn) {
        // 수수료 제외한 입력 양
        uint256 amountRemainingLessFee =
            FullMath.mulDiv(uint256(amountRemaining), 1e6 - feePips, 1e6);

        // 목표 가격까지 도달하기 위한 입력 양
        amountIn = zeroForOne
            ? SqrtPriceMath.getAmount0Delta(sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true)
            : SqrtPriceMath.getAmount1Delta(sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true);

        if (amountRemainingLessFee >= amountIn) {
            // 목표 가격 도달 가능
            sqrtRatioNextX96 = sqrtRatioTargetX96;
        } else {
            // 입력 양이 부족 — 목표 미달
            sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(
                sqrtRatioCurrentX96, liquidity, amountRemainingLessFee, zeroForOne
            );
        }
    }
    // exactOut 케이스 ...

    // 최종 amountIn/amountOut 재계산
    // 수수료 계산
    feeAmount = FullMath.mulDivRoundingUp(amountIn, feePips, 1e6 - feePips);
}`}</pre>
        <p>
          <strong>2가지 시나리오</strong>:<br />
          1. 입력 양이 충분 → 구간 끝까지 도달, 다음 step 진행<br />
          2. 입력 양 부족 → 중간에서 멈춤, 루프 종료
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">tick 크로싱 비용</h3>

        <GasCostViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// V3 swap 가스 비용 분석

기본 swap (crossing 0회):    ~100K gas
crossing 1회 추가:           ~10-20K gas 추가
crossing 5회:                ~180K gas
crossing 10회:               ~280K gas

// 크로싱이 많이 발생하는 상황
- 유동성이 분산된 풀 (수십 개 포지션, 작은 구간)
- 변동성 큰 자산 (가격 급변)
- 큰 스왑 (여러 구간 관통)`}</pre>
        <p>
          <strong>LP 구간이 조밀 → swap 가스 ↑</strong><br />
          Stable 페어(0.01% tier)는 LP들이 좁은 구간에 집중 → crossing 빈번 → 가스 ↑<br />
          이를 보완하기 위해 <code>tickSpacing=1</code>인 stable tier는 특별 최적화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MEV & slippage 보호 — sqrtPriceLimitX96</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Router에서 slippage 계산
function exactInputSingle(ExactInputSingleParams calldata params) external {
    // sqrtPriceLimitX96 = 0 이면 한계 없음 (Router가 amountOutMin으로 보호)
    // 또는 현재 가격에서 허용 편차 계산
    uint160 limit = params.sqrtPriceLimitX96 == 0
        ? (zeroForOne ? MIN_SQRT_RATIO + 1 : MAX_SQRT_RATIO - 1)
        : params.sqrtPriceLimitX96;

    (int256 amount0, int256 amount1) = IUniswapV3Pool(pool).swap(
        params.recipient,
        zeroForOne,
        int256(params.amountIn),
        limit,
        abi.encode(data)
    );

    amountOut = uint256(-amount1);  // token1 방향 스왑
    require(amountOut >= params.amountOutMinimum, "Too little received");
}`}</pre>
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
