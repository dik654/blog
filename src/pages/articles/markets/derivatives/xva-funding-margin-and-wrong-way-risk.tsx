import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { xvaData } from "./derivative-model-data";
import XvaAdjustmentMapViz from "./XvaAdjustmentMapViz";

export default function XvaFundingMarginArticle() {
  return (
    <div className="space-y-16">
      <XvaAdjustmentMapViz />
      <DerivativeDeepArticle data={xvaData} />
    </div>
  );
}
