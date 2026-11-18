import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { collateralOptimizationData } from "./derivative-curriculum-gaps-data";
import ConcentrationMixViz from "./collateral-optimization-eligibility-haircuts-and-liquidity/viz/ConcentrationMixViz";
import HaircutGrossUpViz from "./collateral-optimization-eligibility-haircuts-and-liquidity/viz/HaircutGrossUpViz";

export default function CollateralOptimizationArticle() {
  return (
    <DerivativeDeepArticle
      data={collateralOptimizationData}
      vizBefore={{
        case: { 0: <HaircutGrossUpViz /> },
        mechanism: { 0: <ConcentrationMixViz /> },
      }}
    />
  );
}
