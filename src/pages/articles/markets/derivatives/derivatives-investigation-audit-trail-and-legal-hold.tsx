import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { derivativesInvestigationData } from "./derivative-specialized-market-gaps-data";
import ClockZoomViz from "./derivatives-investigation-audit-trail-and-legal-hold/viz/ClockZoomViz";
import EvidenceMergeViz from "./derivatives-investigation-audit-trail-and-legal-hold/viz/EvidenceMergeViz";
import LegalHoldScopeViz from "./derivatives-investigation-audit-trail-and-legal-hold/viz/LegalHoldScopeViz";

export default function DerivativesInvestigationArticle() {
  return (
    <DerivativeDeepArticle
      data={derivativesInvestigationData}
      vizBefore={{
        case: { 0: <ClockZoomViz /> },
        picture: { 0: <EvidenceMergeViz /> },
        names: { 1: <LegalHoldScopeViz /> },
      }}
    />
  );
}
