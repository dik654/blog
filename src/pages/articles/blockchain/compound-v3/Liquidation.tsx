import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ModernCometViz from "./viz/ModernCometViz";

export default function Liquidation() {
  return (
    <section id="liquidation" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">청산 호출자가 담보를 바로 가져가지 않는 이유는 무엇일까요?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><code>absorb</code>는 청산 가능한 계정의 담보를 protocol로 옮기고, protocol의 base reserves로 부채를 정리합니다. 호출자는 확인한 source snapshot에서 liquidator points를 기록받지만 압류 담보를 즉시 소유하지 않습니다.</p>
        <p>담보 판매 조건이 열리면 별도 구매자가 <code>buyCollateral</code>을 실행해 할인된 담보를 삽니다. 부실 계정을 닫는 사람과 protocol inventory를 사는 사람이 분리된 구조입니다.</p>
      </div>
      <ModernCometViz mode="liquidation" />
      <ExplainedFormula
        question="Protocol이 보유한 collateral의 ask discount는 어떻게 정해질까요?"
        idea="Asset liquidation factor가 남긴 haircut 여유에 storeFrontPriceFactor를 곱해 discount를 만들고 oracle price에서 뺍니다. Buyer는 baseAmount와 minAmount를 함께 고정합니다."
        formula={String.raw`d=SF\,(1-LF),\qquad P_{ask}=P_{oracle}(1-d)`}
        annotatedFormula={String.raw`d=\underbrace{SF}_{\text{판매 유인 비율}}\,\underbrace{(1-LF)}_{\text{haircut 여유}},\qquad P_{ask}=\underbrace{P_{oracle}(1-d)}_{\text{buyer 할인 가격}}`}
        operations={[
          { expression: String.raw`SF\,(1-LF)`, annotation: ["absorb 때 깎아 둔 haircut 1−LF 중","SF만큼만 buyer 할인으로 넘깁니다","예: 50%×(1−90%)=5%"] },
          { expression: String.raw`P_{oracle}(1-d)`, annotation: ["oracle 가격에서 할인율 d를 뺀 ask","예: $100 collateral → $95","absorb caller 보너스가 아님"] },
        ]}
        terms={[
          { symbol: "SF", name: "storefront price factor", description: "Governance가 collateral sale incentive에 적용하는 global factor입니다." },
          { symbol: "LF", name: "asset liquidation factor", description: "Absorb 시 borrower에게 credit되는 collateral 가치 factor입니다." },
          { symbol: "P_ask", name: "discounted price", description: "quoteCollateral이 base value를 collateral amount로 바꿀 때 쓰는 가격입니다." },
        ]}
        assumptions={["Positive fresh oracle prices와 asset/base scales를 검증합니다.", "Reserves가 targetReserves gate를 만족하고 buy action이 pause되지 않았습니다."]}
        interpretation="SF=50%, LF=90%이면 d=5%라 oracle $100 collateral의 ask는 $95입니다. 이를 ‘liquidator bonus 5%를 absorb caller에게 즉시 지급’으로 해석하면 틀립니다. Buyer는 별도 transaction에서 minAmount로 slippage를 제한합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>청산 영수증에서 무엇을 함께 봐야 할까요?</h3>
        <p>부채가 $900이고 담보 credit이 $850이면 protocol은 base reserves로 부채를 정리하고, 담보 inventory와 가치 기준 $50 부족분을 함께 떠안습니다. 반대로 credit이 부채보다 크면 계정에 양수 base supply가 남을 수 있습니다.</p>
        <p>가격·factor·반올림·asset membership 오류를 숨기지 않으려면 이전과 이후의 principal, basePaidOut, 압류한 자산 수량, totalSupplyBase·totalBorrowBase와 reserves를 한 receipt에서 비교해야 합니다.</p>
      </div>
      <div id="compound-v3-release-gate" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>출시 전에 고정할 조건</h3>
        <p>먼저 chain과 Comet proxy·implementation SHA를 고정합니다. 이어서 base asset과 scale, 담보 목록 bitmap, price feed, index와 시간, 두 금리 곡선, 모든 factor와 cap, baseBorrowMin, targetReserves와 pause flag를 같은 snapshot으로 묶습니다.</p>
        <p>그 상태에서 principal이 0을 지나는 경우, supply 내림·borrow 올림, 공급량 0의 이용률, kink 양쪽, 차입선과 청산선의 완충, 오래되거나 잘못된 가격, 여러 담보를 차례로 재생합니다.</p>
        <p>마지막으로 absorb의 부족분·초과분, points, reserve gate, 할인 견적, minAmount, 재진입 token 배제와 재시작을 비교합니다. State·event·custom error가 모두 같아진 뒤에 gas를 비교합니다.</p>
      </div>
      <div id="paper-compound-liquidation" className="scroll-mt-24">
        <CitationBlock source="Compound III official docs · Liquidation" href="https://docs.compound.finance/liquidation/" citeKey={2}>
          문제: Underwater account를 protocol reserves로 absorb하고 seized collateral을 별도 판매합니다. 기여: isLiquidatable, absorb, reserve-funded settlement, buyCollateral와 ask discount의 public contract를 설명합니다. 전제: 선택 Comet deployment의 factors·oracle·target reserves와 구현을 확인합니다. 근거 범위: Compound III liquidation 사용자·integrator interface입니다. 비주장: Absorb caller가 collateral/discount를 즉시 받거나 모든 market에서 같은 factor를 쓴다는 뜻은 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}
