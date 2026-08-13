import ArticleFlowViz from "@/components/viz/article-flow-viz";
import { AGENT_SANDBOX_FLOW } from "@/content/agent-sandbox-security";

export default function OverviewViz() {
  return <ArticleFlowViz steps={AGENT_SANDBOX_FLOW} />;
}
