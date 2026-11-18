import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { minimumVarianceHedgeData } from "./derivative-model-data";
import HedgeDayViz from "./minimum-variance-hedge-ratio-and-basis-risk/viz/HedgeDayViz";
import VarianceCurveViz from "./minimum-variance-hedge-ratio-and-basis-risk/viz/VarianceCurveViz";

export default function MinimumVarianceHedgeRatioArticle() {
  return (
    <DerivativeDeepArticle
      data={minimumVarianceHedgeData}
      vizBefore={{
        picture: { 0: <HedgeDayViz />, 1: <VarianceCurveViz /> },
      }}
    />
  );
}
