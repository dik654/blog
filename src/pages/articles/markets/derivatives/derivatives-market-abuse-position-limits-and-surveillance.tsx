import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { marketAbuseData } from "./derivative-professional-practice-data";
import AggregationLimitViz from "./derivatives-market-abuse-position-limits-and-surveillance/viz/AggregationLimitViz";
import CancelledOrderViz from "./derivatives-market-abuse-position-limits-and-surveillance/viz/CancelledOrderViz";

export default function DerivativesMarketAbuseArticle() {
  return (
    <DerivativeDeepArticle
      data={marketAbuseData}
      vizBefore={{
        "black-box": { 1: <CancelledOrderViz /> },
        case: { 0: <AggregationLimitViz /> },
      }}
    />
  );
}
