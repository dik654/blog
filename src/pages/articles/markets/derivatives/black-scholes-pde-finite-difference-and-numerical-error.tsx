import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { finiteDifferenceData } from "./derivative-advanced-model-data";

export default function FiniteDifferencePricingArticle() {
  return <DerivativeDeepArticle data={finiteDifferenceData} />;
}
