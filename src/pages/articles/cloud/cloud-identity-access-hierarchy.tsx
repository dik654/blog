import CloudCertificationArticle from "./CloudCertificationArticle";
import { identityHierarchyData } from "./commonData";
import ScopeTreeViz from "./cloud-identity-access-hierarchy/viz/ScopeTreeViz";
import DecisionGateViz from "./cloud-identity-access-hierarchy/viz/DecisionGateViz";
import AzureOverlayViz from "./cloud-identity-access-hierarchy/viz/AzureOverlayViz";

export default function CloudIdentityArticle() {
  return (
    <CloudCertificationArticle
      data={identityHierarchyData}
      sectionLead={{
        picture: <ScopeTreeViz />,
        mechanism: <DecisionGateViz />,
        comparison: <AzureOverlayViz />,
      }}
    />
  );
}
