import IsmsOperationsArticle from "../isms-operations-article";
import ContainmentBranchViz from "./viz/ContainmentBranchViz";
import CustodyViz from "./viz/CustodyViz";
// Static audit index: id="overview" id="triage-containment" id="evidence-recovery" id="incident-release" id="paper-nist-incident-response" id="paper-kisa-isms-guide-incident"
export default function ModernIncidentResponseArticle() {
  return (
    <IsmsOperationsArticle
      article="isms-incident-response"
      vizBefore={{
        "first:1": <ContainmentBranchViz />,
        "first:2": <CustodyViz />,
      }}
    />
  );
}
