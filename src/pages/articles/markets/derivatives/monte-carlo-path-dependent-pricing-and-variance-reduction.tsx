import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { monteCarloData } from "./derivative-advanced-model-data";

export default function MonteCarloPricingArticle() {
  return <DerivativeDeepArticle data={monteCarloData} />;
}
