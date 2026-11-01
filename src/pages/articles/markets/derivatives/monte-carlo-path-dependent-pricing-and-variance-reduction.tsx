import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { monteCarloData } from "./derivative-advanced-model-data";
import MonteCarloPricingMapViz from "./MonteCarloPricingMapViz";

export default function MonteCarloPricingArticle() {
  return (
    <div className="space-y-16">
      <MonteCarloPricingMapViz />
      <DerivativeDeepArticle data={monteCarloData} />
    </div>
  );
}
