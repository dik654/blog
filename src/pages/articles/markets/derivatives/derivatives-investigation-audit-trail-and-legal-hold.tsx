import DerivativeDeepArticle from "./DerivativeDeepArticle";
import DerivativesInvestigationTimelineViz from "./DerivativesInvestigationTimelineViz";
import { derivativesInvestigationData } from "./derivative-specialized-market-gaps-data";

export default function DerivativesInvestigationArticle() {
  return <div className="space-y-16"><DerivativesInvestigationTimelineViz /><DerivativeDeepArticle data={derivativesInvestigationData} /></div>;
}
