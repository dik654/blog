import CloudCertificationArticle from "./CloudCertificationArticle";
import { computeSelectionData } from "./systemsData";
import PeakConcurrencyViz from "./cloud-compute-selection/viz/PeakConcurrencyViz";
import StateOutsideViz from "./cloud-compute-selection/viz/StateOutsideViz";

export default function CloudComputeSelectionArticle() {
  return (
    <CloudCertificationArticle
      data={computeSelectionData}
      sectionLead={{ case: <PeakConcurrencyViz />, need: <StateOutsideViz /> }}
    />
  );
}
