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
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">Scaled Balance — 핵심 패턴</p>
          <div className="grid gap-2 sm:grid-cols-2 mb-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">mint() — 저장</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>amountScaled = amount.rayDiv(index)</code> — 이자 제외한 원금 비율만 저장
              </p>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">balanceOf() — 조회</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>scaledBalance.rayMul(index)</code> — 현재 index 곱하면 이자 포함 잔액
              </p>
            </div>
          </div>
          <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">예시</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              t0: 1000 USDC 예치, index=1.0 → scaledBalance=1000 / t1(1년 후): index=1.05 → <code>balanceOf()=1050</code> — 사용자 행동 없이 이자 자동 누적
            </p>
          </div>
        </div>
        <p>
          <strong>rebase 대신 scaled balance</strong>: 가스 절감 + 전송 단순화<br />
          <strong>모든 사용자에게 같은 index 적용</strong> — O(1) 이자 계산<br />
          RAY 스케일: 1 RAY = 1e27 — 고정밀 계산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">liquidityIndex 업데이트</h3>

        <LiquidityIndexViz />
        <div className="not-prose grid gap-3 sm:grid-cols-2 my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">updateState() — 인덱스 갱신</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>calculateLinearInterest(rate, lastUpdate)</code>로 누적 이자 계산 → <code>newIndex = cumulated.rayMul(prevIndex)</code> 저장
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">calculateLinearInterest()</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>(rate * timeDelta / SECONDS_PER_YEAR) + RAY</code> — 단기간 선형 근사 (복리와 거의 동일), 상호작용마다 갱신으로 복리 실현
            </p>
          </div>
        </div>
        <p>
          <strong>linear interest</strong>: 사용자 상호작용 사이에는 선형 누적<br />
          단기간은 복리와 거의 동일 — 연속 복리 Taylor 근사<br />
          상호작용 시점마다 인덱스 갱신 → 복리 효과 실현
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">VariableDebtToken — 변동 금리 부채</h3>

        <VariableDebtTokenViz />
        <div className="not-prose grid gap-3 sm:grid-cols-2 my-4">
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">VariableDebtToken.mint()</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>amountScaled = amount.rayDiv(index)</code> → <code>_mint(onBehalfOf, amountScaled)</code> — aToken과 동일 구조, Non-transferable (부채 양도 불가)
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">VariableDebtToken.balanceOf()</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>getReserveNormalizedVariableDebt()</code>로 index 조회 → <code>scaledBalance.rayMul(index)</code> — 이자 방향 반대 (부채 증가 = 사용자 불리)
            </p>
          </div>
        </div>
        <p>
          <strong>구조는 aToken과 동일</strong>: scaled balance + index 누적<br />
          차이: 이자 방향 반대 (부채 증가 = 사용자 불리)<br />
          <strong>Non-transferable</strong>: 부채를 다른 사람에게 떠넘길 수 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">variableBorrowIndex</h3>

        <LinearVsCompoundViz />
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">calculateCompoundedInterest() — Taylor 3차 근사</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">1차항</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>rate * timeDelta / SECONDS_PER_YEAR</code> — 선형 이자
              </p>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">2차항</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>timeDelta * (t-1) * rate^2 / 2</code> — 복리 보정
              </p>
            </div>
            <div className="rounded border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-2">
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">3차항</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>timeDelta * (t-1) * (t-2) * rate^3 / 6</code> — 정밀 근사
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            예치는 linear, 차입은 compound → 프로토콜에 수수료 누적 (차입자에게 불리한 방향)
          </p>
        </div>
        <p>
          <strong>Compound interest Taylor 3차 근사</strong>: e^x ≈ 1 + x + x²/2 + x³/6<br />
          차입자에게 불리한 방향 — 정확한 복리 적용<br />
          예치는 linear, 차입은 compound → <strong>프로토콜에 수수료 누적</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이자 spread — 프로토콜 수익</h3>

        <SpreadProfitViz />
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">이자 Spread 예시 — USDC 풀</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">예치자</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">이자: <strong>3.5% APY</strong></p>
            </div>
            <div className="rounded border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-2">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">차입자</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">이자: <strong>5.0% APY</strong></p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Spread</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300"><strong>1.5%</strong> → treasury로</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            Reserve Factor 10%: spread 중 0.15%가 treasury로 / 나머지 예치자 분배
          </p>
        </div>
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
