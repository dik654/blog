import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { noArbitrageData } from "./derivative-data";
import BasisConvergenceViz from "./no-arbitrage-cost-of-carry-and-basis/viz/BasisConvergenceViz";
import HedgedVsForecastViz from "./no-arbitrage-cost-of-carry-and-basis/viz/HedgedVsForecastViz";
import NoTradeBandViz from "./no-arbitrage-cost-of-carry-and-basis/viz/NoTradeBandViz";

export default function NoArbitrageCostOfCarryArticle() {
  return (
    <DerivativeDeepArticle
      data={noArbitrageData}
      vizBefore={{
        picture: { 0: <HedgedVsForecastViz /> },
        mechanism: { 0: <NoTradeBandViz />, 1: <BasisConvergenceViz /> },
      }}
    />
  );
}
