import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { hedgeAccountingData } from "./derivative-professional-practice-data";
import HedgeAccountingViz from "./HedgeAccountingViz";

export default function HedgeAccountingArticle() {
  return (
    <div className="space-y-16">
      <HedgeAccountingViz />
      <DerivativeDeepArticle data={hedgeAccountingData} />
    </div>
  );
}
