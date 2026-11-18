import CloudCertificationArticle from "./CloudCertificationArticle";
import { azureAz900Data } from "./azureData";
import ConnectionPathViz from "./azure-az900-fast-study/viz/ConnectionPathViz";
import ScopeReachViz from "./azure-az900-fast-study/viz/ScopeReachViz";

export default function AzureAz900Article() {
  return (
    <CloudCertificationArticle
      data={azureAz900Data}
      sectionLead={{ picture: <ScopeReachViz />, comparison: <ConnectionPathViz /> }}
    />
  );
}
