import CloudCertificationArticle from "../cloud/CloudCertificationArticle";
import { storageIoData } from "./ai-infrastructure-study/data";
import CheckpointCompletionViz from "./ai-cluster-storage-io/viz/CheckpointCompletionViz";
import InFlightRequestsViz from "./ai-cluster-storage-io/viz/InFlightRequestsViz";
import IoBudgetOverlapViz from "./ai-cluster-storage-io/viz/IoBudgetOverlapViz";
import ReadPathLayersViz from "./ai-cluster-storage-io/viz/ReadPathLayersViz";
import RebuildSpreadViz from "./ai-cluster-storage-io/viz/RebuildSpreadViz";
import SteadyStateWindowViz from "./ai-cluster-storage-io/viz/SteadyStateWindowViz";

export default function AiClusterStorageArticle() {
  return (
    <CloudCertificationArticle
      data={storageIoData}
      paragraphLead={{
        case: { 1: <InFlightRequestsViz /> },
        need: { 1: <CheckpointCompletionViz /> },
        mechanism: { 2: <IoBudgetOverlapViz /> },
        source: { 0: <ReadPathLayersViz /> },
        comparison: { 4: <SteadyStateWindowViz /> },
        limits: { 5: <RebuildSpreadViz /> },
      }}
    />
  );
}
