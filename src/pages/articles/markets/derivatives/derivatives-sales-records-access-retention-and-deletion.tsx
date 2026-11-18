import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { derivativesRecordsPrivacyData } from "./derivative-curriculum-gaps-data";
import AccessRequestViz from "./derivatives-sales-records-access-retention-and-deletion/viz/AccessRequestViz";
import CaseTimelineViz from "./derivatives-sales-records-access-retention-and-deletion/viz/CaseTimelineViz";
import RecordLifecycleViz from "./derivatives-sales-records-access-retention-and-deletion/viz/RecordLifecycleViz";

export default function DerivativesRecordsPrivacyArticle() {
  return (
    <DerivativeDeepArticle
      data={derivativesRecordsPrivacyData}
      vizBefore={{
        case: { 0: <CaseTimelineViz /> },
        picture: { 0: <RecordLifecycleViz /> },
        mechanism: { 1: <AccessRequestViz /> },
      }}
    />
  );
}
