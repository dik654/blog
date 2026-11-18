import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { equityDispersionData } from "./derivative-specialized-market-gaps-data";
import IndexVarianceGridViz from "./equity-dispersion-implied-correlation-and-variance/viz/IndexVarianceGridViz";
import IndexArrowViz from "./equity-dispersion-implied-correlation-and-variance/viz/IndexArrowViz";
import ImpliedCorrelationBackoutViz from "./equity-dispersion-implied-correlation-and-variance/viz/ImpliedCorrelationBackoutViz";

export default function EquityDispersionArticle() {
  return (
    <DerivativeDeepArticle
      data={equityDispersionData}
      vizBefore={{
        case: { 0: <IndexVarianceGridViz /> },
        picture: { 0: <IndexArrowViz /> },
        source: { 0: <ImpliedCorrelationBackoutViz /> },
      }}
    />
  );
}
