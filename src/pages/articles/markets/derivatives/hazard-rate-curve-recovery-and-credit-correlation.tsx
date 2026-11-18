import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { creditIntensityData } from "./derivative-advanced-model-data";
import BootstrapViz from "./hazard-rate-curve-recovery-and-credit-correlation/viz/BootstrapViz";
import JointDefaultGridViz from "./hazard-rate-curve-recovery-and-credit-correlation/viz/JointDefaultGridViz";
import PremiumTimelineViz from "./hazard-rate-curve-recovery-and-credit-correlation/viz/PremiumTimelineViz";
import RecoveryTradeoffViz from "./hazard-rate-curve-recovery-and-credit-correlation/viz/RecoveryTradeoffViz";

export default function CreditIntensityArticle() {
  return (
    <DerivativeDeepArticle
      data={creditIntensityData}
      vizBefore={{
        "black-box": { 0: <PremiumTimelineViz /> },
        picture: { 1: <JointDefaultGridViz /> },
        need: { 0: <BootstrapViz /> },
        limits: { 0: <RecoveryTradeoffViz /> },
      }}
    />
  );
}
