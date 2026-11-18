import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { derivativesAmlData } from "./derivative-professional-practice-data";
import AlertDecisionViz from "./derivatives-aml-kyc-and-suspicious-transaction-monitoring/viz/AlertDecisionViz";
import CaseTimelineViz from "./derivatives-aml-kyc-and-suspicious-transaction-monitoring/viz/CaseTimelineViz";

export default function DerivativesAmlArticle() {
  return (
    <DerivativeDeepArticle
      data={derivativesAmlData}
      vizBefore={{
        picture: { 0: <CaseTimelineViz /> },
        mechanism: { 0: <AlertDecisionViz /> },
      }}
    />
  );
}
