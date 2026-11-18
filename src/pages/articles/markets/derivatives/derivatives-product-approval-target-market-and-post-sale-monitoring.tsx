import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { productGovernanceData } from "./derivative-operations-and-governance-data";
import ComplaintAlertViz from "./derivatives-product-approval-target-market-and-post-sale-monitoring/viz/ComplaintAlertViz";
import MakerSellerLoopViz from "./derivatives-product-approval-target-market-and-post-sale-monitoring/viz/MakerSellerLoopViz";
import PayoffAsymmetryViz from "./derivatives-product-approval-target-market-and-post-sale-monitoring/viz/PayoffAsymmetryViz";

export default function DerivativesProductGovernanceArticle() {
  return (
    <DerivativeDeepArticle
      data={productGovernanceData}
      vizBefore={{
        case: { 0: <PayoffAsymmetryViz /> },
        mechanism: { 1: <ComplaintAlertViz /> },
        comparison: { 0: <MakerSellerLoopViz /> },
      }}
    />
  );
}
