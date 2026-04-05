import LiquidationViz from './viz/LiquidationViz';
import LiquidationCallFlowViz from './viz/LiquidationCallFlowViz';
import LiquidationBonusViz from './viz/LiquidationBonusViz';
import MevLiquidationViz from './viz/MevLiquidationViz';

export default function Liquidation() {
  return (
    <section id="liquidation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">청산 메커니즘 &amp; Health Factor</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <LiquidationViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Health Factor — 포지션 건강도</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`HF = Σ(collateral_i × liquidationThreshold_i) / totalDebtInETH

// 예시
담보: 10 ETH × $3000 × 85% (LT) = $25,500
부채: 10,000 USDC = $10,000
HF = 25,500 / 10,000 = 2.55

// 안전 구간
HF > 1.5: 안전
1.0 < HF < 1.5: 주의
HF < 1.0: 청산 가능`}</pre>
        <p>
          <strong>HF &lt; 1이면 청산 대상</strong> — 담보 가치가 청산 임계치 아래<br />
          Liquidation Threshold(LT): LTV보다 약간 높음 (예: LTV 80%, LT 85%)<br />
          여유 공간 = LT - LTV → 작은 가격 변동에 즉시 청산 안 되게
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">청산 흐름 — liquidationCall()</h3>

        <LiquidationCallFlowViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function liquidationCall(
    address collateralAsset,  // 청산할 담보 자산
    address debtAsset,         // 상환할 부채 자산
    address user,              // 청산당하는 사용자
    uint256 debtToCover,       // 상환할 부채 양
    bool receiveAToken         // aToken으로 받을지, 원본으로
) external {
    LiquidationLogic.executeLiquidationCall(...)
}

// 실행 단계
function executeLiquidationCall(...) external {
    // 1) HF 계산
    (,,, , healthFactor,) = GenericLogic.calculateUserAccountData(...);

    // 2) HF < 1 확인
    require(healthFactor < 1e18, "HEALTH_FACTOR_NOT_BELOW_THRESHOLD");

    // 3) 최대 청산 가능량 계산
    uint256 maxLiquidatableDebt = userDebt * MAX_LIQUIDATION_CLOSE_FACTOR / 10000;
    // MAX_LIQUIDATION_CLOSE_FACTOR = 5000 (50%)
    // HF < 0.95이면 100% 청산 가능

    uint256 actualDebtToLiquidate = debtToCover > maxLiquidatableDebt
        ? maxLiquidatableDebt
        : debtToCover;

    // 4) 담보 계산 (bonus 포함)
    uint256 maxCollateralToLiquidate = getCollateralAmount(
        debtAsset, collateralAsset, actualDebtToLiquidate, liquidationBonus
    );

    // 5) 토큰 이동
    //    청산자 → 부채 자산 지불
    //    청산자 ← 담보 자산 + 보너스 수령
    //    user: 담보 -= maxCollateral, 부채 -= actualDebt
}`}</pre>
        <p>
          <strong>청산자는 제3자</strong>: MEV bot, 청산 전문 프로토콜<br />
          <strong>50% 청산 제한</strong>: 한 번에 전체 포지션 청산 금지 (user 보호)<br />
          HF가 매우 낮으면(&lt; 0.95) 100% 청산 허용 — bad debt 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Liquidation Bonus — 청산자 보상</h3>

        <LiquidationBonusViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 청산자가 받는 담보 = (부채 가치 + 보너스) / 담보 가격
// 보너스가 청산 인센티브

// 예시: WETH 담보, USDC 부채
User:
- 담보: 10 WETH ($3000 each) = $30,000
- 부채: 26,000 USDC = $26,000
- LT: 85%
- HF = 30,000 × 0.85 / 26,000 = 0.98 (청산 대상)

청산자:
- 상환: 5,000 USDC (부채의 ~20%)
- WETH 가격: $3000
- Liquidation Bonus: 5% (WETH의 경우)
- 받는 담보: 5000 × 1.05 / 3000 = 1.75 WETH = $5,250

청산자 수익: $250 (5% of covered debt)
User 손실: 추가 $250 (bonus만큼)`}</pre>
        <p>
          <strong>Bonus = 청산자 이익 = User 손실</strong><br />
          Bonus 크면 → 빠른 청산 (MEV bot 경쟁 ↑)<br />
          Bonus 작으면 → 청산 지연 (프로토콜 bad debt 위험)<br />
          Bonus는 자산별 2-10% (stable 자산은 낮음, 변동성 자산은 높음)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">자산별 LTV/LT/Bonus — 리스크 파라미터</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">자산</th>
                <th className="border border-border px-3 py-2 text-left">LTV</th>
                <th className="border border-border px-3 py-2 text-left">LT</th>
                <th className="border border-border px-3 py-2 text-left">Liq. Bonus</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2">WETH</td><td className="border border-border px-3 py-2">80%</td><td className="border border-border px-3 py-2">82.5%</td><td className="border border-border px-3 py-2">5%</td></tr>
              <tr><td className="border border-border px-3 py-2">WBTC</td><td className="border border-border px-3 py-2">73%</td><td className="border border-border px-3 py-2">78%</td><td className="border border-border px-3 py-2">6.5%</td></tr>
              <tr><td className="border border-border px-3 py-2">USDC</td><td className="border border-border px-3 py-2">77%</td><td className="border border-border px-3 py-2">80%</td><td className="border border-border px-3 py-2">4.5%</td></tr>
              <tr><td className="border border-border px-3 py-2">DAI</td><td className="border border-border px-3 py-2">75%</td><td className="border border-border px-3 py-2">78%</td><td className="border border-border px-3 py-2">5%</td></tr>
              <tr><td className="border border-border px-3 py-2">LINK</td><td className="border border-border px-3 py-2">53%</td><td className="border border-border px-3 py-2">68%</td><td className="border border-border px-3 py-2">7%</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>변동성 ↑ → LTV ↓, Bonus ↑</strong><br />
          LINK 같은 변동 자산: 53%만 차입 가능, 청산 보너스 7% (빠른 청산 유도)<br />
          Stable: 80%까지 차입, 보너스 낮음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">청산 bot 경쟁 — MEV 관점</h3>

        <MevLiquidationViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 청산 수익 모델 (청산 봇)
1. 멤풀 모니터링 — 가격 변동 감지
2. HF < 1 포지션 스캔 (off-chain)
3. 기회 포착 → 청산 트랜잭션 전송
4. 받은 담보 → DEX에서 즉시 매도 (flash swap 활용)
5. 차익 = Liquidation Bonus - gas

// 경쟁 전략
- Gas war: priority fee 경쟁
- Flash loan: 자본 없이도 대형 청산
- Private mempool: Flashbots 사용
- Atomic execution: 청산 + DEX swap 1 트랜잭션

// 현실
- 청산 시장은 극도로 경쟁적
- 평균 청산 수익: 0.5-2% (bonus 대부분이 gas + MEV)
- Top bot operators만 지속 수익`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 청산의 경제적 균형</p>
          <p>
            청산 시스템은 <strong>3자 경제</strong>의 균형:
          </p>
          <p className="mt-2">
            1. <strong>User (차입자)</strong>: 청산 원하지 않음 → HF 관리 동기<br />
            2. <strong>Liquidator (봇)</strong>: 청산 수익 원함 → 빠른 실행 동기<br />
            3. <strong>Protocol</strong>: bad debt 방지 → 청산 인센티브 제공
          </p>
          <p className="mt-2">
            균형점:<br />
            - Bonus 너무 높음: user 손실 과도, 자금 유출<br />
            - Bonus 너무 낮음: 청산 지연, 프로토콜 위험<br />
            - 적정선: 5% 근처 (자산마다 조정)
          </p>
          <p className="mt-2">
            <strong>시장 극한 상황</strong>: 2022 stETH 디페그 시 대규모 청산 발생<br />
            Aave의 리스크 파라미터가 잘 튜닝되어 bad debt 최소화<br />
            이것이 Aave가 10년 이상 생존한 이유
          </p>
        </div>

      </div>
    </section>
  );
}
