import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { optionPricingData } from "./derivative-model-data";
import AmericanPutTreeViz from "./binomial-black-scholes-and-early-exercise/viz/AmericanPutTreeViz";
import CrrConvergenceViz from "./binomial-black-scholes-and-early-exercise/viz/CrrConvergenceViz";

export default function BinomialBlackScholesArticle() {
  return (
    <DerivativeDeepArticle
      data={optionPricingData}
      vizBefore={{
        case: { 0: <AmericanPutTreeViz /> },
        need: { 2: <CrrConvergenceViz /> },
      }}
    />
  );
}
