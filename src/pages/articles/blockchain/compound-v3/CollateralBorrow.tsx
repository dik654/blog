import SignedPrincipalViz from './viz/SignedPrincipalViz';

export default function CollateralBorrow() {
  return (
    <section id="collateral-borrow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Base Asset vs Collateral — 단일 차입 자산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SignedPrincipalViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">역할 분리의 의미</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`Base Asset (예: USDC):
  역할 1: 예치 → 이자 수령
  역할 2: 차입 → 이자 지불
  ❌ 담보 역할 없음 (base asset 예치 중에는 차입 불가)

Collateral Assets (예: WETH, WBTC):
  역할: 담보만 제공
  ❌ 이자 받지 못함 (순수 담보)
  ❌ 차입 불가 (base만 차입 가능)`}</pre>
        <p>
          <strong>명확한 역할 분리</strong>: 사용자가 헷갈릴 여지 없음<br />
          담보 자산은 이자 없지만 <strong>차입 자산 제공</strong>으로 가치 실현<br />
          전통 금융의 "마진 계정"과 유사 — 담보는 lock, base로 차입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">차입 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// User 시나리오: 10 WETH 담보로 20,000 USDC 차입

// Step 1: WETH 담보 예치
comet.supply(WETH_address, 10e18);  // 10 WETH
// → userCollateral[user][WETH].balance = 10e18
// → assetsIn bitmap에 WETH bit set

// Step 2: USDC 차입 (principal이 음수로)
comet.withdraw(USDC_address, 20000e6);  // 20,000 USDC
// → principal 계산: presentValue(principal) - 20000e6
// → 결과: principal < 0 (차입 상태)

// 차입 제한 체크
function validateBorrow(address src, int104 newPrincipal) internal view {
    if (newPrincipal < 0) {
        // 차입 시 담보 충분한지 확인
        uint borrowAmount = uint(-int(newPrincipal)) * baseIndex / BASE_INDEX_SCALE;
        uint collateralValue = getCollateralValue(src);

        require(
            collateralValue >= borrowAmount,
            "NotCollateralized"
        );
    }
}`}</pre>
        <p>
          <strong>single-call borrow</strong>: <code>withdraw()</code>로 차입 수행<br />
          internal: principal이 음수로 전환 → 차입 상태 진입<br />
          담보 가치 &lt; 차입 요청 시 revert
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">담보 가치 계산</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function getCollateralValue(address account) public view returns (uint) {
    uint256 totalValue = 0;
    uint16 assetsIn = userBasic[account].assetsIn;

    // bitmap 순회
    for (uint8 i = 0; i < numAssets; i++) {
        if (isInAsset(assetsIn, i)) {
            AssetInfo memory asset = getAssetInfo(i);
            uint128 balance = userCollateral[account][asset.asset].balance;
            uint256 price = getPrice(asset.priceFeed);

            // 가치 × borrow collateral factor
            uint256 value = balance * price / asset.scale * asset.borrowCollateralFactor / FACTOR_SCALE;
            totalValue += value;
        }
    }
    return totalValue;
}

// borrowCollateralFactor vs liquidateCollateralFactor
// borrow: 차입 가능 담보 비율 (예: WETH 83%)
// liquidate: 청산 임계치 (예: WETH 90%)`}</pre>
        <p>
          <strong>2가지 factor</strong>: borrow(LTV), liquidate(LT)<br />
          borrow factor &lt; liquidate factor → 안전 마진<br />
          WETH: 차입 가능 83%, 청산 기준 90%
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">withdrawCollateral — 담보 회수</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function withdraw(address asset, uint amount) external {
    if (asset == baseToken) {
        _withdrawBase(msg.sender, msg.sender, amount);  // 예치 출금 or 차입
    } else {
        _withdrawCollateral(msg.sender, msg.sender, asset, safe128(amount));
    }
}

function _withdrawCollateral(
    address src, address to, address asset, uint128 amount
) internal {
    // 1) 담보 차감
    uint128 balance = userCollateral[src][asset].balance;
    userCollateral[src][asset].balance = balance - amount;

    // 2) bitmap 업데이트 (잔액 0이면 bit 해제)
    if (balance - amount == 0) {
        assetsIn = assetsIn & ~(1 << getAssetIndex(asset));
    }

    // 3) 여전히 collateralized인지 확인
    if (isInBorrowState(src)) {
        require(isCollateralized(src), "NotCollateralized");
    }

    // 4) 토큰 전송
    doTransferOut(asset, to, amount);
}`}</pre>
        <p>
          <strong>담보 회수 안전 체크</strong>: 차입 중이면 HF &gt; 1 필수<br />
          차입 없으면 자유롭게 회수 가능<br />
          bitmap 정리 — 담보 0 된 자산 제거
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">다중 담보 지원</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 한 사용자가 여러 담보 자산 동시 사용 가능
comet.supply(WETH, 5e18);   // 5 WETH
comet.supply(WBTC, 0.1e8);  // 0.1 WBTC
comet.supply(LINK, 1000e18); // 1000 LINK

// 담보 가치 계산 (가격 × factor 합산)
WETH: 5 × $3000 × 83% = $12,450
WBTC: 0.1 × $60,000 × 70% = $4,200
LINK: 1000 × $15 × 67% = $10,050
Total borrow capacity: $26,700

// 사용자는 $26,700까지 USDC 차입 가능

// 차입 후 담보 출금
- 일부 담보 출금 시 남은 담보로 HF 체크
- 전체 출금 시 차입 모두 상환 필요`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">V2 vs V3 사용자 경험 비교</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// V2: 복잡한 다중 role
User has:
  cUSDC (supply + collateral)
  cETH (supply + collateral)
  debt: DAI + USDT
  → 어느 자산이 담보인지, 어느 것이 이자 받는지 혼란

// V3: 명확한 역할
User has in Comet USDC:
  USDC balance: 0 (not supplying)
  WETH collateral: 5
  USDC debt: 10,000
  → 역할 100% 명확

// V3 limitation
  USDC 동시 공급 & 차입 불가
  다른 market에서만 가능 (예: Comet ETH에서 USDC 공급)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: "역할 분리"의 위력</p>
          <p>
            Compound V3의 단일 base asset 모델은 <strong>금융공학적으로 우아</strong>:
          </p>
          <p className="mt-2">
            ✓ <strong>계정 상태 단순</strong>: principal 하나로 supply/borrow 표현<br />
            ✓ <strong>HF 계산 단순</strong>: collateral 값 / 단일 debt 값<br />
            ✓ <strong>청산 단순</strong>: 단일 asset만 청산<br />
            ✓ <strong>감사 단순</strong>: 공격 시나리오 축소
          </p>
          <p className="mt-2">
            트레이드오프:<br />
            ✗ 크로스 마켓 전략 불가 (여러 Comet 조합 필요)<br />
            ✗ "한 market에서 모든 것" 경험 상실
          </p>
          <p className="mt-2">
            <strong>시장 반응</strong>: "보수적 고유동성 자산"에 이상적<br />
            USDC, ETH 같은 blue-chip에는 V3 적합<br />
            exotic 자산은 여전히 Aave 선호<br />
            두 모델이 공존 — DeFi 다양성
          </p>
        </div>

      </div>
    </section>
  );
}
