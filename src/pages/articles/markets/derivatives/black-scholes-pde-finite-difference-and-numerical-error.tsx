import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { finiteDifferenceData } from "./derivative-advanced-model-data";
import FiniteDifferencePricingMapViz from "./FiniteDifferencePricingMapViz";

export default function FiniteDifferencePricingArticle() {
  return (
    <div className="space-y-16">
      <FiniteDifferencePricingMapViz />
      <DerivativeDeepArticle data={finiteDifferenceData} />
    </div>
  );
}
