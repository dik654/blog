import DerivativeDeepArticle from "./DerivativeDeepArticle";
import DerivativesSalesRecordLifecycleViz from "./DerivativesSalesRecordLifecycleViz";
import { derivativesRecordsPrivacyData } from "./derivative-curriculum-gaps-data";

export default function DerivativesRecordsPrivacyArticle() {
  return <div className="space-y-16"><DerivativesSalesRecordLifecycleViz /><DerivativeDeepArticle data={derivativesRecordsPrivacyData} /></div>;
}
