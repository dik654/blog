import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { greeksData } from "./derivative-data";
import GammaCurveViz from "./option-greeks-volatility-and-dynamic-hedging/viz/GammaCurveViz";
import RehedgeViz from "./option-greeks-volatility-and-dynamic-hedging/viz/RehedgeViz";

export default function OptionGreeksArticle() {
  return (
    <DerivativeDeepArticle
      data={greeksData}
      vizBefore={{
        case: { 0: <GammaCurveViz /> },
        mechanism: { 0: <RehedgeViz /> },
      }}
    />
  );
}
