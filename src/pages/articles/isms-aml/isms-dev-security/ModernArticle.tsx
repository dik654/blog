import IsmsOperationsArticle from "../isms-operations-article";
import RollbackScopeViz from "./viz/RollbackScopeViz";
import SameArtifactViz from "./viz/SameArtifactViz";
import ScannerSignalViz from "./viz/ScannerSignalViz";
// Static audit index: id="overview" id="secure-development" id="build-deploy-gate" id="change-release" id="paper-nist-ssdf" id="paper-owasp-asvs" id="paper-kisa-isms-guide-dev"
export default function ModernDevSecurityArticle() {
  return (
    <IsmsOperationsArticle
      article="isms-dev-security"
      vizBefore={{
        "first:1": <ScannerSignalViz />,
        "second:0": <SameArtifactViz />,
        "second:2": <RollbackScopeViz />,
      }}
    />
  );
}
