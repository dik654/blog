import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { clearingData } from "./derivative-data";
import ClearingMarginMapViz from "./ClearingMarginMapViz";

export default function ClearingMarginArticle() {
  return (
    <div className="space-y-16">
      <ClearingMarginMapViz />
      <DerivativeDeepArticle data={clearingData} />
    </div>
  );
}
