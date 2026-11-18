import CloudCertificationArticle from "../cloud/CloudCertificationArticle";
import { b300BlueprintData } from "./ai-infrastructure-study/data";
import ExpansionBoundaryViz from "./ai-infrastructure-b300-128-blueprint/viz/ExpansionBoundaryViz";
import NodeExpansionViz from "./ai-infrastructure-b300-128-blueprint/viz/NodeExpansionViz";

export default function B300BlueprintArticle() {
  return (
    <CloudCertificationArticle
      data={b300BlueprintData}
      paragraphLead={{
        source: { 0: <NodeExpansionViz /> },
        comparison: { 0: <ExpansionBoundaryViz /> },
      }}
    />
  );
}
