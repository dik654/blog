import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { disputesData } from "./derivative-professional-practice-data";
import ComplaintHandlingViz from "./derivatives-complaints-dispute-resolution-and-evidence/viz/ComplaintHandlingViz";
import EvidenceTimelineViz from "./derivatives-complaints-dispute-resolution-and-evidence/viz/EvidenceTimelineViz";

export default function DerivativesDisputesArticle() {
  return (
    <DerivativeDeepArticle
      data={disputesData}
      vizBefore={{
        picture: { 0: <EvidenceTimelineViz /> },
        mechanism: { 0: <ComplaintHandlingViz /> },
      }}
    />
  );
}
