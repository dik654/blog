import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { salesPracticeData } from "./derivative-data";
import DerivativesSalesPracticeMapViz from "./DerivativesSalesPracticeMapViz";

export default function DerivativesSalesPracticeArticle() {
  return (
    <div className="space-y-16">
      <DerivativesSalesPracticeMapViz />
      <DerivativeDeepArticle data={salesPracticeData} />
    </div>
  );
}
