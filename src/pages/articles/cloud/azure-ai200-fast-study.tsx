import CloudCertificationArticle from "./CloudCertificationArticle";
import { azureAi200Data } from "./azureData";
import QueueRulesViz from "./azure-ai200-fast-study/viz/QueueRulesViz";
import SyncWaitViz from "./azure-ai200-fast-study/viz/SyncWaitViz";
import TraceJoinViz from "./azure-ai200-fast-study/viz/TraceJoinViz";

export default function AzureAi200FastStudyArticle() {
  return (
    <CloudCertificationArticle
      data={azureAi200Data}
      sectionLead={{ overview: <SyncWaitViz />, need: <QueueRulesViz />, mechanism: <TraceJoinViz /> }}
    />
  );
}
