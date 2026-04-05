import PoolModelViz from './viz/PoolModelViz';
import SupplyFlowViz from './viz/SupplyFlowViz';
import HealthFactorViz from './viz/HealthFactorViz';
import SystemArchViz from './viz/SystemArchViz';
import UserPerspectiveViz from './viz/UserPerspectiveViz';
import MainContractsViz from './viz/MainContractsViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; Pool 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PoolModelViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Aave의 비전 — Peer-to-Pool Lending</h3>
        <p>
          Compound와 Aave의 핵심 혁신: <strong>P2P 대출 → P2Pool 대출</strong><br />
          전통 P2P 대출(ETHLend, Aave v1 이전): 대출자와 차입자 개별 매칭 — 유동성 부족, UX 복잡<br />
          Pool 모델: 공유 풀에 예치, 풀에서 차입 — <strong>즉시 매칭 + 유동적</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">시스템 구조</h3>

        <SystemArchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">사용자 관점 — 4단계 흐름</h3>

        <UserPerspectiveViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 컨트랙트</h3>

        <MainContractsViz />
        <p>
          <strong>Pool이 단일 진입점</strong>: 모든 사용자 operation은 Pool을 통함<br />
          토큰마다 별도 aToken/DebtToken 배포 — Pool은 이들의 발행·소각만 관리<br />
          "fat protocol" 피하고 모듈화된 컴포넌트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">supply — 예치 흐름</h3>

        <SupplyFlowViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function supply(
    address asset,
    uint256 amount,
    address onBehalfOf,
    uint16 referralCode
) public virtual override {
    SupplyLogic.executeSupply(
        _reserves,
        _reservesList,
        _usersConfig[onBehalfOf],
        DataTypes.ExecuteSupplyParams({
            asset: asset,
            amount: amount,
            onBehalfOf: onBehalfOf,
            referralCode: referralCode
        })
    );
}

// executeSupply 내부
function executeSupply(...) external {
    DataTypes.ReserveData storage reserve = reserves[asset];

    // 1) 이자율·인덱스 업데이트
    reserve.updateState(reserveCache);

    // 2) 공급 한도 체크
    ValidationLogic.validateSupply(reserveCache, reserve, amount);

    // 3) aToken 발행 (이자 포함 비율로)
    bool isFirstSupply = IAToken(aToken).mint(
        msg.sender, onBehalfOf, amount, reserveCache.nextLiquidityIndex
    );

    // 4) 사용자 담보 설정 (처음 공급 시)
    if (isFirstSupply) {
        userConfig.setUsingAsCollateral(reserve.id, true);
    }

    // 5) 토큰 이동
    IERC20(asset).safeTransferFrom(msg.sender, aToken, amount);
}`}</pre>
        <p>
          <strong>5단계 supply</strong>: 상태 갱신 → 검증 → aToken mint → 담보 설정 → 토큰 이동<br />
          <code>updateState</code>: 마지막 상호작용 이후 누적 이자 반영<br />
          aToken amount는 실제 받는 토큰 양이 아님 — scaled amount (나중 설명)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">borrow — 차입 흐름</h3>

        <HealthFactorViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function borrow(
    address asset,
    uint256 amount,
    uint256 interestRateMode,  // 1=Stable, 2=Variable
    uint16 referralCode,
    address onBehalfOf
) public virtual override {
    BorrowLogic.executeBorrow(...)
}

// executeBorrow 검증 단계
function validateBorrow(...) internal view {
    // 1) 차입 허용 자산인지
    require(reserveCache.reserveConfiguration.getBorrowingEnabled(), "BORROWING_DISABLED");

    // 2) 차입 캡 체크
    require(totalBorrow + amount <= borrowCap, "BORROW_CAP_EXCEEDED");

    // 3) Health Factor 체크 (담보 충분?)
    (,,, , healthFactor,) = GenericLogic.calculateUserAccountData(...);
    require(healthFactor > HEALTH_FACTOR_LIQUIDATION_THRESHOLD, "HEALTH_FACTOR_LOWER_THAN_LIQUIDATION");

    // 4) LTV 한도 체크
    require(
        (totalDebtInETH + amount_in_ETH) <= (collateralBalanceETH * avgLtv / 100),
        "COLLATERAL_CANNOT_COVER_NEW_BORROW"
    );
}`}</pre>
        <p>
          <strong>4단계 검증</strong>: 허용 → 캡 → Health Factor → LTV<br />
          Health Factor = 담보가치 × LiquidationThreshold / 부채<br />
          &gt; 1이어야 안전, &lt; 1이면 청산 대상
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Reserve Data — 자산별 상태</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`struct ReserveData {
    ReserveConfigurationMap configuration;  // LTV, LT, 활성 상태 등
    uint128 liquidityIndex;      // 예치 이자 누적 인덱스 (1e27 스케일)
    uint128 currentLiquidityRate;   // 현재 예치 APY
    uint128 variableBorrowIndex;    // 차입 이자 누적 인덱스
    uint128 currentVariableBorrowRate;
    uint128 currentStableBorrowRate;
    uint40 lastUpdateTimestamp;
    uint16 id;
    address aTokenAddress;
    address stableDebtTokenAddress;
    address variableDebtTokenAddress;
    address interestRateStrategyAddress;
    uint128 accruedToTreasury;   // 프로토콜 수수료 누적
    uint128 unbacked;            // portal 기능 (크로스체인)
    uint128 isolationModeTotalDebt;
}`}</pre>
        <p>
          <strong>핵심 필드 2개</strong>: <code>liquidityIndex</code>, <code>variableBorrowIndex</code><br />
          인덱스는 <strong>누적 이자 계수</strong> — 사용자별 저장 없이 이자 계산<br />
          aToken 양 × 현재 인덱스 / 저장된 인덱스 = 실제 토큰 양
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Pool 모델의 트레이드오프</p>
          <p>
            <strong>Pool 모델 장점</strong>:<br />
            ✓ 즉시 유동성 (주문 매칭 불필요)<br />
            ✓ 모든 예치자가 같은 이자율 (공평)<br />
            ✓ 부분 상환/추가 예치 유연<br />
            ✓ 복리 자동 적용
          </p>
          <p className="mt-2">
            <strong>Pool 모델 단점</strong>:<br />
            ✗ 이자율 최적화 불가 (P2P는 협상 가능)<br />
            ✗ Pool 유동성 위기 가능 (bank run)<br />
            ✗ 시장금리 대비 비효율 (spread 존재)
          </p>
          <p className="mt-2">
            <strong>현대 DeFi는 hybrid</strong>:<br />
            - Morpho: Aave pool 위에 P2P 매칭 레이어<br />
            - Euler: pool + risk isolation<br />
            - Pool + 금리 집계 = 유동성 ∩ 최적 이자율
          </p>
        </div>

      </div>
    </section>
  );
}
