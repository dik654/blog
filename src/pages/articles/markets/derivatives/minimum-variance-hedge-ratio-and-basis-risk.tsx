import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { minimumVarianceHedgeData } from "./derivative-model-data";

export default function MinimumVarianceHedgeRatioArticle() {
  return <DerivativeDeepArticle data={minimumVarianceHedgeData} />;
}
