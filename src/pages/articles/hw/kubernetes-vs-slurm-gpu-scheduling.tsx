import CloudCertificationArticle from "../cloud/CloudCertificationArticle";
import { schedulerChoiceData } from "./ai-infrastructure-study/data";
import GangAllocationViz from "./kubernetes-vs-slurm-gpu-scheduling/viz/GangAllocationViz";
import ReconcileGenerationViz from "./kubernetes-vs-slurm-gpu-scheduling/viz/ReconcileGenerationViz";

export default function SchedulerChoiceArticle() {
  return (
    <CloudCertificationArticle
      data={schedulerChoiceData}
      paragraphLead={{
        case: { 0: <GangAllocationViz /> },
        comparison: { 1: <ReconcileGenerationViz /> },
      }}
    />
  );
}
