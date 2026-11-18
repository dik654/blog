import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { yieldCurveData } from "./derivative-model-data";
import BootstrapDiscountViz from "./yield-curve-bootstrapping-multicurve-and-key-rate-hedging/viz/BootstrapDiscountViz";
import KeyRateViz from "./yield-curve-bootstrapping-multicurve-and-key-rate-hedging/viz/KeyRateViz";
import TwoCurveViz from "./yield-curve-bootstrapping-multicurve-and-key-rate-hedging/viz/TwoCurveViz";

export default function YieldCurveBootstrappingArticle() {
  return (
    <DerivativeDeepArticle
      data={yieldCurveData}
      vizBefore={{
        case: { 0: <BootstrapDiscountViz /> },
        need: { 0: <TwoCurveViz /> },
        mechanism: { 1: <KeyRateViz /> },
      }}
    />
  );
}
