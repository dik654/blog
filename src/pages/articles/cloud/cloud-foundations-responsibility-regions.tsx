import CloudCertificationArticle from "./CloudCertificationArticle";
import { cloudFoundationsData } from "./commonData";
import CapacitySlotsViz from "./cloud-foundations-responsibility-regions/viz/CapacitySlotsViz";
import FailureScopeViz from "./cloud-foundations-responsibility-regions/viz/FailureScopeViz";
import ResponsibilityLineViz from "./cloud-foundations-responsibility-regions/viz/ResponsibilityLineViz";

export default function CloudFoundationsArticle() {
  return (
    <CloudCertificationArticle
      data={cloudFoundationsData}
      sectionLead={{
        case: <CapacitySlotsViz />,
        picture: <FailureScopeViz />,
        need: <ResponsibilityLineViz />,
      }}
    />
  );
}
