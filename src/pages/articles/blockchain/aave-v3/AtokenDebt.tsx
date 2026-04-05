import ScaledBalanceViz from './viz/ScaledBalanceViz';
import ScaledBalanceCalcViz from './viz/ScaledBalanceCalcViz';
import LiquidityIndexViz from './viz/LiquidityIndexViz';
import VariableDebtTokenViz from './viz/VariableDebtTokenViz';
import LinearVsCompoundViz from './viz/LinearVsCompoundViz';
import SpreadProfitViz from './viz/SpreadProfitViz';

export default function AtokenDebt() {
  return (
    <section id="atoken-debt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">aToken · VariableDebtToken · 이자 누적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ScaledBalanceViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">aToken — Interest-Bearing Token</h3>
        <p>
          aToken: 예치자가 받는 <strong>이자 발생 토큰</strong><br />
          - aUSDC = USDC 예치 증명서 + 자동 이자 누적<br />
          - ERC20 호환 — 전송·거래 가능<br />
          - 시간 지남 → 잔액 자동 증가 (rebase 효과)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Scaled Balance — 인덱스 기반 회계</h3>

        <ScaledBalanceCalcViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// aToken의 핵심 아이디어
// 저장: scaled balance (이자 빼고)
// 조회: scaled × current_index / RAY (이자 포함)

// mint 시
function mint(address user, uint256 amount, uint256 index) external {
    uint256 amountScaled = amount.rayDiv(index);
    _mint(user, amountScaled);
}

// balanceOf 시
function balanceOf(address user) public view override returns (uint256) {
    uint256 scaledBalance = super.balanceOf(user);
    uint256 index = POOL.getReserveNormalizedIncome(UNDERLYING_ASSET_ADDRESS);
    return scaledBalance.rayMul(index);
}

// 예시
시점 t0: user 예치 1000 USDC, index = 1.0 (RAY 스케일)
  저장: scaledBalance = 1000 / 1.0 = 1000

시점 t1 (1년 후): index = 1.05 (5% 이자 누적)
  balanceOf() = 1000 × 1.05 = 1050 USDC

// 사용자가 한 일: 아무것도 없음!
// 이자가 자동 복리로 쌓임`}</pre>
        <p>
          <strong>rebase 대신 scaled balance</strong>: 가스 절감 + 전송 단순화<br />
          <strong>모든 사용자에게 같은 index 적용</strong> — O(1) 이자 계산<br />
          RAY 스케일: 1 RAY = 1e27 — 고정밀 계산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">liquidityIndex 업데이트</h3>

        <LiquidityIndexViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Reserve 상태 업데이트 시
function updateState(DataTypes.ReserveData storage reserve) internal {
    uint256 previousLiquidityIndex = reserve.liquidityIndex;
    uint256 currentLiquidityRate = reserve.currentLiquidityRate;
    uint256 timeElapsed = block.timestamp - reserve.lastUpdateTimestamp;

    if (currentLiquidityRate == 0) return;

    // 복리 계산 (Taylor approximation)
    uint256 cumulatedLiquidityInterest = MathUtils.calculateLinearInterest(
        currentLiquidityRate, reserve.lastUpdateTimestamp
    );

    uint256 newLiquidityIndex = cumulatedLiquidityInterest.rayMul(previousLiquidityIndex);
    reserve.liquidityIndex = newLiquidityIndex;
}

function calculateLinearInterest(uint256 rate, uint40 lastUpdate) internal view returns (uint256) {
    uint256 timeDelta = block.timestamp - lastUpdate;
    return (rate * timeDelta / SECONDS_PER_YEAR) + RAY;
}`}</pre>
        <p>
          <strong>linear interest</strong>: 사용자 상호작용 사이에는 선형 누적<br />
          단기간은 복리와 거의 동일 — 연속 복리 Taylor 근사<br />
          상호작용 시점마다 인덱스 갱신 → 복리 효과 실현
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">VariableDebtToken — 변동 금리 부채</h3>

        <VariableDebtTokenViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Debt Token: 차입 증명서 (음의 aToken 같은 개념)
// Non-transferable — 부채는 양도 불가

contract VariableDebtToken is DebtTokenBase {
    function mint(address user, address onBehalfOf, uint256 amount, uint256 index)
        external override onlyPool returns (bool, uint256) {
        uint256 amountScaled = amount.rayDiv(index);
        _mint(onBehalfOf, amountScaled);
        return (scaledBalanceOf(onBehalfOf) == amountScaled, totalSupply);
    }

    function balanceOf(address user) public view override returns (uint256) {
        uint256 scaledBalance = scaledBalanceOf(user);
        if (scaledBalance == 0) return 0;

        // 차입 이자 복리 적용
        uint256 index = POOL.getReserveNormalizedVariableDebt(_underlyingAsset);
        return scaledBalance.rayMul(index);
    }
}`}</pre>
        <p>
          <strong>구조는 aToken과 동일</strong>: scaled balance + index 누적<br />
          차이: 이자 방향 반대 (부채 증가 = 사용자 불리)<br />
          <strong>Non-transferable</strong>: 부채를 다른 사람에게 떠넘길 수 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">variableBorrowIndex</h3>

        <LinearVsCompoundViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 차입 이자 index는 복리 계산 (예치보다 엄격)
function calculateCompoundedInterest(
    uint256 rate,
    uint40 lastUpdate
) internal view returns (uint256) {
    uint256 timeDelta = block.timestamp - lastUpdate;
    if (timeDelta == 0) return RAY;

    // Compounded: (1 + rate/year)^(timeDelta/year) 근사
    uint256 expMinusOne = timeDelta - 1;
    uint256 expMinusTwo = timeDelta > 2 ? timeDelta - 2 : 0;

    uint256 basePowerTwo = rate.rayMul(rate) / (SECONDS_PER_YEAR * SECONDS_PER_YEAR);
    uint256 basePowerThree = basePowerTwo.rayMul(rate) / SECONDS_PER_YEAR;

    uint256 secondTerm = timeDelta * expMinusOne * basePowerTwo / 2;
    uint256 thirdTerm = timeDelta * expMinusOne * expMinusTwo * basePowerThree / 6;

    return RAY + (rate * timeDelta / SECONDS_PER_YEAR) + secondTerm + thirdTerm;
}`}</pre>
        <p>
          <strong>Compound interest Taylor 3차 근사</strong>: e^x ≈ 1 + x + x²/2 + x³/6<br />
          차입자에게 불리한 방향 — 정확한 복리 적용<br />
          예치는 linear, 차입은 compound → <strong>프로토콜에 수수료 누적</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이자 spread — 프로토콜 수익</h3>

        <SpreadProfitViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 간단한 숫자 예시
현재 USDC 풀:
- 예치자 이자: 3.5% APY
- 차입자 이자: 5.0% APY
- Spread: 1.5% → 프로토콜 treasury로

// 계산
Total interest paid by borrowers = 5.0% × total_borrowed
Total interest to lenders = 3.5% × total_deposited
Spread = (5.0% × borrowed) - (3.5% × deposited)

// Reserve Factor: spread의 일부를 treasury로
reserveFactor = 10%  // 10% goes to treasury
To treasury: 1.5% × 10% = 0.15%
To lenders: spread - treasury portion`}</pre>
        <p>
          <strong>Spread + Reserve Factor</strong>: Aave의 주요 수익원<br />
          Utilization 높으면 spread ↑ — 차입 수요 반영<br />
          Treasury는 DAO 거버넌스로 관리
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Scaled Balance의 우아함</p>
          <p>
            Aave의 scaled balance 패턴은 <strong>DeFi 엔지니어링의 모범</strong>
          </p>
          <p className="mt-2">
            왜 rebase 아닌 scaled:<br />
            ✗ Rebase token: 매 블록 모든 balance 수정 → 가스 폭증<br />
            ✗ Rebase: ERC20 호환성 깨짐 (pool·bridge 통합 어려움)<br />
            ✓ Scaled: 상태 저장은 고정, 조회 시 계산 → 가스 절감<br />
            ✓ Scaled: ERC20 완전 호환
          </p>
          <p className="mt-2">
            <strong>확장 패턴</strong>: Compound, Morpho, Euler 모두 유사 구조 채택<br />
            DeFi의 "인덱스 기반 이자" 표준이 됨
          </p>
        </div>

      </div>
    </section>
  );
}
