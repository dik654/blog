import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { marketRiskData } from "./derivative-risk-data";
import LossTailViz from "./var-expected-shortfall-stress-and-model-risk/viz/LossTailViz";
import RepriceVsLinearViz from "./var-expected-shortfall-stress-and-model-risk/viz/RepriceVsLinearViz";
import RiskLoopViz from "./var-expected-shortfall-stress-and-model-risk/viz/RiskLoopViz";

export default function MarketRiskArticle() {
  return (
    <DerivativeDeepArticle
      data={marketRiskData}
      vizBefore={{
        "black-box": { 1: <RepriceVsLinearViz /> },
        case: { 0: <LossTailViz /> },
        mechanism: { 0: <RiskLoopViz /> },
      }}
    />
  );
}
