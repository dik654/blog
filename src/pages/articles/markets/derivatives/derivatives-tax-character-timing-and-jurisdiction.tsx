import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { derivativesTaxData } from "./derivative-professional-practice-data";
import HedgeTimingViz from "./derivatives-tax-character-timing-and-jurisdiction/viz/HedgeTimingViz";
import KoreaLedgerViz from "./derivatives-tax-character-timing-and-jurisdiction/viz/KoreaLedgerViz";
import YearEndMarkViz from "./derivatives-tax-character-timing-and-jurisdiction/viz/YearEndMarkViz";

export default function DerivativesTaxArticle() {
  return (
    <DerivativeDeepArticle
      data={derivativesTaxData}
      vizBefore={{
        need: { 0: <HedgeTimingViz /> },
        source: { 1: <KoreaLedgerViz /> },
        comparison: { 0: <YearEndMarkViz /> },
      }}
    />
  );
}
