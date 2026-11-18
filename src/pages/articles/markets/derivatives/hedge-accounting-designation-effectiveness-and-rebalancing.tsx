import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { hedgeAccountingData } from "./derivative-professional-practice-data";
import RebalanceViz from "./hedge-accounting-designation-effectiveness-and-rebalancing/viz/RebalanceViz";
import SwapFlowViz from "./hedge-accounting-designation-effectiveness-and-rebalancing/viz/SwapFlowViz";

export default function HedgeAccountingArticle() {
  return (
    <DerivativeDeepArticle
      data={hedgeAccountingData}
      vizBefore={{
        case: { 0: <SwapFlowViz /> },
        need: { 0: <RebalanceViz /> },
      }}
    />
  );
}
