import ExplainedFormula from "@/components/ui/explained-formula";
import ModernAaveViz from "./viz/ModernAaveViz";

export default function Liquidation() {
  return (
    <section id="liquidation" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Health factor는 oracle value에 weighted liquidation threshold를 적용한 비율이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>각 collateral의 oracle value에 liquidation threshold를 곱해 더하고 전체 debt value로 나눕니다. HF가 1 미만이면 liquidation 대상입니다. LTV는 새 borrow/withdraw 허용에, liquidation threshold는 청산 판정에 쓰이므로 같은 숫자라고 가정하면 안 됩니다.</p>
      </div>
      <ModernAaveViz mode="liquidation" />
      <ExplainedFormula
        question="담보 가격 하락이 health factor와 청산량에 어떻게 연결될까요?"
        idea="먼저 asset decimals와 oracle scale을 맞춰 base currency value를 만들고, 담보별 threshold를 곱한 합을 debt로 나눕니다. Liquidation 시 debt repayment와 bonus collateral은 available collateral·close factor에 의해 다시 제한됩니다."
        formula={String.raw`HF=\frac{\sum_i V_i\,LT_i}{D},\qquad C_{seize}=\frac{D_{repaid}(1+bonus)}{P_C}`}
        annotatedFormula={String.raw`HF=\underbrace{\frac{\sum_i V_i\,LT_i}{D},\qquad C_{seize}=\frac{D_{repaid}(1+bonus)}{P_C}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{\sum_i V_i\,LT_i}{D},\qquad C_{seize}=\frac{D_{repaid}(1+bonus)}{P_C}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","먼저 asset decimals와 oracle scale을","맞춰 base currency value를 만들고, 담보별","threshold를 곱한 합을 debt로 나눕니다."] },
        ]}
        terms={[
          { symbol: "V_i", name: "collateral value", description: "Oracle price·token balance·decimals로 계산한 base-currency 가치입니다." },
          { symbol: "LT_i", name: "liquidation threshold", description: "Collateral별 governance risk percentage입니다." },
          { symbol: "D", name: "total debt value", description: "Index가 반영된 모든 borrow의 base-currency 합입니다." },
        ]}
        assumptions={["Oracle freshness·price sign·asset decimals·eMode category를 먼저 검증합니다.", "Bonus, protocol fee, close factor와 collateral cap은 pinned implementation/config를 사용합니다."]}
        interpretation="담보 $10,000, LT=80%, debt $7,000이면 HF≈1.143입니다. 담보가 $8,000으로 하락하면 HF≈0.914라 청산 가능합니다. Debt $1,000을 갚고 bonus 5%, collateral price $100이면 cap 전 10.5개를 계산합니다. Price decimals를 10배 틀리면 HF와 seize가 함께 잘못됩니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Close factor는 “항상 50%”가 아니다</h3>
        <p>Pinned origin snapshot은 담보·부채가 최소 base threshold 이상이고 HF가 0.95보다 높을 때 total debt의 기본 50%를 cap으로 씁니다. 이 조건 밖에서는 전체 debt까지 후보가 될 수 있고, 선택 debt reserve·available collateral·사용자 <code>debtToCover</code>가 실제 양을 더 줄입니다. 오래된 V3 설명을 모든 3.x 배포에 그대로 복사하지 않습니다.</p>
      </div>
    </section>
  );
}
