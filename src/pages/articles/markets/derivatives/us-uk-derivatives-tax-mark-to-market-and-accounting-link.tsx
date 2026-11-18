import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { usUkDerivativesTaxData } from "./derivative-specialized-market-gaps-data";
import HedgeTimingViz from "./us-uk-derivatives-tax-mark-to-market-and-accounting-link/viz/HedgeTimingViz";
import TwoLedgerPathViz from "./us-uk-derivatives-tax-mark-to-market-and-accounting-link/viz/TwoLedgerPathViz";

export default function UsUkDerivativesTaxArticle() {
  return (
    <DerivativeDeepArticle
      data={usUkDerivativesTaxData}
      vizBefore={{
        picture: { 0: <TwoLedgerPathViz /> },
        need: { 0: <HedgeTimingViz /> },
      }}
    />
  );
}
