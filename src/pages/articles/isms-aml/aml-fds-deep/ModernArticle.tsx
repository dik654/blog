import ComplianceEvidenceArticle from "../compliance-evidence-article";
import LabelPopulationViz from "./viz/LabelPopulationViz";
import PointInTimeWindowViz from "./viz/PointInTimeWindowViz";
import QueueLoadViz from "./viz/QueueLoadViz";

// Static shared-template anchors: id="overview" id="signal-case-pipeline" id="rules-model-chain" id="fds-release" id="paper-fatf-vasp-monitoring" id="paper-kofiu-str-fds"
export default function ModernArticle() {
  return (
    <ComplianceEvidenceArticle
      article="aml-fds-deep"
      vizBefore={{
        "first-0": <PointInTimeWindowViz />,
        "second-0": <LabelPopulationViz />,
        "second-1": <QueueLoadViz />,
      }}
    />
  );
}
