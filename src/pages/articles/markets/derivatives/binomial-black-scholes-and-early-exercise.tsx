import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { optionPricingData } from "./derivative-model-data";

export default function BinomialBlackScholesArticle() {
  return <DerivativeDeepArticle data={optionPricingData} />;
}
