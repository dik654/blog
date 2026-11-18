import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { collateralOperationsData } from "./derivative-operations-and-governance-data";
import MarginCallWaterfallViz from "./collateral-operations-margin-calls-disputes-and-substitution/viz/MarginCallWaterfallViz";
import ResponseDeadlineViz from "./collateral-operations-margin-calls-disputes-and-substitution/viz/ResponseDeadlineViz";
import SubstitutionOrderViz from "./collateral-operations-margin-calls-disputes-and-substitution/viz/SubstitutionOrderViz";

export default function CollateralOperationsArticle() {
  return (
    <DerivativeDeepArticle
      data={collateralOperationsData}
      vizBefore={{
        overview: { 0: <MarginCallWaterfallViz /> },
        need: { 0: <SubstitutionOrderViz /> },
        source: { 1: <ResponseDeadlineViz /> },
      }}
    />
  );
}
