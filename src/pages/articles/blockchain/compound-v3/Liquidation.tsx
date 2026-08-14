import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ModernCometViz from "./viz/ModernCometViz";

export default function Liquidation() {
  return (
    <section id="liquidation" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Absorb는 liquidator가 debt를 갚는 경매가 아니라 protocol balance-sheet 전환이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><code>absorb</code>는 liquidatable account의 collateral을 protocol로 옮기고, protocol base reserves가 borrow를 정리합니다. Caller는 source snapshot에서 liquidator points를 기록받지만 seized collateral을 즉시 소유하지 않습니다. Protocol reserves가 target보다 부족한 sale gate에서 별도 buyer가 <code>buyCollateral</code>로 할인 collateral을 삽니다.</p>
      </div>
      <ModernCometViz mode="liquidation" />
      <ExplainedFormula
        question="Protocol이 보유한 collateral의 ask discount는 어떻게 정해질까요?"
        idea="Asset liquidation factor가 남긴 haircut 여유에 storeFrontPriceFactor를 곱해 discount를 만들고 oracle price에서 뺍니다. Buyer는 baseAmount와 minAmount를 함께 고정합니다."
        formula={String.raw`d=SF\,(1-LF),\qquad P_{ask}=P_{oracle}(1-d)`}
        terms={[
          { symbol: "SF", name: "storefront price factor", description: "Governance가 collateral sale incentive에 적용하는 global factor입니다." },
          { symbol: "LF", name: "asset liquidation factor", description: "Absorb 시 borrower에게 credit되는 collateral 가치 factor입니다." },
          { symbol: "P_ask", name: "discounted price", description: "quoteCollateral이 base value를 collateral amount로 바꿀 때 쓰는 가격입니다." },
        ]}
        assumptions={["Positive fresh oracle prices와 asset/base scales를 검증합니다.", "Reserves가 targetReserves gate를 만족하고 buy action이 pause되지 않았습니다."]}
        interpretation="SF=50%, LF=90%이면 d=5%라 oracle $100 collateral의 ask는 $95입니다. 이를 ‘liquidator bonus 5%를 absorb caller에게 즉시 지급’으로 해석하면 틀립니다. Buyer는 별도 transaction에서 minAmount로 slippage를 제한합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Absorb receipt는 reserve 손실과 collateral inventory를 함께 보여야 한다</h3>
        <p>Debt $900, collateral credit $850라면 protocol reserves가 $50 shortfall을 흡수하고 collateral inventory를 받습니다. 반대로 credit가 debt보다 크면 account에 positive base supply가 남을 수 있습니다. Price·factor·rounding·asset membership 오류를 숨기지 않도록 old/new principal, basePaidOut, seized asset amounts, totalSupplyBase·totalBorrowBase와 reserves를 한 receipt로 비교합니다.</p>
      </div>
      <div id="compound-v3-release-gate" className="scroll-mt-24 prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release gate</h3>
        <p>Chain, Comet proxy/implementation SHA, base asset/scales, collateral list bitmap, price feeds, indexes/time, both rate curves, borrow/liquidate/liquidation factors, caps, baseBorrowMin, targetReserves와 pause flags를 고정합니다. Principal 0 crossing, supply floor/borrow ceil, S=0 utilization, kink 양쪽, borrow vs liquidation buffer, stale/bad price, multi-collateral, absorb shortfall/excess, points, reserve gate, discount quote, minAmount, reentrant-token exclusion과 restart를 differential replay합니다. State·events·custom errors가 같아진 뒤 gas를 비교합니다.</p>
      </div>
      <div id="paper-compound-liquidation" className="scroll-mt-24">
        <CitationBlock source="Compound III official docs · Liquidation" href="https://docs.compound.finance/liquidation/" citeKey={2}>
          문제: Underwater account를 protocol reserves로 absorb하고 seized collateral을 별도 판매합니다. 기여: isLiquidatable, absorb, reserve-funded settlement, buyCollateral와 ask discount의 public contract를 설명합니다. 전제: 선택 Comet deployment의 factors·oracle·target reserves와 구현을 확인합니다. 근거 범위: Compound III liquidation 사용자·integrator interface입니다. 비주장: Absorb caller가 collateral/discount를 즉시 받거나 모든 market에서 같은 factor를 쓴다는 뜻은 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}
