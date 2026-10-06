import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { yieldCurveData } from "./derivative-model-data";

export default function YieldCurveBootstrappingArticle() {
  return <DerivativeDeepArticle data={yieldCurveData} />;
}
