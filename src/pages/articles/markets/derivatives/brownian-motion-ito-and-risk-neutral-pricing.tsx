import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { stochasticCalculusData } from "./derivative-advanced-model-data";
import ConvexGapViz from "./brownian-motion-ito-and-risk-neutral-pricing/viz/ConvexGapViz";
import HedgeCancelViz from "./brownian-motion-ito-and-risk-neutral-pricing/viz/HedgeCancelViz";
import SplitDayViz from "./brownian-motion-ito-and-risk-neutral-pricing/viz/SplitDayViz";

const VIZ_BEFORE = {
  "black-box": { 0: <SplitDayViz /> },
  case: { 0: <ConvexGapViz /> },
  mechanism: { 0: <HedgeCancelViz /> },
} as const;

export default function BrownianItoPricingArticle() {
  return <DerivativeDeepArticle data={stochasticCalculusData} vizBefore={VIZ_BEFORE} />;
}
