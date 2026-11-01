import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { disputesData } from "./derivative-professional-practice-data";
import DerivativesDisputeEvidenceViz from "./DerivativesDisputeEvidenceViz";

export default function DerivativesDisputesArticle() {
  return (
    <div className="space-y-16">
      <DerivativesDisputeEvidenceViz />
      <DerivativeDeepArticle data={disputesData} />
    </div>
  );
}
