import ComplianceEvidenceArticle from "../compliance-evidence-article";
import LeaverExpansionViz from "./viz/LeaverExpansionViz";
import SampleTraceViz from "./viz/SampleTraceViz";

// Static shared-template anchors: id="overview" id="scope-population-sample" id="trace-findings-remediation" id="audit-release" id="paper-kisa-isms-audit" id="paper-kisa-isms-site"
export default function ModernArticle() {
  return (
    <ComplianceEvidenceArticle
      article="isms-audit-checklist"
      vizBefore={{
        "first-2": <SampleTraceViz />,
        "second-0": <LeaverExpansionViz />,
      }}
    />
  );
}
