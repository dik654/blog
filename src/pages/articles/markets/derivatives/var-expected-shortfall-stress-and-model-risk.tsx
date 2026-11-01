import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { marketRiskData } from "./derivative-risk-data";
import MarketRiskMeasuresMapViz from "./MarketRiskMeasuresMapViz";

export default function MarketRiskArticle() {
  return (
    <div className="space-y-16">
      <MarketRiskMeasuresMapViz />
      <DerivativeDeepArticle data={marketRiskData} />
    </div>
  );
}
