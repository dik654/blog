import IsmsOperationsArticle from "../isms-operations-article";
import FailureDomainViz from "./viz/FailureDomainViz";
import GenerationMixViz from "./viz/GenerationMixViz";
import RecoveryTimelineViz from "./viz/RecoveryTimelineViz";
// Static audit index: id="overview" id="bia-rpo-rto" id="backup-restore" id="recovery-release" id="paper-nist-contingency-planning" id="paper-kisa-isms-guide-backup"
export default function ModernBackupRecoveryArticle() {
  return (
    <IsmsOperationsArticle
      article="isms-backup-recovery"
      vizBefore={{
        "first:0": <RecoveryTimelineViz />,
        "first:1": <FailureDomainViz />,
        "second:0": <GenerationMixViz />,
      }}
    />
  );
}
