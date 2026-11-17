import ComplianceEvidenceArticle from "../compliance-evidence-article";
import DeletionFanoutViz from "./viz/DeletionFanoutViz";
import HoldDeadlineTimelineViz from "./viz/HoldDeadlineTimelineViz";
import RestoreTombstoneViz from "./viz/RestoreTombstoneViz";

// Static shared-template anchors: id="overview" id="purpose-retention-ledger" id="deletion-derived-data" id="lifecycle-release" id="paper-pipa-lifecycle" id="paper-kisa-privacy-lifecycle"
export default function ModernArticle() {
  return (
    <ComplianceEvidenceArticle
      article="isms-privacy-lifecycle"
      vizBefore={{
        "first-1": <HoldDeadlineTimelineViz />,
        "second-0": <DeletionFanoutViz />,
        "second-1": <RestoreTombstoneViz />,
      }}
    />
  );
}
