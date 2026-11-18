import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { bankIrrbbAlmData } from "./derivative-professional-practice-data";
import EveNiiWindowViz from "./bank-irrbb-alm-and-derivatives-hedging/viz/EveNiiWindowViz";
import OverHedgeViz from "./bank-irrbb-alm-and-derivatives-hedging/viz/OverHedgeViz";
import RepricingGapViz from "./bank-irrbb-alm-and-derivatives-hedging/viz/RepricingGapViz";
import SupervisoryShockViz from "./bank-irrbb-alm-and-derivatives-hedging/viz/SupervisoryShockViz";
import SwapOffsetViz from "./bank-irrbb-alm-and-derivatives-hedging/viz/SwapOffsetViz";

export default function BankIrrbbAlmArticle() {
  return (
    <DerivativeDeepArticle
      data={bankIrrbbAlmData}
      vizBefore={{
        "black-box": { 0: <EveNiiWindowViz /> },
        case: { 1: <SwapOffsetViz /> },
        picture: { 0: <RepricingGapViz /> },
        source: { 1: <SupervisoryShockViz /> },
        limits: { 0: <OverHedgeViz /> },
      }}
    />
  );
}
