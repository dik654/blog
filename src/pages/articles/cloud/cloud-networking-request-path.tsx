import CloudCertificationArticle from "./CloudCertificationArticle";
import { networkingRequestPathData } from "./systemsData";
import InOutPathMapViz from "./cloud-networking-request-path/viz/InOutPathMapViz";
import PrivateEndpointDnsViz from "./cloud-networking-request-path/viz/PrivateEndpointDnsViz";
import StatefulVsStatelessViz from "./cloud-networking-request-path/viz/StatefulVsStatelessViz";

export default function CloudNetworkingArticle() {
  return (
    <CloudCertificationArticle
      data={networkingRequestPathData}
      sectionLead={{ picture: <InOutPathMapViz />, need: <StatefulVsStatelessViz /> }}
      paragraphLead={{ comparison: { 1: <PrivateEndpointDnsViz /> } }}
    />
  );
}
