import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { minimumVarianceHedgeData } from "./derivative-model-data";
import MinimumVarianceHedgeMapViz from "./MinimumVarianceHedgeMapViz";

export default function MinimumVarianceHedgeRatioArticle() {
  return (
    <div className="space-y-16">
      <MinimumVarianceHedgeMapViz />
      <DerivativeDeepArticle data={minimumVarianceHedgeData} />
    </div>
  );
}
