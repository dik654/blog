import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { yieldCurveData } from "./derivative-model-data";
import YieldCurveBootstrapMapViz from "./YieldCurveBootstrapMapViz";

export default function YieldCurveBootstrappingArticle() {
  return (
    <div className="space-y-16">
      <YieldCurveBootstrapMapViz />
      <DerivativeDeepArticle data={yieldCurveData} />
    </div>
  );
}
