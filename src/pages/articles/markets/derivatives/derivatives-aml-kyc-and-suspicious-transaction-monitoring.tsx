import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { derivativesAmlData } from "./derivative-professional-practice-data";
import DerivativesAmlFlowViz from "./DerivativesAmlFlowViz";

export default function DerivativesAmlArticle() {
  return (
    <div className="space-y-16">
      <DerivativesAmlFlowViz />
      <DerivativeDeepArticle data={derivativesAmlData} />
    </div>
  );
}
