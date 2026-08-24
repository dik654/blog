import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ModernAaveViz from "./viz/ModernAaveViz";

export default function InterestRate() {
  return (
    <section id="interest-rate" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Utilization kink는 liquidity 부족 비용을 두 기울기로 가격화한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>가상 예제로 available liquidity 200, debt 800이면 borrow usage U=800/(200+800)=80%입니다. Optimal point를 넘으면 slope2가 남은 1−Uopt 구간에 정규화되어 빠르게 붙습니다. Supply rate는 borrow rate와 supply usage를 곱하고 reserve factor를 뺀 값입니다.</p>
      </div>
      <ModernAaveViz mode="rate" />
      <ExplainedFormula
        question="Optimal utilization 전후의 variable borrow rate를 어떻게 계산할까요?"
        idea="Optimal point까지 slope1을 선형 배분하고, 그 위에서는 slope1을 모두 더한 뒤 초과 utilization 비율에 slope2를 적용합니다."
        formula={String.raw`r_v(U)=\begin{cases}r_0+s_1U/U_* & U\le U_*\\ r_0+s_1+s_2(U-U_*)/(1-U_*) & U>U_*\end{cases},\quad r_L=r_vU_s(1-RF)`}
        annotatedFormula={String.raw`r_v(U)=\begin{cases}r_0+s_1U/\underbrace{U_*}_{\text{borrow usage ratio 계산}} & U\le U_*\\ r_0+s_1+s_2(U-U_*)/(1-U_*) & U>U_*\end{cases},\quad r_L=\underbrace{r_vU_s(1-RF)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`U_*`, annotation: ["borrow usage ratio이(가) 식의 결과에 기여하는","방식을 계산합니다.","Optimal point까지 slope1을 선형 배분하고, 그","위에서는 slope1을 모두 더한 뒤 초과"] },
          { expression: String.raw`r_vU_s(1-RF)`, annotation: ["supply usage ratio이(가) 식의 결과에 기여하는","방식을 계산합니다.","Optimal point까지 slope1을 선형 배분하고, 그","위에서는 slope1을 모두 더한 뒤 초과"] },
        ]}
        terms={[
          { symbol: "U", name: "borrow usage ratio", description: "totalDebt/(availableLiquidity+totalDebt)입니다." },
          { symbol: "U_s", name: "supply usage ratio", description: "Unbacked까지 포함한 denominator를 쓰므로 source version에 따라 U와 다를 수 있습니다." },
          { symbol: "RF", name: "reserve factor", description: "Borrow interest 중 treasury 측으로 귀속되는 governance parameter입니다." },
        ]}
        assumptions={["r₀,s₁,s₂,U*,RF는 같은 reserve config snapshot입니다.", "APR 표시는 ray/per-year 값을 UI scale로 바꾼 것이며 realized APY·future rate 보장이 아닙니다."]}
        interpretation="r₀=2%,s₁=4%,s₂=75%,U*=80%,RF=10%,unbacked=0이면 U=80%에서 r_v=6%, r_L=4.32%입니다. U=90%에서는 r_v=43.5%, r_L=35.235%입니다. 다른 reserve의 slope를 섞으면 그럴듯하지만 존재하지 않는 curve가 됩니다."
      />
      <div id="paper-aave-rate-strategy" className="scroll-mt-24">
        <CitationBlock source="Aave V3 origin · DefaultReserveInterestRateStrategyV2" href="https://github.com/aave-dao/aave-v3-origin/blob/cff15de6d1271b0c800fc001f4aea4c263e8a597/src/contracts/misc/DefaultReserveInterestRateStrategyV2.sol" citeKey={2}>
          문제: Reserve utilization에 따라 variable borrow·liquidity rate를 계산합니다. 기여: optimal usage 전후 slope, supply usage, reserve factor와 parameter validation의 executable 식을 제공합니다. 전제: cff15de6d127 snapshot과 해당 Pool/reserve의 rate data입니다. 근거 범위: 이 strategy source의 rate 계산입니다. 비주장: 예시 숫자가 현재 특정 market의 governance config이거나 미래 rate를 예측한다고 주장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
