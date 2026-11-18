import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { marketRiskValidationData } from "./derivative-model-data";
import HypoActualViz from "./market-risk-backtesting-pnl-attribution-and-model-governance/viz/HypoActualViz";
import PnlLayersViz from "./market-risk-backtesting-pnl-attribution-and-model-governance/viz/PnlLayersViz";

export default function MarketRiskBacktestingArticle() {
  return (
    <DerivativeDeepArticle
      data={marketRiskValidationData}
      vizBefore={{
        "black-box": { 0: <PnlLayersViz /> },
        picture: { 0: <HypoActualViz /> },
      }}
    />
  );
}
