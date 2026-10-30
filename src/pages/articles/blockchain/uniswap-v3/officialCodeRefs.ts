import type { CodeRef } from "@/components/code/types";

export const officialUniswapV3CodeRefs: Record<string, CodeRef> = {
  "v3-swap-loop": {
    path: "contracts/UniswapV3Pool.sol",
    lang: "solidity",
    highlight: [1, 40],
    desc: "v3-core v1.0.0 commit e3589b1 · 다음 initialized tick을 찾고 한 step을 계산한 뒤 liquidity를 바꾸는 실제 swap loop입니다.",
    code: `while (state.amountSpecifiedRemaining != 0 && state.sqrtPriceX96 != sqrtPriceLimitX96) {
    StepComputations memory step;
    step.sqrtPriceStartX96 = state.sqrtPriceX96;

    (step.tickNext, step.initialized) = tickBitmap.nextInitializedTickWithinOneWord(
        state.tick,
        tickSpacing,
        zeroForOne
    );
    step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);

    (state.sqrtPriceX96, step.amountIn, step.amountOut, step.feeAmount) =
        SwapMath.computeSwapStep(
            state.sqrtPriceX96,
            (zeroForOne
                ? step.sqrtPriceNextX96 < sqrtPriceLimitX96
                : step.sqrtPriceNextX96 > sqrtPriceLimitX96)
                    ? sqrtPriceLimitX96
                    : step.sqrtPriceNextX96,
            state.liquidity,
            state.amountSpecifiedRemaining,
            fee
        );

    if (exactInput) {
        state.amountSpecifiedRemaining -= (step.amountIn + step.feeAmount).toInt256();
        state.amountCalculated = state.amountCalculated.sub(step.amountOut.toInt256());
    } else {
        state.amountSpecifiedRemaining += step.amountOut.toInt256();
        state.amountCalculated = state.amountCalculated.add((step.amountIn + step.feeAmount).toInt256());
    }

    if (state.sqrtPriceX96 == step.sqrtPriceNextX96 && step.initialized) {
        int128 liquidityNet = ticks.cross(/* current accumulators */);
        if (zeroForOne) liquidityNet = -liquidityNet;
        state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet);
    }
}`,
    annotations: [
      { lines: [1, 9], color: "sky", note: "남은 양과 price limit가 있는 동안 bitmap에서 진행 방향의 다음 initialized tick을 찾습니다." },
      { lines: [10, 24], color: "emerald", note: "다음 tick과 사용자가 정한 price limit 중 먼저 닿는 곳을 target으로 한 step만 계산합니다." },
      { lines: [26, 32], color: "amber", note: "정확입력과 정확출력은 남은 양의 부호와 누적 방식을 다르게 갱신합니다." },
      { lines: [34, 39], color: "violet", note: "경계에 실제로 도달했고 initialized라면 방향에 맞춰 liquidityNet을 반영합니다." },
    ],
  },
  "v3-compute-step": {
    path: "contracts/libraries/SwapMath.sol",
    lang: "solidity",
    highlight: [1, 39],
    desc: "같은 commit · 정확입력에서 fee를 제외한 양으로 target 도달 여부와 다음 sqrt price를 계산합니다.",
    code: `bool zeroForOne = sqrtRatioCurrentX96 >= sqrtRatioTargetX96;
bool exactIn = amountRemaining >= 0;

if (exactIn) {
    uint256 amountRemainingLessFee =
        FullMath.mulDiv(uint256(amountRemaining), 1e6 - feePips, 1e6);
    amountIn = zeroForOne
        ? SqrtPriceMath.getAmount0Delta(
            sqrtRatioTargetX96, sqrtRatioCurrentX96, liquidity, true
        )
        : SqrtPriceMath.getAmount1Delta(
            sqrtRatioCurrentX96, sqrtRatioTargetX96, liquidity, true
        );
    if (amountRemainingLessFee >= amountIn) {
        sqrtRatioNextX96 = sqrtRatioTargetX96;
    } else {
        sqrtRatioNextX96 = SqrtPriceMath.getNextSqrtPriceFromInput(
            sqrtRatioCurrentX96,
            liquidity,
            amountRemainingLessFee,
            zeroForOne
        );
    }
}

bool max = sqrtRatioTargetX96 == sqrtRatioNextX96;
// amountIn and amountOut are recomputed here with direction-specific rounding.

if (exactIn && sqrtRatioNextX96 != sqrtRatioTargetX96) {
    feeAmount = uint256(amountRemaining) - amountIn;
} else {
    feeAmount = FullMath.mulDivRoundingUp(amountIn, feePips, 1e6 - feePips);
}`,
    annotations: [
      { lines: [1, 6], color: "sky", note: "feePips는 백만분율입니다. 정확입력은 먼저 수수료를 뺀 순입력을 구합니다." },
      { lines: [7, 22], color: "emerald", note: "순입력이 target까지 충분하면 target에 닿고, 부족하면 입력이 소진되는 중간 sqrt price에서 멈춥니다." },
      { lines: [25, 32], color: "amber", note: "target에 못 닿은 정확입력 step은 남은 최대 입력과 실제 amountIn의 차이를 fee로 처리합니다." },
    ],
  },
  "v3-tick-cross": {
    path: "contracts/libraries/Tick.sol",
    lang: "solidity",
    highlight: [1, 19],
    desc: "같은 commit · initialized tick을 넘을 때 바깥쪽 누적값을 뒤집고 liquidityNet을 반환합니다.",
    code: `function cross(
    mapping(int24 => Tick.Info) storage self,
    int24 tick,
    uint256 feeGrowthGlobal0X128,
    uint256 feeGrowthGlobal1X128,
    uint160 secondsPerLiquidityCumulativeX128,
    int56 tickCumulative,
    uint32 time
) internal returns (int128 liquidityNet) {
    Tick.Info storage info = self[tick];
    info.feeGrowthOutside0X128 =
        feeGrowthGlobal0X128 - info.feeGrowthOutside0X128;
    info.feeGrowthOutside1X128 =
        feeGrowthGlobal1X128 - info.feeGrowthOutside1X128;
    info.secondsPerLiquidityOutsideX128 =
        secondsPerLiquidityCumulativeX128 - info.secondsPerLiquidityOutsideX128;
    info.tickCumulativeOutside = tickCumulative - info.tickCumulativeOutside;
    info.secondsOutside = time - info.secondsOutside;
    liquidityNet = info.liquidityNet;
}`,
    annotations: [
      { lines: [10, 17], color: "violet", note: "global−기존 outside로 바꾸면 같은 한 값이 경계의 반대쪽 누적을 나타냅니다." },
      { lines: [18, 19], color: "emerald", note: "Pool.swap이 반환된 liquidityNet의 부호를 진행 방향에 맞춰 해석합니다." },
    ],
  },
  "v3-position-update": {
    path: "contracts/libraries/Position.sol",
    lang: "solidity",
    highlight: [1, 31],
    desc: "같은 commit · position이 마지막 snapshot 이후의 inside fee growth를 tokensOwed에 반영하는 실제 코드입니다.",
    code: `function update(
    Info storage self,
    int128 liquidityDelta,
    uint256 feeGrowthInside0X128,
    uint256 feeGrowthInside1X128
) internal {
    Info memory _self = self;
    uint128 liquidityNext;
    if (liquidityDelta == 0) {
        require(_self.liquidity > 0, 'NP');
        liquidityNext = _self.liquidity;
    } else {
        liquidityNext = LiquidityMath.addDelta(_self.liquidity, liquidityDelta);
    }

    uint128 tokensOwed0 = uint128(FullMath.mulDiv(
        feeGrowthInside0X128 - _self.feeGrowthInside0LastX128,
        _self.liquidity,
        FixedPoint128.Q128
    ));
    uint128 tokensOwed1 = uint128(FullMath.mulDiv(
        feeGrowthInside1X128 - _self.feeGrowthInside1LastX128,
        _self.liquidity,
        FixedPoint128.Q128
    ));

    if (liquidityDelta != 0) self.liquidity = liquidityNext;
    self.feeGrowthInside0LastX128 = feeGrowthInside0X128;
    self.feeGrowthInside1LastX128 = feeGrowthInside1X128;
    if (tokensOwed0 > 0 || tokensOwed1 > 0) {
        self.tokensOwed0 += tokensOwed0;
        self.tokensOwed1 += tokensOwed1;
    }
}`,
    annotations: [
      { lines: [7, 14], color: "sky", note: "유동성 변경이 0인 poke도 기존 position이 있어야 하며 현재 liquidity를 유지합니다." },
      { lines: [16, 24], color: "emerald", note: "직전 inside snapshot 이후 증가분에 기존 liquidity를 곱하고 Q128 배율을 나눕니다." },
      { lines: [26, 31], color: "amber", note: "새 snapshot을 저장하고 계산된 양만 tokensOwed에 누적합니다. swap 순간에 NFT로 자동 전송하지 않습니다." },
    ],
  },
  "v3-callback-settlement": {
    path: "contracts/UniswapV3Pool.sol",
    lang: "solidity",
    highlight: [1, 17],
    desc: "같은 commit · output을 보낸 뒤 callback으로 실제 input 잔액 증가를 확인하는 원자적 settlement 경계입니다.",
    code: `if (zeroForOne) {
    if (amount1 < 0) {
        TransferHelper.safeTransfer(token1, recipient, uint256(-amount1));
    }
    uint256 balance0Before = balance0();
    IUniswapV3SwapCallback(msg.sender).uniswapV3SwapCallback(amount0, amount1, data);
    require(balance0Before.add(uint256(amount0)) <= balance0(), 'IIA');
} else {
    if (amount0 < 0) {
        TransferHelper.safeTransfer(token0, recipient, uint256(-amount0));
    }
    uint256 balance1Before = balance1();
    IUniswapV3SwapCallback(msg.sender).uniswapV3SwapCallback(amount0, amount1, data);
    require(balance1Before.add(uint256(amount1)) <= balance1(), 'IIA');
}

emit Swap(msg.sender, recipient, amount0, amount1, state.sqrtPriceX96, state.liquidity, state.tick);`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "token0→token1 방향은 token1을 먼저 보내고 callback 뒤 token0 잔액을 확인합니다." },
      { lines: [8, 14], color: "emerald", note: "반대 방향은 token0을 먼저 보내고 token1 잔액 증가를 확인합니다." },
      { lines: [15, 17], color: "rose", note: "입력이 부족하면 IIA로 전체 호출이 revert되므로 앞선 가격·fee 변화도 남지 않습니다." },
    ],
  },
};
