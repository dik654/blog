import InterestCurveViz from './viz/InterestCurveViz';
import UtilizationRateViz from './viz/UtilizationRateViz';
import M from '@/components/ui/math';

export default function InterestRate() {
  return (
    <section id="interest-rate" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이자율 모델 — Utilization 곡선</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <InterestCurveViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Utilization의 의미</h3>
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-2">Utilization 공식</p>
          <M display>{String.raw`U = \frac{\text{totalBorrowed}}{\text{totalDeposited}}`}</M>
          <div className="grid gap-2 sm:grid-cols-3 mt-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">예시</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">예치 $10M, 차입 $6M → U = 60%</p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">0% / 100%</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">0%: 수익 없음 / 100%: 인출 불가 위험</p>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">최적점</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">80~90% — 효율과 안전 마진 균형</p>
            </div>
          </div>
        </div>
        <p>
          <strong>Utilization이 핵심 시그널</strong>: 이자율 결정의 1차 입력<br />
          높은 utilization → 수요 &gt; 공급 → 이자율 ↑ (차입 억제, 예치 유도)<br />
          낮은 utilization → 공급 &gt; 수요 → 이자율 ↓
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 이자율 곡선</h3>
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-2">2단계 이자율 공식</p>
          <div className="space-y-2 mb-3">
            <M display>{String.raw`U < U_{\text{opt}}: \quad r = R_0 + \text{slope}_1 \times \frac{U}{U_{\text{opt}}}`}</M>
            <M display>{String.raw`U \geq U_{\text{opt}}: \quad r = R_0 + \text{slope}_1 + \text{slope}_2 \times \frac{U - U_{\text{opt}}}{1 - U_{\text{opt}}}`}</M>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400"><M>{String.raw`R_0`}</M> / slope1</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">기본 이자율(보통 0%) + 완만한 증가 구간 (<M>{String.raw`U < U_{\text{opt}}`}</M>)</p>
            </div>
            <div className="rounded border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-2">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">slope2 / <M>{String.raw`U_{\text{opt}}`}</M></p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">급격한 증가 구간 (bank run 방지) / 최적 이용률 80-90%</p>
            </div>
          </div>
        </div>
        <p>
          <strong>2단계 설계 목표</strong>: 최적점 근처는 완만, 초과 시 급격한 증가<br />
          급격한 증가가 <strong>bank run 방지</strong> — 이자 무서워서 빨리 상환 유도<br />
          최적점은 보통 80% — 적당한 유동성 버퍼 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">자산별 파라미터 — USDC 예시</h3>

        <UtilizationRateViz />
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">USDC 파라미터 (Ethereum mainnet) & 계산 예시</p>
          <div className="grid gap-2 sm:grid-cols-2 mb-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">파라미터</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>R_0</code> = 0%, <code>slope1</code> = 4%, <code>slope2</code> = 60%, <code>U_opt</code> = 90%
              </p>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">U = 50%</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">0 + 4% x (50/90) = <strong>2.22%</strong></p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">U = 90% (optimal)</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">0 + 4% = <strong>4%</strong></p>
            </div>
            <div className="rounded border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-2">
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">U = 95% / 100%</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">95%: 4% + 60% x (5/10) = <strong>34%</strong> / 100%: 4% + 60% = <strong>64%</strong></p>
            </div>
          </div>
        </div>
        <p>
          <strong>95% → 34% 이자율</strong>: 단 5% utilization 증가로 8배 이상<br />
          이 구조가 LPs·차입자에게 "최적점 유지" 동기 제공<br />
          차입자는 high rate 피하려 상환 / LP는 high rate 노리고 예치
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">자산 유형별 파라미터</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">자산</th>
                <th className="border border-border px-3 py-2 text-left">R_0</th>
                <th className="border border-border px-3 py-2 text-left">slope1</th>
                <th className="border border-border px-3 py-2 text-left">slope2</th>
                <th className="border border-border px-3 py-2 text-left">U_optimal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">USDC/USDT</td>
                <td className="border border-border px-3 py-2">0%</td>
                <td className="border border-border px-3 py-2">4%</td>
                <td className="border border-border px-3 py-2">60%</td>
                <td className="border border-border px-3 py-2">90%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">WETH</td>
                <td className="border border-border px-3 py-2">0%</td>
                <td className="border border-border px-3 py-2">3%</td>
                <td className="border border-border px-3 py-2">80%</td>
                <td className="border border-border px-3 py-2">80%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">WBTC</td>
                <td className="border border-border px-3 py-2">0%</td>
                <td className="border border-border px-3 py-2">4%</td>
                <td className="border border-border px-3 py-2">300%</td>
                <td className="border border-border px-3 py-2">45%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">stETH (volatile)</td>
                <td className="border border-border px-3 py-2">0%</td>
                <td className="border border-border px-3 py-2">7%</td>
                <td className="border border-border px-3 py-2">300%</td>
                <td className="border border-border px-3 py-2">45%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>변동성 큰 자산은 낮은 optimal + 높은 slope2</strong> — 보수적 운용<br />
          Stablecoin은 높은 optimal + 낮은 slope2 — 효율 우선
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Supply Rate 계산</h3>
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-2">Supply Rate 공식</p>
          <M display>{String.raw`\text{supplyRate} = \text{borrowRate} \times U \times (1 - \text{reserveFactor})`}</M>
          <div className="grid gap-2 sm:grid-cols-2 mt-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">USDC 예시</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                borrowRate 4% x U 90% x (1 - 10%) = <strong>3.24%</strong>
              </p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">이자 흐름</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                차입자 이자 100% → 예치자 81% + treasury 9% + unutilized 10%
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            <code>calculateSupplyRate()</code>: <code>borrowRate.rayMul(utilization).rayMul(RAY - reserveFactor)</code>
          </p>
        </div>
        <p>
          <strong>3요소 곱</strong>: borrowRate × utilization × (1 - reserveFactor)<br />
          Utilization이 1보다 작으면 예치자 이자는 차입자 이자의 일부만<br />
          Reserve Factor: Treasury 비율 (보통 10-30%)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">동적 조정 — 거버넌스</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">조정 시나리오</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              변동성 급증 → <code>slope2</code> 상향 / 유동성 부족 → <code>U_optimal</code> 하향 / 시장 금리 → base rate 조정 / 새 자산 → 초기 파라미터
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-3">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">거버넌스 절차 (4단계)</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Temperature Check (Snapshot) → ARFC (최종 코멘트 요청) → AIP (온체인 투표) → 3일 타임락 후 실행
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 이자율 모델의 진화</p>
          <p>
            Aave의 2단계 곡선은 <strong>10년간 검증된 패턴</strong>:<br />
            - Compound, MakerDAO 모두 유사 구조<br />
            - "최적점 + 급격 증가" 보편 공식
          </p>
          <p className="mt-2">
            최근 혁신:<br />
            - <strong>Morpho</strong>: 이자율을 P2P 매칭으로 타이트하게<br />
            - <strong>Euler</strong>: risk isolation + dynamic rate<br />
            - <strong>Compound V3</strong>: 단일 base asset 모델
          </p>
          <p className="mt-2">
            <strong>Aave의 가치</strong>: "시간 검증된 보수적 모델"<br />
            극한 시장 상황(COVID, Terra, FTX)에서도 안정 작동<br />
            스타트업이 "Aave보다 나아야" 할 수준의 기준선
          </p>
        </div>

      </div>
    </section>
  );
}
