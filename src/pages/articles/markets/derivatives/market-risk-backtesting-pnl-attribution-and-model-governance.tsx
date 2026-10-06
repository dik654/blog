import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { marketRiskValidationData } from "./derivative-model-data";

export default function MarketRiskBacktestingArticle() {
  return <DerivativeDeepArticle data={marketRiskValidationData} />;
}
