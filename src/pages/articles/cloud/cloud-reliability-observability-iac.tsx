import CloudCertificationArticle from "./CloudCertificationArticle";
import { reliabilityObservabilityIacData } from "./systemsData";
import ManualFixOverwriteViz from "./cloud-reliability-observability-iac/viz/ManualFixOverwriteViz";
import ObservationZoomViz from "./cloud-reliability-observability-iac/viz/ObservationZoomViz";
import RecoveryTargetTimelineViz from "./cloud-reliability-observability-iac/viz/RecoveryTargetTimelineViz";

export default function CloudReliabilityArticle() {
  return (
    <CloudCertificationArticle
      data={reliabilityObservabilityIacData}
      sectionLead={{
        case: <RecoveryTargetTimelineViz />,
        picture: <ObservationZoomViz />,
        need: <ManualFixOverwriteViz />,
      }}
    />
  );
}
