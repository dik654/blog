import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { marketRiskValidationData } from "./derivative-model-data";
import MarketRiskValidationMapViz from "./MarketRiskValidationMapViz";

export default function MarketRiskBacktestingArticle() {
  return (
    <div className="space-y-16">
      <MarketRiskValidationMapViz />
      <DerivativeDeepArticle data={marketRiskValidationData} />
    </div>
  );
}
