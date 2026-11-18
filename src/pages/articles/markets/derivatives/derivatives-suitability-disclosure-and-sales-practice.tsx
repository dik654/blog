import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { salesPracticeData } from "./derivative-data";
import ExposureFitViz from "./derivatives-suitability-disclosure-and-sales-practice/viz/ExposureFitViz";
import ObligationSplitViz from "./derivatives-suitability-disclosure-and-sales-practice/viz/ObligationSplitViz";
import SalesProcessLoopViz from "./derivatives-suitability-disclosure-and-sales-practice/viz/SalesProcessLoopViz";
import SuitabilityBranchViz from "./derivatives-suitability-disclosure-and-sales-practice/viz/SuitabilityBranchViz";

export default function DerivativesSalesPracticeArticle() {
  return (
    <DerivativeDeepArticle
      data={salesPracticeData}
      vizBefore={{
        case: { 0: <ObligationSplitViz /> },
        picture: { 0: <SuitabilityBranchViz /> },
        need: { 0: <ExposureFitViz /> },
        mechanism: { 0: <SalesProcessLoopViz /> },
      }}
    />
  );
}
