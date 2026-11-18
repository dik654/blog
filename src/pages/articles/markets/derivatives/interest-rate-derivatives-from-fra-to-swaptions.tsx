import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { ratesData } from "./derivative-data";
import FraTimelineViz from "./interest-rate-derivatives-from-fra-to-swaptions/viz/FraTimelineViz";
import ProductStripViz from "./interest-rate-derivatives-from-fra-to-swaptions/viz/ProductStripViz";
import SwapRateBalanceViz from "./interest-rate-derivatives-from-fra-to-swaptions/viz/SwapRateBalanceViz";

export default function InterestRateDerivativesArticle() {
  return (
    <DerivativeDeepArticle
      data={ratesData}
      vizBefore={{
        case: { 0: <FraTimelineViz /> },
        picture: { 0: <ProductStripViz /> },
        source: { 1: <SwapRateBalanceViz /> },
      }}
    />
  );
}
