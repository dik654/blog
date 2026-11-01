import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { crossBorderNettingData } from "./derivative-jurisdiction-data";
import CrossBorderNettingViz from "./CrossBorderNettingViz";

export default function CrossBorderNettingArticle() {
  return (
    <div className="space-y-16">
      <CrossBorderNettingViz />
      <DerivativeDeepArticle data={crossBorderNettingData} />
    </div>
  );
}
