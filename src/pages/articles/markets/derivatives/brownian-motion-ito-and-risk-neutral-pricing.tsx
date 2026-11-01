import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { stochasticCalculusData } from "./derivative-advanced-model-data";
import BrownianItoPricingMapViz from "./BrownianItoPricingMapViz";

export default function BrownianItoPricingArticle() {
  return (
    <div className="space-y-16">
      <BrownianItoPricingMapViz />
      <DerivativeDeepArticle data={stochasticCalculusData} />
    </div>
  );
}
