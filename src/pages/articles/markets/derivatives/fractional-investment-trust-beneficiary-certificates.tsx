import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { fractionalTrustCertificatesData } from "./derivative-specialized-market-gaps-data";
import TradingScopeTimelineViz from "./fractional-investment-trust-beneficiary-certificates/viz/TradingScopeTimelineViz";
import TrustCashFlowViz from "./fractional-investment-trust-beneficiary-certificates/viz/TrustCashFlowViz";

export default function FractionalTrustCertificatesArticle() {
  return (
    <DerivativeDeepArticle
      data={fractionalTrustCertificatesData}
      vizBefore={{
        picture: { 0: <TrustCashFlowViz /> },
        comparison: { 0: <TradingScopeTimelineViz /> },
      }}
    />
  );
}
