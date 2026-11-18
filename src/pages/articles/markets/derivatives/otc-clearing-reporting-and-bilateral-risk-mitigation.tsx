import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { otcInfrastructureData } from "./derivative-jurisdiction-data";
import ContractDenominatorViz from "./otc-clearing-reporting-and-bilateral-risk-mitigation/viz/ContractDenominatorViz";
import RiskAndDataRouteViz from "./otc-clearing-reporting-and-bilateral-risk-mitigation/viz/RiskAndDataRouteViz";

export default function OtcClearingReportingArticle() {
  return (
    <DerivativeDeepArticle
      data={otcInfrastructureData}
      vizBefore={{
        case: { 0: <ContractDenominatorViz /> },
        picture: { 0: <RiskAndDataRouteViz /> },
      }}
    />
  );
}
