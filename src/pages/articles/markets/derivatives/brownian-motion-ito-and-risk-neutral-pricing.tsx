import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { stochasticCalculusData } from "./derivative-advanced-model-data";

export default function BrownianItoPricingArticle() {
  return <DerivativeDeepArticle data={stochasticCalculusData} />;
}
