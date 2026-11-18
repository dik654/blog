import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { portfolioCompressionData } from "./derivative-curriculum-gaps-data";
import LedgerSyncViz from "./portfolio-compression-risk-tolerances-and-records/viz/LedgerSyncViz";
import NetGrossWalkViz from "./portfolio-compression-risk-tolerances-and-records/viz/NetGrossWalkViz";

export default function PortfolioCompressionArticle() {
  return (
    <DerivativeDeepArticle
      data={portfolioCompressionData}
      vizBefore={{
        case: { 0: <NetGrossWalkViz /> },
        mechanism: { 0: <LedgerSyncViz /> },
      }}
    />
  );
}
