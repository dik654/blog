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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function absorb(address absorber, address[] calldata accounts) external {
    uint startGas = gasleft();
    accrueInternal();

    for (uint i = 0; i < accounts.length; ) {
        absorbInternal(absorber, accounts[i]);
        unchecked { i++; }
    }

    uint gasUsed = startGas - gasleft();
    uint256 bonus = gasUsed * baseTokenPriceFeed * priorityFeeBonus;
    // absorber에게 가스 보상
}

function absorbInternal(address absorber, address account) internal {
    require(!isLiquidatable(account), "NotLiquidatable");

    int104 oldPrincipal = userBasic[account].principal;
    int256 oldBalance = presentValue(oldPrincipal);

    // 모든 담보를 프로토콜 storefront로 이전
    uint128 totalCollateralValue = 0;
    for (uint8 i = 0; i < numAssets; i++) {
        address asset = assetAddr[i];
        uint128 balance = userCollateral[account][asset].balance;
        if (balance > 0) {
            userCollateral[account][asset].balance = 0;
            totalReserves[asset] += balance;  // 프로토콜이 흡수
            totalCollateralValue += getAssetValue(asset, balance);
        }
    }

    // 부채 청산
    uint104 newBalance = totalCollateralValue;
    uint104 repaidBalance = uint104(-oldBalance);
    userBasic[account].principal = principalValue(int256(newBalance - repaidBalance));
}`}</pre>
        <p>
          <strong>absorb 단계</strong>: 프로토콜이 담보를 모두 가져가고 부채 0으로<br />
          사용자의 포지션 완전 청산 — principal은 new 담보 가치로 리셋<br />
          absorber(제3자)는 gas 보상만 받음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">buyCollateral() — 2단계: 담보 판매</h3>

        <BuyCollateralViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function buyCollateral(
    address asset, uint minAmount, uint baseAmount, address recipient
) external {
    accrueInternal();

    uint128 reserves = totalReserves[asset];
    require(reserves > 0, "NoCollateralAvailable");

    // 할인 가격 계산
    uint collateralAmount = quoteCollateral(asset, baseAmount);
    require(collateralAmount >= minAmount, "TooMuchSlippage");
    require(collateralAmount <= reserves, "InsufficientReserves");

    // base asset 입금
    doTransferIn(baseToken, msg.sender, baseAmount);

    // 담보 전송
    totalReserves[asset] -= uint128(collateralAmount);
    doTransferOut(asset, recipient, collateralAmount);
}

function quoteCollateral(address asset, uint baseAmount) public view returns (uint) {
    uint assetPrice = getPrice(assetInfo.priceFeed);
    uint basePrice = getPrice(baseTokenPriceFeed);

    // 할인 적용 (storeFrontPriceFactor)
    uint assetWeiPerUnitBase = assetPrice * 1e18 / basePrice;
    uint discountedPrice = assetWeiPerUnitBase * storeFrontPriceFactor / FACTOR_SCALE;

    return baseAmount * discountedPrice / baseScale;
}`}</pre>
        <p>
          <strong>storefront 모델</strong>: 프로토콜이 할인된 가격에 담보 판매<br />
          아무나 구매 가능 — permissionless marketplace<br />
          <code>storeFrontPriceFactor</code>: 할인율 (보통 0-5%)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Absorb 장점 — 청산자 관점</h3>

        <AbsorberCompareViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Aave V2/V3 청산
청산자 필요 자본: 부채 금액만큼 base asset
단계:
  1. base asset 준비 (예: 10,000 USDC)
  2. flash loan 사용 가능
  3. liquidationCall() 호출
  4. 담보 받음 + 매도

// Compound V3 absorb
청산자 필요 자본: 0 (gas만)
단계:
  1. absorb() 호출 → 가스만 지불
  2. 프로토콜이 부채 흡수, 담보 획득
  3. 사용자는 흡수 대가로 gas 보상

// buyCollateral 단계 (선택)
4. 누군가 base asset으로 할인 담보 구매
5. 차익거래 기회 (할인 가격 < 시장 가격)`}</pre>
        <p>
          <strong>absorb는 capital-free</strong>: 가스만 있으면 누구나 호출<br />
          Aave는 청산 자본(debt 전액) 필요 → flash loan 필수<br />
          V3는 <strong>"청산 자동화"</strong> 용이
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">isLiquidatable() — 청산 가능 판정</h3>

        <IsLiquidatableViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function isLiquidatable(address account) public view returns (bool) {
    int256 balance = presentValue(userBasic[account].principal);
    if (balance >= 0) return false;  // 차입 없으면 불가

    uint liquidationThreshold = 0;
    uint16 assetsIn = userBasic[account].assetsIn;

    for (uint8 i = 0; i < numAssets; i++) {
        if (isInAsset(assetsIn, i)) {
            AssetInfo memory asset = getAssetInfo(i);
            uint128 balance = userCollateral[account][asset.asset].balance;
            uint price = getPrice(asset.priceFeed);

            // liquidateCollateralFactor 사용
            liquidationThreshold += balance * price / asset.scale
                * asset.liquidateCollateralFactor / FACTOR_SCALE;
        }
    }

    uint debt = uint(-balance);
    return debt > liquidationThreshold;
}`}</pre>
        <p>
          <strong>liquidateCollateralFactor 기준</strong>: borrow factor보다 높음<br />
          예: WETH borrow 83%, liquidate 90%<br />
          83% 초과 시 차입 불가, 90% 초과 시 청산 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Target Reserves — 담보 관리</h3>

        <TargetReservesViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 프로토콜은 absorb로 쌓인 담보를 storefront에 판매
// 목표: reserve를 적절 수준 유지

targetReserves = initial target (DAO 설정)

if (totalReserves > targetReserves * SELL_THRESHOLD) {
    // 초과분을 DEX에서 매도 (수동 또는 자동)
    // base asset 확보 → treasury로
}

// 현재 상태 확인
uint currentReserves = totalReserves[WETH];
// DAO가 reserve 조정 결정`}</pre>

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
