import CloudCertificationArticle from "../cloud/CloudCertificationArticle";
import { softwareCompatibilityData } from "./ai-infrastructure-study/data";
import OfedLineageViz from "./ai-cluster-software-compatibility/viz/OfedLineageViz";
import ReleaseSnapshotViz from "./ai-cluster-software-compatibility/viz/ReleaseSnapshotViz";

export default function SoftwareCompatibilityArticle() {
  return (
    <CloudCertificationArticle
      data={softwareCompatibilityData}
      paragraphLead={{
        names: { 2: <OfedLineageViz /> },
        source: { 0: <ReleaseSnapshotViz /> },
      }}
    />
  );
}
