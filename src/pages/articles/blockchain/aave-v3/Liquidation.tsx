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
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">Health Factor 공식 & 예시</p>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
            <code>HF = Sum(collateral_i * liquidationThreshold_i) / totalDebtInETH</code>
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">계산 예시</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                담보: 10 ETH x $3,000 x 85%(LT) = $25,500<br />
                부채: 10,000 USDC = $10,000<br />
                HF = 25,500 / 10,000 = <strong>2.55</strong>
              </p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">안전 구간</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                HF &gt; 1.5 — 안전<br />
                1.0 &lt; HF &lt; 1.5 — 주의<br />
                HF &lt; 1.0 — <strong>청산 가능</strong>
              </p>
            </div>
          </div>
        </div>
        <p>
          <strong>HF &lt; 1이면 청산 대상</strong> — 담보 가치가 청산 임계치 아래<br />
          Liquidation Threshold(LT): LTV보다 약간 높음 (예: LTV 80%, LT 85%)<br />
          여유 공간 = LT - LTV → 작은 가격 변동에 즉시 청산 안 되게
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">청산 흐름 — liquidationCall()</h3>

        <LiquidationCallFlowViz />
        <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3 my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">liquidationCall() 파라미터</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>collateralAsset</code>, <code>debtAsset</code>, <code>user</code>, <code>debtToCover</code>, <code>receiveAToken</code> — aToken/원본 선택 가능
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">1단계: HF 확인</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>GenericLogic.calculateUserAccountData()</code>로 HF 계산, <code>healthFactor &lt; 1e18</code>이어야 진행
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-3">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">2단계: 청산 가능량</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>MAX_LIQUIDATION_CLOSE_FACTOR = 5000</code> (50%) — HF &lt; 0.95이면 100% 청산 허용
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">3단계: 담보 계산</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>getCollateralAmount(debtAsset, collateralAsset, actualDebt, liquidationBonus)</code> — 보너스 포함 담보량
            </p>
          </div>
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3 sm:col-span-2">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">4단계: 토큰 이동</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              청산자 → 부채 자산 지불 / 청산자 ← 담보 + 보너스 수령 / user: 담보 감소, 부채 감소
            </p>
          </div>
        </div>
        <p>
          <strong>청산자는 제3자</strong>: MEV bot, 청산 전문 프로토콜<br />
          <strong>50% 청산 제한</strong>: 한 번에 전체 포지션 청산 금지 (user 보호)<br />
          HF가 매우 낮으면(&lt; 0.95) 100% 청산 허용 — bad debt 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Liquidation Bonus — 청산자 보상</h3>

        <LiquidationBonusViz />
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">Liquidation Bonus 계산 예시 — WETH 담보, USDC 부채</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-2">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">User 포지션</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                담보: 10 WETH ($3,000 each) = $30,000<br />
                부채: 26,000 USDC, LT: 85%<br />
                HF = 30,000 x 0.85 / 26,000 = <strong>0.98</strong>
              </p>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">청산자 행동</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                상환: 5,000 USDC (~20%)<br />
                Bonus 5%: 5000 x 1.05 / 3000 = <strong>1.75 WETH</strong> ($5,250)<br />
                순이익: $250 / User 추가 손실: $250
              </p>
            </div>
          </div>
        </div>
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
        <div className="not-prose grid gap-3 sm:grid-cols-3 my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">청산 봇 수익 모델</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              멤풀 모니터링 → HF &lt; 1 스캔 → 청산 TX 전송 → 담보 DEX 매도(flash swap) → 차익 = Bonus - gas
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-3">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">경쟁 전략</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Gas war (priority fee), Flash loan (무자본 청산), Flashbots (private mempool), Atomic execution (청산+swap 1 TX)
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">현실</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              극도로 경쟁적 시장, 평균 수익 0.5-2% (bonus 대부분 gas+MEV), top bot만 지속 수익
            </p>
          </div>
        </div>

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
