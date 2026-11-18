import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { interestRateModelsData } from "./derivative-advanced-model-data";
import CurveModelsViz from "./short-rate-hjm-and-interest-rate-model-risk/viz/CurveModelsViz";
import HjmDriftViz from "./short-rate-hjm-and-interest-rate-model-risk/viz/HjmDriftViz";
import VasicekDayViz from "./short-rate-hjm-and-interest-rate-model-risk/viz/VasicekDayViz";

export default function InterestRateModelsArticle() {
  return (
    <DerivativeDeepArticle
      data={interestRateModelsData}
      vizBefore={{
        overview: { 1: <VasicekDayViz /> },
        case: { 0: <HjmDriftViz /> },
        picture: { 0: <CurveModelsViz /> },
      }}
    />
  );
}
