import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { monteCarloData } from "./derivative-advanced-model-data";
import AntitheticPairViz from "./monte-carlo-path-dependent-pricing-and-variance-reduction/viz/AntitheticPairViz";
import AveragePathViz from "./monte-carlo-path-dependent-pricing-and-variance-reduction/viz/AveragePathViz";
import BarrierGridViz from "./monte-carlo-path-dependent-pricing-and-variance-reduction/viz/BarrierGridViz";
import LsmRegressionViz from "./monte-carlo-path-dependent-pricing-and-variance-reduction/viz/LsmRegressionViz";
import PathCountErrorViz from "./monte-carlo-path-dependent-pricing-and-variance-reduction/viz/PathCountErrorViz";

export default function MonteCarloPricingArticle() {
  return (
    <DerivativeDeepArticle
      data={monteCarloData}
      vizBefore={{
        overview: { 0: <AveragePathViz /> },
        case: { 0: <AntitheticPairViz /> },
        picture: { 0: <PathCountErrorViz /> },
        need: { 0: <BarrierGridViz />, 2: <LsmRegressionViz /> },
      }}
    />
  );
}
