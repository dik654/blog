import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { creditDerivativeData } from "./derivative-risk-data";
import CorrelationTrancheViz from "./credit-derivatives-default-risk-and-tranches/viz/CorrelationTrancheViz";
import SettlementPathsViz from "./credit-derivatives-default-risk-and-tranches/viz/SettlementPathsViz";
import TrancheFillViz from "./credit-derivatives-default-risk-and-tranches/viz/TrancheFillViz";

export default function CreditDerivativeArticle() {
  return (
    <DerivativeDeepArticle
      data={creditDerivativeData}
      vizBefore={{
        "black-box": { 1: <SettlementPathsViz /> },
        picture: { 1: <TrancheFillViz /> },
        need: { 1: <CorrelationTrancheViz /> },
      }}
    />
  );
}
