import CloudCertificationArticle from "./CloudCertificationArticle";
import { azureAz104Data } from "./azureData";
import AvailabilityPlacementViz from "./azure-az104-fast-study/viz/AvailabilityPlacementViz";
import DnsPathViz from "./azure-az104-fast-study/viz/DnsPathViz";
import RoleScopeViz from "./azure-az104-fast-study/viz/RoleScopeViz";

export default function AzureAz104Article() {
  return (
    <CloudCertificationArticle
      data={azureAz104Data}
      sectionLead={{ case: <RoleScopeViz />, picture: <DnsPathViz />, comparison: <AvailabilityPlacementViz /> }}
    />
  );
}
