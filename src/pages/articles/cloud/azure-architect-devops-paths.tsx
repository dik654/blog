import CloudCertificationArticle from "./CloudCertificationArticle";
import { azureArchitectDevopsData } from "./azureData";
import CanaryStepViz from "./azure-architect-devops-paths/viz/CanaryStepViz";
import ExpertPrereqMapViz from "./azure-architect-devops-paths/viz/ExpertPrereqMapViz";
import TwoRegionsOneDeployViz from "./azure-architect-devops-paths/viz/TwoRegionsOneDeployViz";

export default function AzureArchitectDevopsArticle() {
  return (
    <CloudCertificationArticle
      data={azureArchitectDevopsData}
      sectionLead={{ overview: <TwoRegionsOneDeployViz />, case: <CanaryStepViz />, names: <ExpertPrereqMapViz /> }}
    />
  );
}
